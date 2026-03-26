import Anthropic from "@anthropic-ai/sdk";
import { after } from "next/server";
import { buildSystemPrompt, extractGameCode } from "@/lib/prompts/game-creator";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export const maxDuration = 60;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

function deltaQueueToSSE(deltas: string[], getDone: () => boolean) {
  let cursor = 0;
  const encoder = new TextEncoder();

  return new ReadableStream({
    async pull(controller) {
      while (cursor >= deltas.length && !getDone()) {
        await new Promise((r) => setTimeout(r, 15));
      }
      while (cursor < deltas.length) {
        const data = JSON.stringify({ text: deltas[cursor++] });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      }
      if (getDone() && cursor >= deltas.length) {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });
}

export async function POST(request: Request) {
  try {
    // Auth + studio lookup
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { data: studio } = await supabase
      .from("studios")
      .select("id")
      .eq("owner_id", user.id)
      .limit(1)
      .single();
    if (!studio) return Response.json({ error: "No studio found" }, { status: 400 });

    // Deduct credit
    const serviceClient = createServiceClient();
    const { data: deducted, error: deductError } = await serviceClient.rpc(
      "deduct_credit",
      { studio_id: studio.id }
    );
    if (deductError) {
      console.error("Credit deduction error:", deductError);
      return Response.json({ error: "Failed to process credits" }, { status: 500 });
    }
    if (!deducted) {
      return Response.json({ error: "insufficient_credits" }, { status: 402 });
    }

    // Parse request
    const { messages, genre, currentGameCode, gameProjectId, gameName } =
      (await request.json()) as {
        messages: { role: "user" | "assistant"; content: string }[];
        genre?: string;
        currentGameCode?: string;
        gameProjectId?: string;
        gameName?: string;
      };
    if (!messages?.length) {
      return Response.json({ error: "Messages are required" }, { status: 400 });
    }

    // Build prompt
    let systemPrompt = buildSystemPrompt(genre);
    if (currentGameCode) {
      systemPrompt += `\n\n## CURRENT GAME CODE\nThe user has an existing game. Here is the current code:\n\n\`\`\`html\n${currentGameCode}\n\`\`\`\n\nModify this code based on the user's request. Generate the COMPLETE updated file.`;
    }

    // Start Claude stream — runs server-side to completion via event callbacks
    const deltas: string[] = [];
    let streamDone = false;

    const stream = anthropic.messages
      .stream({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8192,
        system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      })
      .on("text", (text) => deltas.push(text))
      .on("end", () => { streamDone = true; })
      .on("error", () => { streamDone = true; });

    // Persist game + chat after response closes
    after(async () => {
      try {
        const msg = await stream.finalMessage();
        const fullText = msg.content
          .filter((b) => b.type === "text")
          .map((b) => b.text)
          .join("");

        const gameCode = extractGameCode(fullText);
        if (!gameCode) return;

        let projectId = gameProjectId;

        if (projectId) {
          await serviceClient
            .from("game_projects")
            .update({ game_code: gameCode, updated_at: new Date().toISOString() })
            .eq("id", projectId);
        } else {
          const name =
            gameName ||
            (messages[0]?.content.length > 40
              ? messages[0].content.slice(0, 40) + "..."
              : messages[0]?.content) ||
            "Untitled Game";

          const { data } = await serviceClient
            .from("game_projects")
            .insert({
              studio_id: studio.id,
              name,
              description: messages[0]?.content || null,
              status: "playable",
              game_code: gameCode,
              is_public: false,
            })
            .select("id")
            .single();

          projectId = data?.id;
        }

        if (projectId) {
          await serviceClient.from("chat_sessions").upsert(
            {
              studio_id: studio.id,
              game_project_id: projectId,
              messages: [
                ...messages.map((m) => ({
                  role: m.role,
                  content: m.content,
                  timestamp: new Date().toISOString(),
                })),
                {
                  role: "assistant",
                  content: fullText,
                  timestamp: new Date().toISOString(),
                },
              ],
              updated_at: new Date().toISOString(),
            },
            { onConflict: "game_project_id" }
          );
        }
      } catch (err) {
        console.error("Background save failed:", err);
      }
    });

    // Pipe deltas to client as SSE
    return new Response(deltaQueueToSSE(deltas, () => streamDone), {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

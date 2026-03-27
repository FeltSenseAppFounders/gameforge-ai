import Anthropic from "@anthropic-ai/sdk";
import { after } from "next/server";
import { buildSystemPrompt, extractGameCode } from "@/lib/prompts/game-creator";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export const maxDuration = 120;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const MAX_CONTINUATIONS = 2;
const CREDITS_MAX = 8; // MAX PRO (Opus)
const CREDITS_DEFAULT = 1; // MAX (Sonnet)
const CREDITS_CONTINUATION = 1; // Per continuation (always Sonnet)
const CREDITS_FINISH = 1; // Finish-or-fix fallback (always Sonnet)

// Detect if user is requesting a 3D game
function detect3D(messages: { role: string; content: string }[]): boolean {
  const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() ?? "";
  const keywords = ["3d", "three.js", "threejs", "first person", "third person", "voxel", "3d runner", "flight sim", "marble"];
  return keywords.some((k) => lastMsg.includes(k));
}

function deltaQueueToSSE(deltas: Record<string, string>[], getDone: () => boolean) {
  let cursor = 0;
  const encoder = new TextEncoder();

  return new ReadableStream({
    async pull(controller) {
      while (cursor >= deltas.length && !getDone()) {
        await new Promise((r) => setTimeout(r, 15));
      }
      while (cursor < deltas.length) {
        const data = JSON.stringify(deltas[cursor++]);
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

    // Parse request
    const { messages, genre, currentGameCode, gameProjectId, gameName, model } =
      (await request.json()) as {
        messages: { role: "user" | "assistant"; content: string }[];
        genre?: string;
        currentGameCode?: string;
        gameProjectId?: string;
        gameName?: string;
        model?: "max" | "max-pro";
      };
    if (!messages?.length) {
      return Response.json({ error: "Messages are required" }, { status: 400 });
    }

    const useOpus = model === "max-pro";
    const creditCost = useOpus ? CREDITS_MAX : CREDITS_DEFAULT;

    // Deduct credits atomically
    const serviceClient = createServiceClient();
    const { data: deducted, error: deductError } = await serviceClient.rpc(
      "deduct_credit",
      { studio_id: studio.id, amount: creditCost }
    );
    if (deductError) {
      console.error("Credit deduction error:", deductError);
      return Response.json({ error: "Failed to process credits" }, { status: 500 });
    }
    if (!deducted) {
      return Response.json({ error: "insufficient_credits" }, { status: 402 });
    }

    // Detect if user wants a 3D game
    const wants3D = detect3D(messages);

    // Build system prompt with optional genre hints and 3D mode
    let systemPrompt = buildSystemPrompt(genre, wants3D);
    if (currentGameCode) {
      systemPrompt += `\n\n## CURRENT GAME CODE\nThe user has an existing game. Here is the current code:\n\n\`\`\`html\n${currentGameCode}\n\`\`\`\n\nModify this code based on the user's request. Generate the COMPLETE updated file.`;
    }

    // Delta queue for SSE streaming
    const deltas: Record<string, string>[] = [];
    let streamDone = false;
    let accumulatedText = "";

    // Async streaming loop with auto-continue
    (async () => {
      try {
        let continuations = 0;
        let totalInputTokens = 0;
        let totalOutputTokens = 0;
        let totalCreditsUsed = creditCost; // Initial deduction already happened

        while (true) {
          const isFirst = continuations === 0;

          // Build messages — continuations append partial response + "continue" instruction
          const streamMessages: { role: "user" | "assistant"; content: string }[] = isFirst
            ? messages.map((m) => ({ role: m.role, content: m.content }))
            : [
                ...messages.map((m) => ({ role: m.role, content: m.content })),
                { role: "assistant", content: accumulatedText },
                { role: "user", content: "Continue exactly where you stopped. Output ONLY the remaining code — no repetition, no preamble, no explanation." },
              ];

          // First attempt: use selected model. Continuations: always Sonnet (cheaper).
          const useThinking = isFirst && useOpus;
          const stream = anthropic.messages.stream({
            model: isFirst && useOpus ? "claude-opus-4-6" : "claude-sonnet-4-6",
            max_tokens: useThinking ? 16000 : 16000,
            ...(useThinking ? { thinking: { type: "enabled" as const, budget_tokens: 5000 } } : {}),
            system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
            messages: streamMessages,
          });

          // Stream events into delta queue
          for await (const event of stream) {
            if (isFirst && event.type === "content_block_start") {
              const blockType = event.content_block.type;
              if (blockType === "thinking") {
                deltas.push({ status: "thinking" });
              } else if (blockType === "text") {
                deltas.push({ status: "generating" });
              }
            }
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              accumulatedText += event.delta.text;
              deltas.push({ text: event.delta.text });
            }
          }

          // Collect token usage
          const msg = await stream.finalMessage();
          totalInputTokens += msg.usage.input_tokens;
          totalOutputTokens += msg.usage.output_tokens;

          // Check if continuation is needed
          const needsContinuation =
            msg.stop_reason === "max_tokens" &&
            accumulatedText.includes("<!-- GAME_CODE_START -->") &&
            !accumulatedText.includes("<!-- GAME_CODE_END -->") &&
            continuations < MAX_CONTINUATIONS;

          if (needsContinuation) {
            // Server-side credit validation before continuing
            const { data: canContinue } = await serviceClient.rpc("deduct_credit", {
              studio_id: studio.id,
              amount: CREDITS_CONTINUATION,
            });
            if (!canContinue) {
              deltas.push({ status: "insufficient_credits_continue" });
              break;
            }
            continuations++;
            totalCreditsUsed += CREDITS_CONTINUATION;
            deltas.push({ status: "continuing", creditsUsed: String(totalCreditsUsed) });
            continue;
          }
          break;
        }

        // GUARANTEE: finish-or-fix fallback if game is still incomplete
        const gameIncomplete =
          accumulatedText.includes("<!-- GAME_CODE_START -->") &&
          !accumulatedText.includes("<!-- GAME_CODE_END -->");

        if (gameIncomplete) {
          // Server-side credit validation before finish call
          const { data: canFinish } = await serviceClient.rpc("deduct_credit", {
            studio_id: studio.id,
            amount: CREDITS_FINISH,
          });
          if (!canFinish) {
            deltas.push({ status: "insufficient_credits_continue" });
          } else {
            totalCreditsUsed += CREDITS_FINISH;
            deltas.push({ status: "finishing" });

            const finishStream = anthropic.messages.stream({
              model: "claude-sonnet-4-6",
              max_tokens: 4000,
              system: "You receive incomplete Phaser.js game HTML. Output ONLY the remaining code to make it runnable — close open functions, script tags, body, and html tags. Simplify remaining features if needed. Output raw code only — no markdown, no explanation.",
              messages: [
                { role: "user", content: `Here is the end of the incomplete game. Output ONLY what comes after the last line:\n\n${accumulatedText.slice(-3000)}` },
              ],
            });

            for await (const event of finishStream) {
              if (
                event.type === "content_block_delta" &&
                event.delta.type === "text_delta"
              ) {
                accumulatedText += event.delta.text;
                deltas.push({ text: event.delta.text });
              }
            }

            const finishMsg = await finishStream.finalMessage();
            totalInputTokens += finishMsg.usage.input_tokens;
            totalOutputTokens += finishMsg.usage.output_tokens;

            // Force-close tags if still missing
            if (!accumulatedText.includes("<!-- GAME_CODE_END -->")) {
              const closing = "\n</script>\n</body>\n</html>\n<!-- GAME_CODE_END -->";
              accumulatedText += closing;
              deltas.push({ text: closing });
            }
          }
        }

        // No text at all — push error
        if (!accumulatedText.trim()) {
          deltas.push({ error: "No response generated. Please try again." });
        }

        // Push token usage + credits summary as final delta
        deltas.push({
          usage: JSON.stringify({
            input_tokens: totalInputTokens,
            output_tokens: totalOutputTokens,
            credits_used: totalCreditsUsed,
          }),
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Stream error";
        deltas.push({ error: message });
      } finally {
        streamDone = true;
      }
    })();

    // Persist game + chat after response closes
    after(async () => {
      try {
        // Wait for streaming to finish
        while (!streamDone) await new Promise((r) => setTimeout(r, 100));

        const gameCode = extractGameCode(accumulatedText);
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
                  content: accumulatedText,
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

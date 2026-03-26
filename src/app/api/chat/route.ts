import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/prompts/game-creator";

export const maxDuration = 120;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Detect if user is requesting a 3D game
function detect3D(messages: { role: string; content: string }[]): boolean {
  const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() ?? "";
  const keywords = ["3d", "three.js", "threejs", "first person", "third person", "voxel", "3d runner", "flight sim", "marble"];
  return keywords.some((k) => lastMsg.includes(k));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, genre, currentGameCode } = body as {
      messages: { role: "user" | "assistant"; content: string }[];
      genre?: string;
      currentGameCode?: string;
    };

    if (!messages || messages.length === 0) {
      return Response.json({ error: "Messages are required" }, { status: 400 });
    }

    // Detect if user wants a 3D game
    const wants3D = detect3D(messages);

    // Build system prompt with optional genre hints and 3D mode
    let systemPrompt = buildSystemPrompt(genre, wants3D);

    // If there's existing game code, include it in context
    if (currentGameCode) {
      systemPrompt += `\n\n## CURRENT GAME CODE\nThe user has an existing game. Here is the current code:\n\n\`\`\`html\n${currentGameCode}\n\`\`\`\n\nModify this code based on the user's request. Generate the COMPLETE updated file.`;
    }

    // Stream the response — Opus 4.6 with adaptive thinking for best code quality
    const stream = anthropic.messages.stream({
      model: "claude-opus-4-6",
      max_tokens: 20000,
      thinking: { type: "enabled", budget_tokens: 10000 },
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    // Create a ReadableStream that forwards Claude's text deltas
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          let hasText = false;
          for await (const event of stream) {
            // Send phase status so the client gets bytes immediately
            if (event.type === "content_block_start") {
              const type = event.content_block.type;
              if (type === "thinking") {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: "thinking" })}\n\n`));
              } else if (type === "text") {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: "generating" })}\n\n`));
              }
            }
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              hasText = true;
              const data = JSON.stringify({ text: event.delta.text });
              controller.enqueue(
                encoder.encode(`data: ${data}\n\n`)
              );
            }
          }
          if (!hasText) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ error: "No response generated. Please try again." })}\n\n`)
            );
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Stream error";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: message })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return Response.json({ error: message }, { status: 500 });
  }
}

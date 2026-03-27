import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { extractGameCode } from "@/lib/prompts/game-creator";

export const maxDuration = 120;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const CREDITS_FIX = 2;

const FIX_SYSTEM_PROMPT = `You are a JavaScript game debugger. You receive a broken Phaser.js or Three.js game as a single HTML file, plus the runtime error message.

Your job:
1. Find the bug causing the error
2. Fix it
3. Return the COMPLETE corrected HTML file

Rules:
- Output ONLY the fixed HTML — no markdown fences, no explanation, no preamble
- Wrap the game code in <!-- GAME_CODE_START --> and <!-- GAME_CODE_END --> markers
- Preserve ALL game functionality — do not remove features
- Define ALL classes and functions BEFORE referencing them (JavaScript classes are NOT hoisted)
- If the error is a syntax error, carefully check brackets, parentheses, and semicolons
- If a variable/class is used before declaration, move the declaration above the usage`;

export async function POST(request: Request) {
  try {
    // Auth + studio lookup
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { data: studio } = await supabase
      .from("studios")
      .select("id")
      .eq("owner_id", user.id)
      .limit(1)
      .single();
    if (!studio)
      return Response.json({ error: "No studio found" }, { status: 400 });

    // Parse request
    const { gameCode, error: gameError } = (await request.json()) as {
      gameCode: string;
      error: string;
    };
    if (!gameCode || !gameError) {
      return Response.json(
        { error: "gameCode and error are required" },
        { status: 400 }
      );
    }

    // Server-side credit deduction
    const serviceClient = createServiceClient();
    const { data: deducted, error: deductError } = await serviceClient.rpc(
      "deduct_credit",
      { studio_id: studio.id, amount: CREDITS_FIX }
    );
    if (deductError) {
      console.error("Credit deduction error:", deductError);
      return Response.json(
        { error: "Failed to process credits" },
        { status: 500 }
      );
    }
    if (!deducted) {
      return Response.json(
        { error: "insufficient_credits" },
        { status: 402 }
      );
    }

    // Call Sonnet to fix the game
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 16000,
      system: FIX_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Runtime error:\n${gameError}\n\nBroken game code:\n${gameCode}`,
        },
      ],
    });

    const responseText =
      response.content[0].type === "text" ? response.content[0].text : "";
    const fixedCode = extractGameCode(responseText) || extractGameCode(responseText, false);

    return Response.json({
      fixedCode: fixedCode || null,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
      credits_used: CREDITS_FIX,
    });
  } catch (err) {
    console.error("Fix-game API error:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

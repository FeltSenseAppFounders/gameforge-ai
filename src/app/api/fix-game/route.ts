import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { extractGameCode } from "@/lib/prompts/game-creator";
import { rateLimit } from "@/lib/rate-limit";

export const maxDuration = 120;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const CREDITS_FIX = 2;

const FIX_SYSTEM_PROMPT = `You are an expert JavaScript game debugger specializing in Phaser.js 3 and Three.js browser games. You receive a broken game as a single HTML file, plus one or more runtime error messages with line numbers and stack traces.

Your job:
1. Analyze ALL error messages together — they often share a single root cause
2. Find and fix the root cause (not just symptoms)
3. Return the COMPLETE corrected HTML file

## COMMON LLM CODE GENERATION BUGS (check these first)

### Template Literal Issues
- NESTED BACKTICKS: Template literals inside template literals cause "Unexpected template string" errors. Fix by using string concatenation for the inner expression, or assign the inner template to a variable first.
  BAD:  \\\`outer \\\${obj.map(x => \\\`inner \\\${x}\\\`).join(',')}\\\`
  GOOD: \\\`outer \\\${obj.map(x => 'inner ' + x).join(',')}\\\`
- DOLLAR-BRACE with objects: \\\`\\\${someObject}\\\` produces "[object Object]". Access specific properties instead.

### Bracket/Brace/Parenthesis Mismatches
- Count opening and closing braces for every function, class, if/else, for/while block
- A single missing "}" at the end of a function causes cascading "Unexpected token" errors
- Pay special attention to nested callbacks, .forEach/.map/.filter chains, and event handlers

### Class & Function Hoisting
- JavaScript classes are NOT hoisted. If a class is used before its definition, move the class definition above the usage.
- Phaser scene classes MUST be defined before the new Phaser.Game({ scene: [MyScene] }) config
- Arrow functions and class methods are NOT hoisted either

### Scope & Reference Errors
- Variables declared with let/const inside a block are not accessible outside
- "this" inside arrow functions refers to the enclosing scope, not the class instance — use regular functions for Phaser callbacks

### Common Phaser.js Pitfalls
- this.physics.add.collider() requires both objects to be physics-enabled
- this.add.particles() API changed in Phaser 3.60+ — use this.add.particles(x, y, key, config)
- Texture keys must be created before any sprite references them

### Common Three.js Pitfalls
- renderer.domElement must be appended to document.body before use
- Materials require lights in the scene to be visible (except MeshBasicMaterial)
- requestAnimationFrame loop must call renderer.render(scene, camera)

## SECURITY RULES (MANDATORY — never violate)
- NEVER add fetch(), XMLHttpRequest, WebSocket, eval(), new Function(), or any network/dynamic-execution APIs
- NEVER add WebAssembly, Web Workers, or access device APIs (clipboard, geolocation, etc.)
- NEVER load external resources beyond the existing Phaser/Three.js CDN scripts
- If the broken code contains any of these, REMOVE them as part of the fix

## RULES
- Output ONLY the fixed HTML — no markdown fences, no explanation, no preamble
- Wrap the game code in <!-- GAME_CODE_START --> and <!-- GAME_CODE_END --> markers
- Preserve ALL game functionality — do not remove features, do not simplify the game
- If this is attempt 2 (retry), the previous fix did not work. Try a DIFFERENT approach:
  - Re-read the errors carefully — the root cause may not be what you assumed
  - Consider rewriting the problematic section from scratch rather than patching
  - Check for MULTIPLE bugs, not just one`;

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

    // Rate limit: 10 requests per minute per user (distributed via Supabase)
    if (!(await rateLimit(`fix-game:${user.id}`, 10, 60))) {
      return Response.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    // Require email verification before using credits
    if (!user.email_confirmed_at) {
      return Response.json(
        { error: "Please verify your email before using this feature." },
        { status: 403 }
      );
    }

    // Parse request (supports both new array format and legacy single error)
    const body = (await request.json()) as {
      gameCode?: string;
      gameProjectId?: string;
      errors?: string[];
      error?: string;
      attemptNumber?: number;
    };
    const { attemptNumber = 1 } = body;
    const errorMessages: string[] = body.errors
      ? body.errors
      : body.error
        ? [body.error]
        : [];

    // Resolve game code: prefer DB (when gameProjectId exists), fallback to client payload
    let gameCode = body.gameCode;
    if (!gameCode && body.gameProjectId) {
      const { data: project } = await supabase
        .from("game_projects")
        .select("game_code")
        .eq("id", body.gameProjectId)
        .eq("studio_id", studio.id) // authorization: user can only fix own games
        .single();
      gameCode = project?.game_code || undefined;
    }

    if (!gameCode || errorMessages.length === 0) {
      return Response.json(
        { error: "Game code and at least one error are required" },
        { status: 400 }
      );
    }

    // Input validation — prevent oversized payloads
    const MAX_GAME_CODE_LENGTH = 200_000;
    const MAX_ERROR_LENGTH = 2000;
    const MAX_ERRORS = 10;

    if (gameCode.length > MAX_GAME_CODE_LENGTH) {
      return Response.json({ error: "Game code too large" }, { status: 400 });
    }
    if (errorMessages.length > MAX_ERRORS) {
      return Response.json({ error: "Too many errors" }, { status: 400 });
    }
    for (const e of errorMessages) {
      if (typeof e !== "string" || e.length > MAX_ERROR_LENGTH) {
        return Response.json(
          { error: "Error message too long" },
          { status: 400 }
        );
      }
    }

    // Server-side credit deduction
    const serviceClient = createServiceClient();

    // Daily credit cap: 50/day free, 200/day paid
    const { data: dailyUsage } = await serviceClient.rpc("get_daily_credit_usage", {
      p_studio_id: studio.id,
    });
    const { data: studioData } = await supabase
      .from("studios")
      .select("subscription_tier")
      .eq("id", studio.id)
      .single();
    const dailyCap = studioData?.subscription_tier === "free" ? 50 : 200;
    if ((dailyUsage ?? 0) + CREDITS_FIX > dailyCap) {
      return Response.json(
        { error: "Daily credit limit reached. Try again tomorrow." },
        { status: 429 }
      );
    }

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

    // Audit log: fix-game deduction
    await serviceClient.from("credit_transactions").insert({
      studio_id: studio.id,
      amount: CREDITS_FIX,
      endpoint: "fix-game",
      model: "claude-sonnet-4-6",
    });

    // SSE streaming — delta queue pattern (matches /api/chat)
    const deltas: Record<string, string>[] = [];
    let streamDone = false;

    function deltaQueueToSSE() {
      let cursor = 0;
      const encoder = new TextEncoder();
      return new ReadableStream({
        async pull(controller) {
          while (cursor >= deltas.length && !streamDone) {
            await new Promise((r) => setTimeout(r, 15));
          }
          while (cursor < deltas.length) {
            const data = JSON.stringify(deltas[cursor++]);
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
          if (streamDone && cursor >= deltas.length) {
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          }
        },
      });
    }

    // Start streaming Claude fix
    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 16000,
      system: FIX_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            `Fix attempt: ${attemptNumber} of 2`,
            ``,
            `=== RUNTIME ERRORS (${errorMessages.length}) ===`,
            ...errorMessages.map((e, i) => `Error ${i + 1}:\n${e}`),
            ``,
            `=== BROKEN GAME CODE ===`,
            gameCode,
          ].join("\n"),
        },
      ],
    });

    deltas.push({ status: "fixing" });

    // Process stream in background, push deltas as they arrive
    const projectId = body.gameProjectId;
    (async () => {
      try {
        let accumulatedText = "";
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            accumulatedText += event.delta.text;
            deltas.push({ text: event.delta.text });
          }
        }

        const fixedCode = extractGameCode(accumulatedText) || extractGameCode(accumulatedText, false);

        // Persist fixed code to DB so subsequent attempts load the latest fix
        if (fixedCode && projectId) {
          await serviceClient
            .from("game_projects")
            .update({ game_code: fixedCode, updated_at: new Date().toISOString() })
            .eq("id", projectId);
        }

        const finalMessage = await stream.finalMessage();
        deltas.push({
          result: JSON.stringify({
            fixedCode: fixedCode || null,
            usage: {
              input_tokens: finalMessage.usage.input_tokens,
              output_tokens: finalMessage.usage.output_tokens,
            },
            credits_used: CREDITS_FIX,
          }),
        });
      } catch (err) {
        console.error("Fix-game stream error:", err);
        deltas.push({ error: err instanceof Error ? err.message : "Fix failed" });
      } finally {
        streamDone = true;
      }
    })();

    return new Response(deltaQueueToSSE(), {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Fix-game API error:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

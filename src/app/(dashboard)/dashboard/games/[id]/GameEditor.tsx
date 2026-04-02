"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ChatPanel } from "@/features/game-creator/ChatPanel";
import { GamePreview } from "@/features/game-creator/GamePreview";
import { extractGameCode } from "@/lib/prompts/game-creator";
import { extractPatches, applyPatches } from "@/lib/game-patcher";
import { readSSEStream } from "@/lib/sse-reader";
import { scanGameCode } from "@/lib/game-scanner";
import { createClient } from "@/lib/supabase/client";
import { useCredits } from "@/features/credits/CreditsProvider";
import type { ChatMessage } from "@/features/game-creator/ChatPanel";
import type { GameProject } from "@/core/types";

interface GameEditorProps {
  game: GameProject;
  initialMessages: { role: "user" | "assistant"; content: string }[];
}

export function GameEditor({ game, initialMessages }: GameEditorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialMessages.map((m) => ({ role: m.role, content: m.content }))
  );
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [gameCode, setGameCode] = useState<string | null>(
    game.game_code || null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [selectedModel, setSelectedModel] = useState<"max" | "max-pro">("max");
  const [streamPhase, setStreamPhase] = useState<"thinking" | "generating" | "continuing" | "finishing" | "building" | "polishing" | "auto-fixing" | null>(null);
  const [isAutoFixing, setIsAutoFixing] = useState(false);
  const [autoFixExhausted, setAutoFixExhausted] = useState(false);
  const [tokenUsage, setTokenUsage] = useState<{ input_tokens: number; output_tokens: number; credits_used: number } | null>(null);
  const [fixUsage, setFixUsage] = useState<{ input_tokens: number; output_tokens: number; credits_used: number } | null>(null);
  const [lastGameErrors, setLastGameErrors] = useState<string[]>([]);
  const { balance: credits, refetch: refetchCredits, openPurchaseModal, isPaidUser } =
    useCredits();
  const [activeTab, setActiveTab] = useState<"chat" | "preview">(
    game.game_code ? "preview" : "chat"
  );

  const gameCodeRef = useRef<string | null>(game.game_code || null);
  const hasAutoSwitched = useRef(!!game.game_code);
  const autoFixAttempts = useRef(0);
  const isStreamingRef = useRef(false);
  const pendingGameErrors = useRef<{ message: string; line: number; column: number; stack: string }[] | null>(null);
  isStreamingRef.current = isStreaming;

  // Warn before closing tab while streaming
  useEffect(() => {
    if (!isStreaming) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isStreaming]);

  // Auto-switch to preview tab on mobile when game code first becomes available
  useEffect(() => {
    if (gameCode && !hasAutoSwitched.current) {
      hasAutoSwitched.current = true;
      setActiveTab("preview");
    }
  }, [gameCode]);

  const sendMessage = useCallback(async (overrideText?: string | unknown) => {
    const text = (typeof overrideText === "string" ? overrideText : input).trim();
    if (!text || isStreaming) return;

    const userMessage: ChatMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsStreaming(true);
    setStreamingText("");
    setTokenUsage(null);
    setFixUsage(null);
    autoFixAttempts.current = 0;
    setAutoFixExhausted(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          // Server loads game code from DB using gameProjectId (no need to send it)
          gameProjectId: game.id,
          gameName: game.name,
          model: selectedModel,
        }),
      });

      if (res.status === 402) {
        openPurchaseModal();
        setMessages((prev) => prev.slice(0, -1));
        setIsStreaming(false);
        return;
      }

      if (res.status === 403) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Please verify your email address before generating games. Check your inbox for the verification link.",
          },
        ]);
        setIsStreaming(false);
        return;
      }

      if (res.status === 429) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Rate limit reached. Please wait a moment before sending another message.",
          },
        ]);
        setIsStreaming(false);
        return;
      }

      // Safety filter rejected the prompt
      if (res.status === 400) {
        const body = await res.json().catch(() => null);
        if (body?.error === "prompt_rejected") {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `I can't help with that request. ${body.reason || "Try describing the game mechanic you want instead."}`,
            },
          ]);
          setIsStreaming(false);
          return;
        }
      }

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      let fullText = "";

      for await (const parsed of readSSEStream(res)) {
        if (parsed.error) throw new Error(parsed.error);
        if (parsed.usage) setTokenUsage(JSON.parse(parsed.usage));
        if (parsed.status) {
          if (parsed.status === "insufficient_credits_continue") {
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: "Game generation incomplete — not enough credits to continue. Purchase more credits to generate complex games.",
              },
            ]);
          }
          setStreamPhase(parsed.status as typeof streamPhase);
        }
        if (parsed.text) {
          fullText += parsed.text;
          setStreamingText(fullText);

          // Only live-extract game code for NEW games (full file mode).
          // GameEditor always has existing code, so skip live extraction
          // and apply patches after streaming ends.
        }
      }

      // After streaming: apply patches (iterations) or extract full code
      const patches = extractPatches(fullText);
      if (patches.length > 0 && gameCodeRef.current) {
        // Patch mode: apply search-replace blocks to existing game code
        const result = applyPatches(gameCodeRef.current, patches);
        setGameCode(result.code);
        gameCodeRef.current = result.code;
      } else {
        // Full mode fallback: if Claude output a full file instead of patches
        const code = extractGameCode(fullText) || extractGameCode(fullText, false);
        if (code) {
          setGameCode(code);
          gameCodeRef.current = code;
        }
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: fullText,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg: ChatMessage = {
        role: "assistant",
        content: `⚠️ Something went wrong: ${err instanceof Error ? err.message : "Unknown error"}. Try again.`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsStreaming(false);
      setStreamingText("");
      setStreamPhase(null);
      refetchCredits();
    }
  }, [input, messages, isStreaming, refetchCredits, selectedModel]);

  const handleNewGame = useCallback(() => {
    // For existing games, just clear chat but keep the game
    setMessages([]);
    setInput("");
    setStreamingText("");
    setTokenUsage(null);
    setFixUsage(null);
    autoFixAttempts.current = 0;
    setActiveTab("chat");
    hasAutoSwitched.current = false;
  }, []);

  const handleGameError = useCallback(
    async (errors: { message: string; line: number; column: number; stack: string }[]) => {
      console.warn("[GF-HEAL] handleGameError called:", errors.length, "errors | isAutoFixing:", isAutoFixing, "| gameCode:", !!gameCodeRef.current, "| streaming:", isStreamingRef.current, "| attempts:", autoFixAttempts.current);
      if (isAutoFixing || !gameCodeRef.current) {
        console.warn("[GF-HEAL] BLOCKED: isAutoFixing=", isAutoFixing, "gameCode=", !!gameCodeRef.current);
        return;
      }
      // Queue errors during streaming — process after streaming ends via useEffect below.
      if (isStreamingRef.current) {
        console.warn("[GF-HEAL] QUEUED: streaming active, will replay after stream ends");
        pendingGameErrors.current = errors;
        return;
      }
      if (autoFixAttempts.current >= 2) {
        console.warn("[GF-HEAL] EXHAUSTED: 2 attempts used");
        setAutoFixExhausted(true);
        return;
      }
      autoFixAttempts.current++;
      console.warn("[GF-HEAL] PROCEEDING with auto-fix attempt", autoFixAttempts.current);
      setIsAutoFixing(true);
      setStreamPhase("auto-fixing");
      setLastGameErrors(errors.map((e) => e.message));

      const errorSummaries = errors.map((e) => {
        let summary = e.message;
        if (e.line > 0) summary += ` (line ${e.line}, col ${e.column})`;
        if (e.stack) summary += `\nStack: ${e.stack}`;
        return summary;
      });

      try {
        const res = await fetch("/api/fix-game", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // Server loads game code from DB using gameProjectId (authorization enforced)
            gameProjectId: game.id,
            errors: errorSummaries,
            attemptNumber: autoFixAttempts.current,
          }),
        });

        if (res.status === 402) {
          openPurchaseModal();
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "Auto-fix needs 2 credits but you don't have enough. Purchase more credits to enable auto-fix.",
            },
          ]);
          return;
        }

        if (res.status === 403) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "Please verify your email address to enable auto-fix. Check your inbox for the verification link.",
            },
          ]);
          return;
        }

        if (res.status === 429) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "Auto-fix rate limit reached. Please wait a moment and try again, or ask MAX to fix the errors manually.",
            },
          ]);
          return;
        }

        if (!res.ok) {
          setAutoFixExhausted(true);
          return;
        }

        // Read SSE stream from fix-game endpoint
        let gotResult = false;

        for await (const parsed of readSSEStream(res)) {
          if (parsed.error) throw new Error(parsed.error);

          if (parsed.result) {
            const result = JSON.parse(parsed.result);
            if (result.fixedCode) {
              gotResult = true;
              setGameCode(result.fixedCode);
              gameCodeRef.current = result.fixedCode;
              setFixUsage({
                input_tokens: result.usage.input_tokens,
                output_tokens: result.usage.output_tokens,
                credits_used: result.credits_used,
              });
              const errorList = errors.map((e) => e.message).join("; ");
              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content: `Auto-fix attempt ${autoFixAttempts.current}/2: "${errorList}" (2 credits)`,
                },
              ]);
            }
          }
        }

        if (!gotResult) {
          setAutoFixExhausted(true);
        }
      } catch (err) {
        console.error("Auto-fix error:", err);
        setAutoFixExhausted(true);
      } finally {
        setIsAutoFixing(false);
        setStreamPhase(null);
        refetchCredits();
      }
    },
    [isAutoFixing, openPurchaseModal, refetchCredits]
  );

  // Process queued game errors after streaming ends.
  // The iframe's error handler is one-shot (sent=true after flush), so errors
  // received during streaming are queued in pendingGameErrors and replayed here.
  useEffect(() => {
    if (!isStreaming && pendingGameErrors.current) {
      const errors = pendingGameErrors.current;
      pendingGameErrors.current = null;
      handleGameError(errors);
    }
  }, [isStreaming, handleGameError]);

  const handleSave = useCallback(async () => {
    if (!gameCode) return;
    setIsSaving(true);

    try {
      const supabase = createClient();

      await supabase
        .from("game_projects")
        .update({
          game_code: gameCode,
          status: "playable",
          updated_at: new Date().toISOString(),
        })
        .eq("id", game.id);

      // Save chat session
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: studio } = await supabase
          .from("studios")
          .select("id")
          .eq("owner_id", user.id)
          .limit(1)
          .single();

        if (studio) {
          await supabase.from("chat_sessions").upsert(
            {
              studio_id: studio.id,
              game_project_id: game.id,
              messages: messages.map((m) => ({
                role: m.role,
                content: m.content,
                timestamp: new Date().toISOString(),
              })),
              updated_at: new Date().toISOString(),
            },
            { onConflict: "game_project_id" }
          );
        }
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  }, [gameCode, game.id, messages]);

  const handleRetry = useCallback(() => {
    autoFixAttempts.current = 0;
    setAutoFixExhausted(false);
    sendMessage("Please fix the errors in the game code and regenerate it");
  }, [sendMessage]);

  const handlePublish = useCallback(async () => {
    // Scan game code for dangerous patterns before publishing
    if (gameCode) {
      const scanResult = scanGameCode(gameCode);
      if (!scanResult.safe) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Cannot publish — the game code contains disallowed patterns:\n\n${scanResult.violations.map((v) => `• ${v}`).join("\n")}\n\nPlease ask me to regenerate the game without these patterns.`,
          },
        ]);
        return;
      }
    }

    await handleSave();
    try {
      const supabase = createClient();
      await supabase
        .from("game_projects")
        .update({
          is_public: true,
          status: "published",
          updated_at: new Date().toISOString(),
        })
        .eq("id", game.id);
    } catch (err) {
      console.error("Publish error:", err);
    }
  }, [handleSave, game.id, gameCode]);

  return (
    <div className="-m-4 sm:-m-6 flex flex-col lg:flex-row h-[calc(100dvh-4rem)] overflow-hidden">
      {/* Mobile tab switcher */}
      <div className="lg:hidden flex border-b border-neutral-700">
        <button
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === "chat"
              ? "text-primary-light border-b-2 border-primary-light"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
          onClick={() => setActiveTab("chat")}
        >
          CHAT WITH MAX
        </button>
        <button
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === "preview"
              ? "text-primary-light border-b-2 border-primary-light"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
          onClick={() => setActiveTab("preview")}
        >
          GAME PREVIEW
        </button>
      </div>

      {/* Chat Panel — left 40% on desktop, full width on mobile */}
      <div
        className={`${
          activeTab === "chat" ? "flex" : "hidden"
        } lg:flex lg:w-[40%] flex-col border-r border-neutral-700 min-h-0`}
      >
        <ChatPanel
          messages={messages}
          input={input}
          onInputChange={setInput}
          onSend={sendMessage}
          isStreaming={isStreaming}
          streamingText={streamingText}
          streamPhase={streamPhase}
          onNewGame={handleNewGame}
          credits={credits}
          onBuyCredits={openPurchaseModal}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          isPaidUser={isPaidUser}
          tokenUsage={tokenUsage}
          fixTokenUsage={fixUsage}
          isAutoFixing={isAutoFixing}
          autoFixExhausted={autoFixExhausted}
          onRetry={handleRetry}
          lastGameErrors={lastGameErrors}
        />
      </div>

      {/* Game Preview — right 60% on desktop, full width on mobile */}
      <div
        className={`${
          activeTab === "preview" ? "flex" : "hidden"
        } lg:flex flex-1 flex-col min-h-0`}
      >
        <GamePreview
          gameCode={gameCode}
          isLoading={isStreaming}
          onSave={handleSave}
          onPublish={handlePublish}
          isSaving={isSaving}
          gameName={game.name}
          gameProjectId={game.id}
          isPublished={game.status === "published"}
          onGameError={handleGameError}
          isAutoFixing={isAutoFixing}
        />
      </div>
    </div>
  );
}

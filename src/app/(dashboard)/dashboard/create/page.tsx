"use client";

import { Suspense, useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ChatPanel } from "@/features/game-creator/ChatPanel";
import { GamePreview } from "@/features/game-creator/GamePreview";
import { extractGameCode } from "@/lib/prompts/game-creator";
import { extractPatches, applyPatches } from "@/lib/game-patcher";
import { readSSEStream } from "@/lib/sse-reader";
import { createClient } from "@/lib/supabase/client";
import { GAME_TEMPLATES } from "@/lib/game-templates";
import { useCredits } from "@/features/credits/CreditsProvider";
import type { ChatMessage } from "@/features/game-creator/ChatPanel";

export default function CreateGamePage() {
  return (
    <Suspense>
      <CreateGameContent />
    </Suspense>
  );
}

function CreateGameContent() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [streamPhase, setStreamPhase] = useState<"thinking" | "generating" | "continuing" | "finishing" | "building" | "polishing" | "auto-fixing" | null>(null);
  const [selectedModel, setSelectedModel] = useState<"max" | "max-pro">("max");
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [gameName, setGameName] = useState<string>("");
  const [gameProjectId, setGameProjectId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "preview">("chat");
  const [isAutoFixing, setIsAutoFixing] = useState(false);
  const [autoFixExhausted, setAutoFixExhausted] = useState(false);
  const [tokenUsage, setTokenUsage] = useState<{ input_tokens: number; output_tokens: number; credits_used: number } | null>(null);
  const [fixUsage, setFixUsage] = useState<{ input_tokens: number; output_tokens: number; credits_used: number } | null>(null);
  const [lastGameErrors, setLastGameErrors] = useState<string[]>([]);
  const { balance: credits, refetch: refetchCredits, openPurchaseModal, isPaidUser } = useCredits();

  // Ref to keep current gameCode accessible inside async callbacks
  const gameCodeRef = useRef<string | null>(null);
  // Ref to track whether we've already auto-switched to preview
  const hasAutoSwitched = useRef(false);
  // Ref to prevent double-loading template
  const templateLoaded = useRef(false);
  // Ref to limit auto-fix to 1 attempt per generation
  const autoFixAttempts = useRef(0);
  // Queue errors received during streaming so we can process them after streaming ends
  const pendingErrors = useRef<{ message: string; line: number; column: number; stack: string }[] | null>(null);

  // Load template if ?template= param is present
  useEffect(() => {
    if (templateLoaded.current) return;
    const templateId = searchParams.get("template");
    if (!templateId) return;
    const template = GAME_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;
    templateLoaded.current = true;

    setGameCode(template.gameCode);
    gameCodeRef.current = template.gameCode;
    setGameName(template.name);
    setActiveTab("preview");
    hasAutoSwitched.current = true;
    setMessages([
      {
        role: "assistant",
        content: `I've loaded the **${template.name}** template — a ${template.genre} game. It's playable right now!\n\nWant me to customize it? Try:\n- "Add power-ups"\n- "Make it harder"\n- "Change the colors to blue"\n- "Add a boss fight"\n- "Add sound effects"`,
      },
    ]);
  }, [searchParams]);

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
    pendingErrors.current = null;
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
          // Only send game code when no project exists yet (template first message);
          // once a project ID exists, server loads code from DB
          ...(gameProjectId ? {} : { currentGameCode: gameCodeRef.current || undefined }),
          gameProjectId: gameProjectId || undefined,
          gameName: gameName || undefined,
          model: selectedModel,
        }),
      });

      if (res.status === 402) {
        openPurchaseModal();
        setMessages((prev) => prev.slice(0, -1)); // Remove the user message we just added
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

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      let fullText = "";

      for await (const parsed of readSSEStream(res)) {
        if (parsed.error) throw new Error(parsed.error);
        if (parsed.projectId) setGameProjectId(parsed.projectId);
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
          // For iterations (patch mode), keep showing the current working game
          // until patches are applied after streaming ends.
          if (!gameCodeRef.current) {
            const code = extractGameCode(fullText);
            if (code) {
              setGameCode(code);
              gameCodeRef.current = code;

              if (!gameName && updatedMessages.length > 0) {
                const firstMsg = updatedMessages[0].content;
                const name = firstMsg.length > 40 ? firstMsg.slice(0, 40) + "..." : firstMsg;
                setGameName(name);
              }
            }
          }
        }
      }

      // After streaming: apply patches (iterations) or extract full code (new games)
      const patches = extractPatches(fullText);
      if (patches.length > 0 && gameCodeRef.current) {
        // Patch mode: apply search-replace blocks to existing game code
        const result = applyPatches(gameCodeRef.current, patches);
        setGameCode(result.code);
        gameCodeRef.current = result.code;
      } else if (!gameCodeRef.current && fullText.trim()) {
        // Full mode fallback: extract complete game code (truncated responses)
        const code = extractGameCode(fullText, false);
        if (code) {
          setGameCode(code);
          gameCodeRef.current = code;
          if (!gameName && updatedMessages.length > 0) {
            const firstMsg = updatedMessages[0].content;
            setGameName(firstMsg.length > 40 ? firstMsg.slice(0, 40) + "..." : firstMsg);
          }
        }
      }

      // Add completed assistant message
      if (!fullText.trim()) {
        fullText = "\u26a0\ufe0f MAX couldn't generate a response. Please try again with a more specific description.";
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
        content: `⚠️ Something went wrong: ${err instanceof Error ? err.message : "Unknown error"}. Try again or describe your game differently.`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsStreaming(false);
      setStreamingText("");
      setStreamPhase(null);
      refetchCredits();
    }
  }, [input, messages, isStreaming, gameName, refetchCredits, selectedModel]);

  const handleNewGame = useCallback(() => {
    setMessages([]);
    setInput("");
    setGameCode(null);
    gameCodeRef.current = null;
    hasAutoSwitched.current = false;
    autoFixAttempts.current = 0;
    pendingErrors.current = null;
    setGameName("");
    setGameProjectId(null);
    setStreamingText("");
    setTokenUsage(null);
    setFixUsage(null);
    setActiveTab("chat");
  }, []);

  const handleGameError = useCallback(
    async (errors: { message: string; line: number; column: number; stack: string }[]) => {
      if (isAutoFixing || !gameCodeRef.current) return;
      // Queue errors during streaming — they'll be processed when streaming ends
      if (isStreaming) {
        pendingErrors.current = errors;
        return;
      }
      if (autoFixAttempts.current >= 5) {
        setAutoFixExhausted(true);
        return;
      }
      autoFixAttempts.current++;
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
            // Send gameProjectId when available (server loads from DB);
            // fallback to sending gameCode for template edge case (no project yet)
            gameProjectId: gameProjectId || undefined,
            ...(!gameProjectId ? { gameCode: gameCodeRef.current } : {}),
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

        if (!res.ok) {
          setAutoFixExhausted(true);
          return;
        }

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
                  content: `Auto-fix attempt ${autoFixAttempts.current}/5: "${errorList}" (2 credits)`,
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
    [isAutoFixing, isStreaming, openPurchaseModal, refetchCredits]
  );

  // Process any errors that were queued during streaming
  useEffect(() => {
    if (!isStreaming && pendingErrors.current) {
      const errors = pendingErrors.current;
      pendingErrors.current = null;
      handleGameError(errors);
    }
  }, [isStreaming, handleGameError]);

  const handleRetry = useCallback(() => {
    autoFixAttempts.current = 0;
    setAutoFixExhausted(false);
    sendMessage("Please fix the errors in the game code and regenerate it");
  }, [sendMessage]);

  const handleSave = useCallback(async () => {
    if (!gameCode) return;
    setIsSaving(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get user's studio
      const { data: studio } = await supabase
        .from("studios")
        .select("id")
        .eq("owner_id", user.id)
        .limit(1)
        .single();

      if (!studio) throw new Error("No studio found");

      let currentProjectId = gameProjectId;

      if (currentProjectId) {
        // Update existing project
        await supabase
          .from("game_projects")
          .update({
            game_code: gameCode,
            status: "playable",
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentProjectId);
      } else {
        // Create new project
        const { data: project } = await supabase
          .from("game_projects")
          .insert({
            studio_id: studio.id,
            name: gameName || "Untitled Game",
            description: messages[0]?.content || null,
            status: "playable",
            game_code: gameCode,
            is_public: false,
          })
          .select("id")
          .single();

        if (project) {
          currentProjectId = project.id;
          setGameProjectId(project.id);
        }
      }

      // Save chat session
      await supabase.from("chat_sessions").upsert(
        {
          studio_id: studio.id,
          game_project_id: currentProjectId,
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
            timestamp: new Date().toISOString(),
          })),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "game_project_id" }
      );
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  }, [gameCode, gameProjectId, gameName, messages]);

  const handlePublish = useCallback(async () => {
    if (!gameProjectId) {
      // Save first, then publish
      await handleSave();
    }

    try {
      const supabase = createClient();
      if (gameProjectId) {
        await supabase
          .from("game_projects")
          .update({
            is_public: true,
            status: "published",
            updated_at: new Date().toISOString(),
          })
          .eq("id", gameProjectId);
      }
    } catch (err) {
      console.error("Publish error:", err);
    }
  }, [gameProjectId, handleSave]);

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
          gameName={gameName}
          gameProjectId={gameProjectId}
          isPublished={false}
          onGameError={handleGameError}
          isAutoFixing={isAutoFixing}
        />
      </div>
    </div>
  );
}

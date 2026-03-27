"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ChatPanel } from "@/features/game-creator/ChatPanel";
import { GamePreview } from "@/features/game-creator/GamePreview";
import { extractGameCode } from "@/lib/prompts/game-creator";
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
  const [streamPhase, setStreamPhase] = useState<"thinking" | "generating" | "continuing" | "finishing" | "auto-fixing" | null>(null);
  const [isAutoFixing, setIsAutoFixing] = useState(false);
  const [tokenUsage, setTokenUsage] = useState<{ input_tokens: number; output_tokens: number; credits_used: number } | null>(null);
  const [fixUsage, setFixUsage] = useState<{ input_tokens: number; output_tokens: number; credits_used: number } | null>(null);
  const { balance: credits, refetch: refetchCredits, openPurchaseModal, isPaidUser } =
    useCredits();
  const [activeTab, setActiveTab] = useState<"chat" | "preview">(
    game.game_code ? "preview" : "chat"
  );

  const gameCodeRef = useRef<string | null>(game.game_code || null);
  const hasAutoSwitched = useRef(!!game.game_code);
  const autoFixAttempts = useRef(0);

  // Auto-switch to preview tab on mobile when game code first becomes available
  useEffect(() => {
    if (gameCode && !hasAutoSwitched.current) {
      hasAutoSwitched.current = true;
      setActiveTab("preview");
    }
  }, [gameCode]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
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

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          currentGameCode: gameCodeRef.current || undefined,
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

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.error) throw new Error(parsed.error);
              if (parsed.usage) {
                setTokenUsage(JSON.parse(parsed.usage));
              }
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
                setStreamPhase(parsed.status);
              }
              if (parsed.text) {
                fullText += parsed.text;
                setStreamingText(fullText);

                const code = extractGameCode(fullText);
                if (code) {
                  setGameCode(code);
                  gameCodeRef.current = code;
                }
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }

      // Final extraction pass — handles truncated responses
      if (!gameCodeRef.current && fullText.trim()) {
        const code = extractGameCode(fullText, false);
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
    async (error: { message: string; line: number; column: number }) => {
      if (isAutoFixing || isStreaming || autoFixAttempts.current >= 1 || !gameCodeRef.current) return;
      autoFixAttempts.current++;
      setIsAutoFixing(true);
      setStreamPhase("auto-fixing");

      try {
        const res = await fetch("/api/fix-game", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gameCode: gameCodeRef.current,
            error: error.message,
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

        if (!res.ok) return;

        const data = await res.json();
        if (data.fixedCode) {
          setGameCode(data.fixedCode);
          gameCodeRef.current = data.fixedCode;
          setFixUsage({
            input_tokens: data.usage.input_tokens,
            output_tokens: data.usage.output_tokens,
            credits_used: data.credits_used,
          });
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `Auto-fixed an error: "${error.message}" (2 credits)`,
            },
          ]);
        }
      } catch (err) {
        console.error("Auto-fix error:", err);
      } finally {
        setIsAutoFixing(false);
        setStreamPhase(null);
        refetchCredits();
      }
    },
    [isAutoFixing, isStreaming, openPurchaseModal, refetchCredits]
  );

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

  const handlePublish = useCallback(async () => {
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
  }, [handleSave, game.id]);

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

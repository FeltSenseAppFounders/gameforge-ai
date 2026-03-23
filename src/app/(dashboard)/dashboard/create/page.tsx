"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ChatPanel } from "@/features/game-creator/ChatPanel";
import { GamePreview } from "@/features/game-creator/GamePreview";
import { extractGameCode } from "@/lib/prompts/game-creator";
import { createClient } from "@/lib/supabase/client";
import type { ChatMessage } from "@/features/game-creator/ChatPanel";

export default function CreateGamePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [gameName, setGameName] = useState<string>("");
  const [gameProjectId, setGameProjectId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "preview">("chat");

  // Ref to keep current gameCode accessible inside async callbacks
  const gameCodeRef = useRef<string | null>(null);
  // Ref to track whether we've already auto-switched to preview
  const hasAutoSwitched = useRef(false);

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
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

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
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.text) {
                fullText += parsed.text;
                setStreamingText(fullText);

                // Try to extract game code as it streams
                const code = extractGameCode(fullText);
                if (code) {
                  setGameCode(code);
                  gameCodeRef.current = code;

                  // Extract game name from first user message if not set
                  if (!gameName && updatedMessages.length > 0) {
                    const firstMsg = updatedMessages[0].content;
                    // Derive a simple name from the first message
                    const name =
                      firstMsg.length > 40
                        ? firstMsg.slice(0, 40) + "..."
                        : firstMsg;
                    setGameName(name);
                  }
                }
              }
            } catch {
              // Skip malformed JSON lines
            }
          }
        }
      }

      // Add completed assistant message
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
    }
  }, [input, messages, isStreaming, gameName]);

  const handleNewGame = useCallback(() => {
    setMessages([]);
    setInput("");
    setGameCode(null);
    gameCodeRef.current = null;
    hasAutoSwitched.current = false;
    setGameName("");
    setGameProjectId(null);
    setStreamingText("");
    setActiveTab("chat");
  }, []);

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

      if (gameProjectId) {
        // Update existing project
        await supabase
          .from("game_projects")
          .update({
            game_code: gameCode,
            status: "playable",
            updated_at: new Date().toISOString(),
          })
          .eq("id", gameProjectId);
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
          setGameProjectId(project.id);
        }
      }

      // Save chat session
      await supabase.from("chat_sessions").upsert(
        {
          studio_id: studio.id,
          game_project_id: gameProjectId,
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
    <div className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)] overflow-hidden">
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
          onNewGame={handleNewGame}
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
        />
      </div>
    </div>
  );
}

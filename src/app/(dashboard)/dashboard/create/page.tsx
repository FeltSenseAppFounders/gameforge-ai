"use client";

import { useState, useRef, useCallback } from "react";
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

  // Ref to keep current gameCode accessible inside async callbacks
  const gameCodeRef = useRef<string | null>(null);

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
    setGameName("");
    setGameProjectId(null);
    setStreamingText("");
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
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Chat Panel — left 40% */}
      <div className="w-[40%] min-w-[320px] border-r border-neutral-700">
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

      {/* Game Preview — right 60% */}
      <div className="flex-1">
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

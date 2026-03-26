"use client";

import { useRef, useEffect } from "react";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isStreaming: boolean;
  streamingText: string;
  streamPhase?: "thinking" | "generating" | null;
  onNewGame: () => void;
}

function MaxAvatar() {
  return (
    <div className="w-7 h-7 rounded bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
      <span className="text-xs font-bold text-primary-light">M</span>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2">
      <div className="w-1.5 h-1.5 rounded-full bg-primary-light animate-pulse" />
      <div
        className="w-1.5 h-1.5 rounded-full bg-primary-light animate-pulse"
        style={{ animationDelay: "150ms" }}
      />
      <div
        className="w-1.5 h-1.5 rounded-full bg-primary-light animate-pulse"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
}

/** Strip game code markers from display text */
function stripGameCode(text: string): string {
  const startMarker = "<!-- GAME_CODE_START -->";
  const endMarker = "<!-- GAME_CODE_END -->";
  const startIdx = text.indexOf(startMarker);
  const endIdx = text.indexOf(endMarker);

  if (startIdx !== -1 && endIdx !== -1) {
    // Remove everything between markers (inclusive) and replace with a brief note
    const before = text.slice(0, startIdx).trim();
    const after = text.slice(endIdx + endMarker.length).trim();
    const parts = [before, after].filter(Boolean);
    if (parts.length === 0) return "🎮 Game code generated!";
    return parts.join("\n\n");
  }

  // If markers are partial (during streaming), hide code block in progress
  if (startIdx !== -1 && endIdx === -1) {
    const before = text.slice(0, startIdx).trim();
    return before || "🎮 Building your game...";
  }

  return text;
}

export function ChatPanel({
  messages,
  input,
  onInputChange,
  onSend,
  isStreaming,
  streamingText,
  streamPhase,
  onNewGame,
}: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
    }
  }, [input]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && input.trim()) {
        onSend();
      }
    }
  }

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary-light animate-pulse" />
          <span className="text-sm font-bold text-primary-light uppercase tracking-wider">
            MAX
          </span>
          <span className="text-xs text-neutral-500">AI Game Designer</span>
        </div>
        <button
          onClick={onNewGame}
          className="text-xs font-semibold text-neutral-400 hover:text-neutral-200 px-3 py-1.5 rounded border border-neutral-700 hover:border-neutral-500 transition-colors"
        >
          + NEW GAME
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Welcome message if no messages yet */}
        {messages.length === 0 && !isStreaming && (
          <div className="flex gap-3">
            <MaxAvatar />
            <div className="bg-surface-light border border-primary/20 rounded-lg px-4 py-3 max-w-[85%]">
              <p className="text-sm text-neutral-200 leading-relaxed">
                Yo! I&apos;m <span className="text-primary-light font-bold">MAX</span>.
                Tell me what kind of game you want to build and I&apos;ll make
                it happen. 🎮
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  { label: "Space Shooter", prompt: "Make an epic space shooter with detailed ship sprites, particle explosions, power-ups, sound effects, and boss fights every 5 waves" },
                  { label: "Platformer", prompt: "Build a polished platformer with a character that has arms and legs, double-jump, moving platforms, coin collection with sparkle effects, and sound effects" },
                  { label: "Tower Defense", prompt: "Create a tower defense game with a winding path, 3 tower types (basic, splash, slow), enemy waves, upgrade system, and gold economy" },
                  { label: "Endless Runner", prompt: "Make a fast-paced endless runner with 3-lane switching, jump/slide, procedural obstacles, coins, speed ramp, and distance scoring" },
                  { label: "Bullet Hell", prompt: "Build an intense bullet hell survival game — dodge spiral and burst projectile patterns, collect power-ups, screen-clear bombs, and survive as long as possible" },
                  { label: "Dungeon RPG", prompt: "Make a dungeon crawler with tile-based movement, procedural rooms, bump combat with damage numbers, potions, keys, and floor progression" },
                  { label: "3D Runner", prompt: "Create a 3D endless runner using Three.js — 3 lanes, jump over barriers, collect floating coins, speed increases over time, third-person camera" },
                  { label: "3D Flight", prompt: "Build a 3D flight game with Three.js — fly through rings in the sky, avoid obstacles, third-person camera following the aircraft, speed boost with space" },
                ].map(
                  (suggestion) => (
                    <button
                      key={suggestion.label}
                      onClick={() => {
                        onInputChange(suggestion.prompt);
                      }}
                      className="text-xs px-3 py-1.5 rounded border border-neutral-600 text-neutral-300 hover:border-primary/50 hover:text-primary-light transition-colors"
                    >
                      {suggestion.label}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Message list */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
          >
            {msg.role === "assistant" && <MaxAvatar />}
            <div
              className={`rounded-lg px-4 py-3 max-w-[85%] text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-secondary/10 border border-secondary/20 text-secondary"
                  : "bg-surface-light border border-primary/20 text-neutral-200"
              }`}
            >
              <p className="whitespace-pre-wrap">
                {msg.role === "assistant"
                  ? stripGameCode(msg.content)
                  : msg.content}
              </p>
            </div>
          </div>
        ))}

        {/* Streaming response */}
        {isStreaming && (
          <div className="flex gap-3">
            <MaxAvatar />
            <div className="bg-surface-light border border-primary/20 rounded-lg px-4 py-3 max-w-[85%]">
              {streamingText ? (
                <p className="text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap">
                  {stripGameCode(streamingText)}
                </p>
              ) : streamPhase === "thinking" ? (
                <div className="flex items-center gap-2 text-sm text-primary-light">
                  <span className="animate-pulse">🧠</span>
                  <span>MAX is thinking<span className="animate-pulse">...</span></span>
                </div>
              ) : streamPhase === "generating" ? (
                <div className="flex items-center gap-2 text-sm text-primary-light">
                  <span className="animate-pulse">⚡</span>
                  <span>MAX is writing code<span className="animate-pulse">...</span></span>
                </div>
              ) : (
                <TypingIndicator />
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="px-4 py-3 border-t border-neutral-700">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isStreaming
                ? "MAX is building..."
                : "Describe your game or request changes..."
            }
            disabled={isStreaming}
            rows={1}
            className="flex-1 bg-surface-dark border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-neutral-200 placeholder:text-neutral-500 resize-none focus:outline-none focus:border-primary/50 disabled:opacity-50 transition-colors"
          />
          <button
            onClick={onSend}
            disabled={isStreaming || !input.trim()}
            className="shrink-0 w-10 h-10 rounded-lg bg-primary hover:bg-primary-light disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors glow-green"
          >
            <svg
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14m-7-7l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-neutral-600 mt-1.5 px-1">
          Shift+Enter for new line · MAX generates 2D &amp; 3D browser games
        </p>
      </div>
    </div>
  );
}

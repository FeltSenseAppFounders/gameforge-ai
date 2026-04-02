"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import { useRotatingMessage } from "@/hooks/useRotatingMessage";
import { useCredits } from "@/features/credits/CreditsProvider";

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
  streamPhase?: "thinking" | "generating" | "continuing" | "finishing" | "building" | "polishing" | "auto-fixing" | null;
  onNewGame: () => void;
  credits?: number;
  onBuyCredits?: () => void;
  selectedModel: "max" | "max-pro";
  onModelChange: (m: "max" | "max-pro") => void;
  isPaidUser: boolean;
  tokenUsage?: { input_tokens: number; output_tokens: number; credits_used: number } | null;
  fixTokenUsage?: { input_tokens: number; output_tokens: number; credits_used: number } | null;
  isAutoFixing?: boolean;
  autoFixExhausted?: boolean;
  onRetry?: () => void;
  lastGameErrors?: string[];
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
  credits,
  onBuyCredits,
  selectedModel,
  onModelChange,
  isPaidUser,
  tokenUsage,
  fixTokenUsage,
  isAutoFixing,
  autoFixExhausted,
  onRetry,
  lastGameErrors,
}: ChatPanelProps) {
  const { showProUpsell } = useCredits();
  const outOfCredits = credits !== undefined && credits <= 0;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [proUpsellDismissed, setProUpsellDismissed] = useState(false);

  const thinkingMessages = useMemo(() => [
    "Planning the most epic game ever...",
    "Consulting the game design gods...",
    "Downloading creativity... 98%",
    "Reading every game wiki simultaneously...",
    "Channeling the spirit of Miyamoto...",
  ], []);

  const generatingMessages = useMemo(() => [
    "Writing code at the speed of light...",
    "Creating enemies is hard, give me a sec...",
    "Ugh, this is taking a while. Be patient!",
    "Teaching pixels to behave...",
    "Spawning NPCs with attitude...",
    "Making sure the physics don't break reality...",
    "Adding the secret sauce...",
    "Debugging before you even play... you're welcome",
    "Placing collectibles in the most annoying spots...",
    "Wiring up the controls... WASD or bust",
    "Telling the boss enemy to chill... nope, it refused",
    "Sprinkling particle effects everywhere...",
    "Almost there... just kidding, still cooking",
    "Convincing myself to write good code...",
    "Stealing ideas from classic games... legally",
    "Compiling fun.exe...",
    "Rolling a D20 for code quality... got a 19!",
  ], []);

  const continuingMessages = useMemo(() => [
    "This game is so big it needs a sequel...",
    "Still going... this masterpiece takes time",
    "Part 2 of your epic game loading...",
    "My fingers hurt but I keep typing...",
    "You asked for a LOT of features huh...",
  ], []);

  const finishingMessages = useMemo(() => [
    "Polishing the final bits...",
    "Adding one last explosion for good measure...",
    "Wrapping it up with a bow...",
    "Final boss: semicolons. I got this.",
  ], []);

  const buildingMessages = useMemo(() => [
    "Building your game...",
    "Creating enemies is hard, give me a sec...",
    "Ugh, this is taking a while. Be patient!",
    "Teaching pixels to behave...",
    "Spawning NPCs with attitude...",
    "Making sure the physics don't break reality...",
    "Placing collectibles in the most annoying spots...",
    "Telling the boss enemy to chill... nope, it refused",
    "Sprinkling particle effects everywhere...",
    "Almost there... just kidding, still cooking",
    "Wiring up the controls... WASD or bust",
    "Adding the secret sauce...",
    "Compiling fun.exe...",
    "Rolling a D20 for code quality... got a 19!",
    "Stealing ideas from classic games... legally",
    "Debugging before you even play... you're welcome",
    "Hold tight, this game is gonna be fire...",
    "Teaching enemies to actually be scary...",
  ], []);

  // Detect "code in progress" — start marker present, end marker not yet
  const isBuildingCode = isStreaming && streamingText.includes("<!-- GAME_CODE_START -->") && !streamingText.includes("<!-- GAME_CODE_END -->");

  const buildingPhaseMessages = useMemo(() => [
    "Opus designed it, now building at warp speed...",
    "Turning the blueprint into code...",
    "Wiring up sprites and collisions...",
    "Assembling the game logic...",
    "Sonnet is speed-running the build...",
  ], []);

  const polishingPhaseMessages = useMemo(() => [
    "Final polish pass...",
    "Adding the finishing touches...",
    "Closing out the last bits of code...",
    "Almost there, wrapping up...",
  ], []);

  const phaseMessages = streamPhase === "thinking" ? thinkingMessages
    : streamPhase === "generating" ? generatingMessages
    : streamPhase === "continuing" ? continuingMessages
    : streamPhase === "finishing" ? finishingMessages
    : streamPhase === "building" ? buildingPhaseMessages
    : streamPhase === "polishing" ? polishingPhaseMessages
    : generatingMessages;

  const showPhaseRotating = isStreaming && !streamingText && streamPhase !== "auto-fixing";
  const rotatingMsg = useRotatingMessage(phaseMessages, 3500, showPhaseRotating);
  const buildingMsg = useRotatingMessage(buildingMessages, 3500, isBuildingCode);

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
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary-light animate-pulse" />
            <span className="text-sm font-bold text-primary-light uppercase tracking-wider">
              MAX
            </span>
          </div>
          {/* Model toggle */}
          <div className="flex items-center gap-0.5 bg-surface-dark rounded border border-neutral-700 p-0.5">
            <button
              onClick={() => onModelChange("max")}
              className={`text-[10px] font-bold px-2.5 py-1 rounded transition-colors ${
                selectedModel === "max"
                  ? "bg-primary/20 text-primary-light"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              MAX
            </button>
            <button
              onClick={() => isPaidUser ? onModelChange("max-pro") : showProUpsell()}
              className={`text-[10px] font-bold px-2.5 py-1 rounded transition-colors ${
                selectedModel === "max-pro"
                  ? "bg-secondary/20 text-secondary"
                  : isPaidUser
                    ? "text-neutral-500 hover:text-neutral-300"
                    : "text-secondary/70 hover:text-secondary border border-secondary/30 animate-pulse-neon"
              }`}
              title={isPaidUser ? "8 credits per game" : "Upgrade to PRO"}
            >
              PRO {!isPaidUser && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="inline-block ml-0.5 -mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
            </button>
          </div>
        </div>
        <button
          onClick={onNewGame}
          className="text-xs font-semibold text-neutral-400 hover:text-neutral-200 px-3 py-1.5 rounded border border-neutral-700 hover:border-neutral-500 transition-colors"
        >
          + NEW GAME
        </button>
      </div>

      {/* Streaming warning banner */}
      {isStreaming && (
        <div className="px-4 py-2 bg-secondary/10 border-b border-secondary/20 flex items-center gap-2">
          <span className="text-sm">&#9888;&#65039;</span>
          <span className="text-xs text-secondary">Don&apos;t close this window — MAX is still building. Your changes may be lost.</span>
        </div>
      )}

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

        {/* Credit usage after last assistant message */}
        {!isStreaming && !isAutoFixing && tokenUsage && messages.length > 0 && (
          <div className="flex gap-3 -mt-2 ml-10">
            <div className="text-[10px] text-neutral-600 flex items-center gap-2">
              <span>{tokenUsage.credits_used} credit{tokenUsage.credits_used !== 1 ? "s" : ""} used</span>
              {fixTokenUsage && (
                <span className="text-secondary">+ {fixTokenUsage.credits_used} credits auto-fix</span>
              )}
            </div>
          </div>
        )}

        {/* MAX PRO upsell after generation */}
        {!isStreaming && !isAutoFixing && tokenUsage && messages.length > 0 && selectedModel === "max" && !proUpsellDismissed && (
          <div className="ml-10 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2.5 flex items-start gap-2.5">
            <span className="text-base mt-0.5">&#9889;</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-300 leading-relaxed">
                <span className="font-semibold text-primary-light">Want smarter games?</span>{" "}
                MAX PRO uses deep thinking for complex mechanics, better AI, and fewer bugs.
              </p>
              <button
                onClick={() => isPaidUser ? onModelChange("max-pro") : showProUpsell()}
                className="mt-1.5 text-[10px] font-bold text-primary-light hover:text-white uppercase tracking-wider transition-colors"
              >
                {isPaidUser ? "SWITCH TO MAX PRO →" : "GET MAX PRO →"}
              </button>
            </div>
            <button
              onClick={() => setProUpsellDismissed(true)}
              className="text-neutral-600 hover:text-neutral-400 transition-colors shrink-0 p-0.5"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Auto-fixing indicator (outside streaming) */}
        {isAutoFixing && !isStreaming && (
          <div className="flex gap-3">
            <MaxAvatar />
            <div className="bg-surface-light border border-primary/20 rounded-lg px-4 py-3 max-w-[85%]">
              <div className="flex items-center gap-2 text-sm text-secondary">
                <span className="animate-pulse">🔧</span>
                <span>Fixing error<span className="animate-pulse">...</span> (2 credits)</span>
              </div>
            </div>
          </div>
        )}

        {/* Streaming response */}
        {isStreaming && (
          <div className="flex gap-3">
            <MaxAvatar />
            <div className="bg-surface-light border border-primary/20 rounded-lg px-4 py-3 max-w-[85%]">
              {streamingText && isBuildingCode ? (
                <div className="flex items-center gap-2.5">
                  <span className="text-lg animate-pulse">🎮</span>
                  <span key={buildingMsg} className="text-sm font-semibold text-primary-light neon-text animate-fade-in-up">{buildingMsg}</span>
                </div>
              ) : streamingText ? (
                <p className="text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap">
                  {stripGameCode(streamingText)}
                </p>
              ) : streamPhase === "thinking" ? (
                <div className="flex items-center gap-2.5">
                  <span className="text-lg animate-pulse">🧠</span>
                  <span key={rotatingMsg} className="text-sm font-semibold text-primary-light neon-text animate-fade-in-up">{rotatingMsg}</span>
                </div>
              ) : streamPhase === "generating" ? (
                <div className="flex items-center gap-2.5">
                  <span className="text-lg animate-pulse">⚡</span>
                  <span key={rotatingMsg} className="text-sm font-semibold text-primary-light neon-text animate-fade-in-up">{rotatingMsg}</span>
                </div>
              ) : streamPhase === "continuing" ? (
                <div className="flex items-center gap-2.5">
                  <span className="text-lg animate-pulse">🔄</span>
                  <span key={rotatingMsg} className="text-sm font-semibold text-secondary neon-text-yellow animate-fade-in-up">{rotatingMsg}</span>
                </div>
              ) : streamPhase === "finishing" ? (
                <div className="flex items-center gap-2.5">
                  <span className="text-lg animate-pulse">🏁</span>
                  <span key={rotatingMsg} className="text-sm font-semibold text-secondary neon-text-yellow animate-fade-in-up">{rotatingMsg}</span>
                </div>
              ) : streamPhase === "building" ? (
                <div className="flex items-center gap-2.5">
                  <span className="text-lg animate-pulse">🔨</span>
                  <span key={rotatingMsg} className="text-sm font-semibold text-primary-light neon-text animate-fade-in-up">{rotatingMsg}</span>
                </div>
              ) : streamPhase === "polishing" ? (
                <div className="flex items-center gap-2.5">
                  <span className="text-lg animate-pulse">✨</span>
                  <span key={rotatingMsg} className="text-sm font-semibold text-secondary neon-text-yellow animate-fade-in-up">{rotatingMsg}</span>
                </div>
              ) : streamPhase === "auto-fixing" ? (
                <div className="flex items-center gap-2.5">
                  <span className="text-lg animate-pulse">🔧</span>
                  <span className="text-sm font-semibold text-secondary neon-text-yellow">Fixing error... (2 credits)</span>
                </div>
              ) : (
                <TypingIndicator />
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Auto-fix exhausted — retry banner */}
      {autoFixExhausted && !isStreaming && !isAutoFixing && onRetry && (
        <div className="px-4 py-3 bg-red-500/10 border-t border-red-500/20">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            <p className="text-xs text-red-300 flex-1">
              Auto-fix couldn&apos;t resolve the errors. Ask MAX to fix it or retry.
            </p>
            <button
              onClick={onRetry}
              className="shrink-0 text-xs font-bold text-primary-light hover:text-white px-3 py-1.5 rounded border border-primary/40 hover:border-primary-light hover:bg-primary/10 transition-colors uppercase tracking-wider"
            >
              Retry
            </button>
          </div>
          {lastGameErrors && lastGameErrors.length > 0 && (
            <div className="mt-2 ml-4 text-[10px] text-neutral-500 font-mono space-y-0.5">
              {lastGameErrors.slice(0, 3).map((e, i) => (
                <div key={i} className="truncate">&bull; {e}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Input bar */}
      <div className="px-4 py-3 border-t border-neutral-700">
        {outOfCredits ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <p className="text-sm text-secondary font-semibold">
              You&apos;re out of credits
            </p>
            <button
              onClick={onBuyCredits}
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold uppercase hover:bg-primary-light transition-colors glow-green"
            >
              BUY CREDITS
            </button>
          </div>
        ) : (
          <>
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
            <div className="flex items-center justify-between mt-1.5 px-1">
              <p className="text-[10px] text-neutral-600">
                {selectedModel === "max-pro" ? "8 credits/game" : "1–2 credits/msg"} · Iterations cost 2 · Complex games may use more
              </p>
              {credits !== undefined && credits <= 3 && credits > 0 && (
                <p className="text-[10px] text-secondary font-semibold">
                  {credits} credit{credits !== 1 ? "s" : ""} left
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

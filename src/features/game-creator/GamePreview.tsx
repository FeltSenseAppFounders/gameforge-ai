"use client";

import { useRef, useCallback } from "react";

interface GamePreviewProps {
  gameCode: string | null;
  isLoading: boolean;
  onSave?: () => void;
  onPublish?: () => void;
  isSaving?: boolean;
  gameName?: string;
}

function GamepadIcon({ className }: { className?: string }) {
  return (
    <svg
      width="48"
      height="48"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1}
      className={className}
    >
      <line x1="6" y1="11" x2="10" y2="11" />
      <line x1="8" y1="9" x2="8" y2="13" />
      <line x1="15" y1="12" x2="15.01" y2="12" />
      <line x1="18" y1="10" x2="18.01" y2="10" />
      <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
    </svg>
  );
}

export function GamePreview({
  gameCode,
  isLoading,
  onSave,
  onPublish,
  isSaving,
  gameName,
}: GamePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleRestart = useCallback(() => {
    const iframe = iframeRef.current;
    if (iframe && gameCode) {
      // Force reload by clearing and re-setting srcdoc
      iframe.srcdoc = "";
      requestAnimationFrame(() => {
        iframe.srcdoc = gameCode;
      });
    }
  }, [gameCode]);

  const handleFullscreen = useCallback(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.requestFullscreen?.();
    }
  }, []);

  // Empty state — no game yet
  if (!gameCode && !isLoading) {
    return (
      <div className="flex flex-col h-full bg-surface-dark">
        {/* Controls bar placeholder */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-700 bg-surface">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            GAME PREVIEW
          </span>
        </div>

        {/* Empty state */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <GamepadIcon className="text-neutral-700 mx-auto mb-4" />
            <h3 className="text-xl font-heading text-neutral-500 uppercase mb-2">
              YOUR GAME WILL APPEAR HERE
            </h3>
            <p className="text-sm text-neutral-600 max-w-xs mx-auto">
              Tell MAX what kind of game you want to build. The preview updates
              in real-time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading && !gameCode) {
    return (
      <div className="flex flex-col h-full bg-surface-dark">
        {/* Controls bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-700 bg-surface">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            GAME PREVIEW
          </span>
        </div>

        {/* Loading state */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
              <div className="w-3 h-3 rounded-full bg-primary-light animate-pulse" />
            </div>
            <h3 className="text-lg font-heading text-primary-light uppercase neon-text mb-2">
              MAX IS BUILDING YOUR GAME...
            </h3>
            <p className="text-sm text-neutral-500">
              Generating Phaser.js code
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Game loaded — show iframe
  return (
    <div className="flex flex-col h-full bg-surface-dark">
      {/* Controls bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-700 bg-surface">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-primary-light uppercase tracking-wider">
            {gameName || "GAME PREVIEW"}
          </span>
          {isLoading && (
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              <span className="text-[10px] text-secondary font-semibold uppercase">
                Updating...
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Restart */}
          <button
            onClick={handleRestart}
            title="Restart game"
            className="p-2 rounded hover:bg-surface-light text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>

          {/* Fullscreen */}
          <button
            onClick={handleFullscreen}
            title="Fullscreen"
            className="p-2 rounded hover:bg-surface-light text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </button>

          {/* Save */}
          {onSave && (
            <button
              onClick={onSave}
              disabled={isSaving}
              title="Save game"
              className="px-3 py-1.5 rounded text-xs font-semibold text-neutral-300 hover:text-neutral-100 border border-neutral-700 hover:border-neutral-500 disabled:opacity-50 transition-colors"
            >
              {isSaving ? "SAVING..." : "SAVE"}
            </button>
          )}

          {/* Publish */}
          {onPublish && (
            <button
              onClick={onPublish}
              title="Publish to community"
              className="px-3 py-1.5 rounded text-xs font-semibold bg-primary text-white hover:bg-primary-light transition-colors glow-green"
            >
              PUBLISH
            </button>
          )}
        </div>
      </div>

      {/* Game iframe */}
      <div className="flex-1 relative">
        <iframe
          ref={iframeRef}
          srcDoc={gameCode ?? undefined}
          sandbox="allow-scripts"
          title="Game preview"
          className="absolute inset-0 w-full h-full bg-black"
        />
      </div>
    </div>
  );
}

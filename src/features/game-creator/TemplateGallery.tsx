"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GAME_TEMPLATES, type GameTemplate } from "@/lib/game-templates";
import { injectGameHelpers } from "@/lib/inject-game-helpers";
import { TemplateCard } from "./TemplateCard";

export function TemplateGallery() {
  const router = useRouter();
  const [playing, setPlaying] = useState<GameTemplate | null>(null);

  const handlePlay = useCallback((template: GameTemplate) => {
    setPlaying(template);
    window.history.pushState({ templatePlay: template.id }, "", null);
  }, []);

  // Close modal on browser back button
  useEffect(() => {
    if (!playing) return;
    const handlePopState = () => setPlaying(null);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [playing]);

  const handleClose = useCallback(() => {
    window.history.back();
  }, []);

  const handleCustomize = useCallback(
    (template: GameTemplate) => {
      // Replace the template-play history entry before navigating
      window.history.replaceState(null, "", window.location.href);
      setPlaying(null);
      router.push(`/dashboard/create?template=${template.id}`);
    },
    [router],
  );

  // Full-screen play modal
  if (playing) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-neutral-700">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-heading text-primary-light uppercase">
              {playing.name}
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-primary/30 text-primary-light bg-primary/10">
              {playing.genre}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleCustomize(playing)}
              className="text-xs font-semibold text-primary-light hover:text-white px-3 py-1.5 rounded border border-primary/40 hover:border-primary-light transition-colors"
            >
              CUSTOMIZE WITH MAX
            </button>
            <button
              onClick={handleClose}
              className="text-xs font-semibold text-neutral-400 hover:text-neutral-200 px-3 py-1.5 rounded border border-neutral-700 hover:border-neutral-500 transition-colors"
            >
              CLOSE
            </button>
          </div>
        </div>

        {/* Game iframe */}
        <div className="flex-1">
          <iframe
            srcDoc={injectGameHelpers(playing.gameCode)}
            sandbox="allow-scripts"
            title={playing.name}
            className="w-full h-full bg-black"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {GAME_TEMPLATES.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onPlay={handlePlay}
            onCustomize={handleCustomize}
          />
        ))}
      </div>
    </div>
  );
}

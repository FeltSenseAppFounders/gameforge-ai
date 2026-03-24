"use client";

import type { GameTemplate } from "@/lib/game-templates";

const genreColors: Record<string, string> = {
  shooter: "bg-accent/10 text-accent border-accent/30",
  platformer: "bg-accent-blue/10 text-accent-blue border-accent-blue/30",
  puzzle: "bg-accent-purple/10 text-accent-purple border-accent-purple/30",
  racing: "bg-secondary/10 text-secondary border-secondary/30",
  rpg: "bg-primary-light/10 text-primary-light border-primary-light/30",
};

interface TemplateCardProps {
  template: GameTemplate;
  onPlay: (template: GameTemplate) => void;
  onCustomize: (template: GameTemplate) => void;
}

export function TemplateCard({
  template,
  onPlay,
  onCustomize,
}: TemplateCardProps) {
  return (
    <div className="group bg-surface border border-neutral-700 rounded-lg overflow-hidden hover:border-primary/40 transition-colors">
      {/* Preview thumbnail */}
      <div className="aspect-video bg-surface-dark relative overflow-hidden">
        <iframe
          srcDoc={template.gameCode}
          sandbox=""
          title={template.name}
          className="w-full h-full pointer-events-none"
          loading="lazy"
          tabIndex={-1}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={() => onPlay(template)}
            className="px-4 py-2 rounded text-xs font-bold uppercase bg-primary text-white hover:bg-primary-light transition-colors glow-green"
          >
            PLAY
          </button>
          <button
            onClick={() => onCustomize(template)}
            className="px-4 py-2 rounded text-xs font-bold uppercase border border-neutral-400 text-neutral-200 hover:border-primary-light hover:text-primary-light transition-colors"
          >
            CUSTOMIZE
          </button>
        </div>
      </div>

      {/* Card info */}
      <div className="p-4">
        <h3 className="text-sm font-heading text-neutral-100 uppercase truncate group-hover:text-primary-light transition-colors">
          {template.name}
        </h3>
        <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
          {template.description}
        </p>
        <div className="mt-2">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${genreColors[template.genre] || "text-neutral-400 border-neutral-600"}`}
          >
            {template.genre}
          </span>
        </div>
      </div>
    </div>
  );
}

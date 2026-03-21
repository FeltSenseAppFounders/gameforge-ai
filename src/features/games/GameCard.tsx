"use client";

import Link from "next/link";
import type { GameProject } from "@/core/types";

const genreColors: Record<string, string> = {
  shooter: "bg-accent/10 text-accent border-accent/30",
  platformer: "bg-accent-blue/10 text-accent-blue border-accent-blue/30",
  puzzle: "bg-accent-purple/10 text-accent-purple border-accent-purple/30",
  racing: "bg-secondary/10 text-secondary border-secondary/30",
  rpg: "bg-primary-light/10 text-primary-light border-primary-light/30",
  other: "bg-neutral-500/10 text-neutral-400 border-neutral-500/30",
};

const statusColors: Record<string, string> = {
  draft: "bg-neutral-500/10 text-neutral-400 border-neutral-500/30",
  playable: "bg-primary/10 text-primary-light border-primary/30",
  published: "bg-secondary/10 text-secondary border-secondary/30",
};

function Badge({
  label,
  colorClass,
}: {
  label: string;
  colorClass: string;
}) {
  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${colorClass}`}
    >
      {label}
    </span>
  );
}

export function GameCard({ game }: { game: GameProject }) {
  const genreColor = genreColors[game.genre || "other"] || genreColors.other;
  const statusColor = statusColors[game.status] || statusColors.draft;

  return (
    <Link
      href={`/dashboard/games/${game.id}`}
      className="group block bg-surface border border-neutral-700 rounded-lg overflow-hidden hover:border-primary/40 transition-colors"
    >
      {/* Game preview thumbnail */}
      <div className="aspect-video bg-surface-dark relative overflow-hidden">
        {game.game_code ? (
          <iframe
            srcDoc={game.game_code}
            sandbox="allow-scripts"
            title={game.name}
            className="w-full h-full pointer-events-none"
            tabIndex={-1}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg
              width="32"
              height="32"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
              className="text-neutral-700"
            >
              <line x1="6" y1="11" x2="10" y2="11" />
              <line x1="8" y1="9" x2="8" y2="13" />
              <line x1="15" y1="12" x2="15.01" y2="12" />
              <line x1="18" y1="10" x2="18.01" y2="10" />
              <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
            </svg>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-xs font-bold text-white uppercase tracking-wider bg-primary/80 px-3 py-1.5 rounded">
            {game.game_code ? "OPEN" : "EDIT"}
          </span>
        </div>
      </div>

      {/* Card info */}
      <div className="p-4">
        <h3 className="text-sm font-heading text-neutral-100 uppercase truncate group-hover:text-primary-light transition-colors">
          {game.name}
        </h3>

        {/* Badges */}
        <div className="flex items-center gap-2 mt-2">
          {game.genre && (
            <Badge label={game.genre} colorClass={genreColor} />
          )}
          <Badge label={game.status} colorClass={statusColor} />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 text-[11px] text-neutral-500">
          <span className="flex items-center gap-1">
            <svg
              width="12"
              height="12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {game.views_count}
          </span>
          <span className="flex items-center gap-1">
            <svg
              width="12"
              height="12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {game.likes_count}
          </span>
        </div>
      </div>
    </Link>
  );
}

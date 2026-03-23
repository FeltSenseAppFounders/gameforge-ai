"use client";

import type { GameProject } from "@/core/types";

interface TrendingGamesProps {
  games: GameProject[];
  onPlay: (game: GameProject) => void;
}

export function TrendingGames({ games, onPlay }: TrendingGamesProps) {
  if (games.length === 0) return null;

  return (
    <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin">
      {games.map((game, i) => (
        <button
          key={game.id}
          onClick={() => onPlay(game)}
          className="group flex-shrink-0 w-[260px] bg-surface border border-neutral-700 rounded-lg overflow-hidden hover:border-accent/40 transition-colors text-left"
        >
          {/* Preview */}
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
                <span className="text-neutral-700 text-sm">No preview</span>
              </div>
            )}

            {/* Rank badge */}
            <div className="absolute top-2 left-2 z-10">
              <span className="text-lg font-heading text-accent font-bold">
                #{i + 1}
              </span>
            </div>

            {/* Play overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-accent/80 flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="text-white ml-0.5"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-3">
            <h3 className="text-xs font-heading text-neutral-100 uppercase truncate group-hover:text-accent transition-colors">
              {game.name}
            </h3>
            {game.creator_name && (
              <p className="text-[10px] text-neutral-500 mt-0.5">
                by {game.creator_name}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2 text-[10px] text-neutral-500">
              <span className="flex items-center gap-1">
                <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {game.views_count}
              </span>
              <span className="flex items-center gap-1">
                <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {game.likes_count}
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

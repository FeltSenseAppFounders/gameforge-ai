"use client";

import { useState } from "react";
import type { GameProject } from "@/core/types";

const genreColors: Record<string, string> = {
  shooter: "bg-accent/10 text-accent border-accent/30",
  platformer: "bg-accent-blue/10 text-accent-blue border-accent-blue/30",
  puzzle: "bg-accent-purple/10 text-accent-purple border-accent-purple/30",
  racing: "bg-secondary/10 text-secondary border-secondary/30",
  rpg: "bg-primary-light/10 text-primary-light border-primary-light/30",
};

interface FeaturedGamesProps {
  games: GameProject[];
  onPlay: (game: GameProject) => void;
}

export function FeaturedGames({ games, onPlay }: FeaturedGamesProps) {
  if (games.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {games.map((game, i) => (
        <button
          key={game.id}
          onClick={() => onPlay(game)}
          className="group relative block bg-surface border border-secondary/30 rounded-lg overflow-hidden hover:border-secondary/60 transition-all text-left"
        >
          {/* Featured badge */}
          <div className="absolute top-3 right-3 z-10">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-secondary/20 text-secondary border border-secondary/30">
              FEATURED
            </span>
          </div>

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

            {/* Play overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-secondary/80 flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="text-black ml-1"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="text-base font-heading text-neutral-100 uppercase truncate group-hover:text-secondary transition-colors">
              {game.name}
            </h3>
            {game.creator_name && (
              <p className="text-xs text-neutral-500 mt-0.5">
                by {game.creator_name}
              </p>
            )}
            <div className="flex items-center justify-between mt-3">
              {game.genre && (
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${genreColors[game.genre] || "text-neutral-400 border-neutral-600"}`}
                >
                  {game.genre}
                </span>
              )}
              <div className="flex items-center gap-3 text-[11px] text-neutral-500">
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {game.views_count}
                </span>
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {game.likes_count}
                </span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

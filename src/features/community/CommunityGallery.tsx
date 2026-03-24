"use client";

import { useState, useMemo } from "react";
import type { GameProject } from "@/core/types";
import { FeaturedGames } from "./FeaturedGames";
import { TrendingGames } from "./TrendingGames";
import { ShareButton } from "./ShareButton";
import { LikeButton } from "./LikeButton";

const genres = ["all", "shooter", "platformer", "puzzle", "racing", "rpg"];

const genreColors: Record<string, string> = {
  shooter: "bg-accent/10 text-accent border-accent/30",
  platformer: "bg-accent-blue/10 text-accent-blue border-accent-blue/30",
  puzzle: "bg-accent-purple/10 text-accent-purple border-accent-purple/30",
  racing: "bg-secondary/10 text-secondary border-secondary/30",
  rpg: "bg-primary-light/10 text-primary-light border-primary-light/30",
};

// Mock comments pool for demo
const MOCK_COMMENTS = [
  { user: "NeonPlayer42", avatar: "N", text: "This is insanely fun! Can't stop playing." },
  { user: "RetroGamer", avatar: "R", text: "Love the visuals. Great use of Phaser.js!" },
  { user: "PixelQueen", avatar: "P", text: "Beat my high score of 340! Who can top it?" },
  { user: "CodeWizard", avatar: "C", text: "How did you make the particle effects? Impressive." },
  { user: "ArcadeKing", avatar: "A", text: "Reminds me of classic arcade games. Nostalgic!" },
  { user: "GameDevSara", avatar: "G", text: "Clean code, smooth gameplay. Well done!" },
  { user: "8BitFan", avatar: "8", text: "Added this to my favorites. More levels please!" },
  { user: "MaxBuilder", avatar: "M", text: "Made something similar with MAX. Great inspiration!" },
];

function getMockComments(gameId: string) {
  // Deterministic selection based on game ID
  const hash = gameId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const comments = [];
  for (let i = 0; i < 3; i++) {
    comments.push(MOCK_COMMENTS[(hash + i * 3) % MOCK_COMMENTS.length]);
  }
  return comments;
}

interface CommunityGalleryProps {
  games: GameProject[];
  featured?: GameProject[];
  trending?: GameProject[];
}

export function CommunityGallery({
  games,
  featured = [],
  trending = [],
}: CommunityGalleryProps) {
  const [filter, setFilter] = useState("all");
  const [playingGame, setPlayingGame] = useState<GameProject | null>(null);

  const filtered = useMemo(
    () =>
      filter === "all" ? games : games.filter((g) => g.genre === filter),
    [games, filter],
  );

  const comments = useMemo(
    () => (playingGame ? getMockComments(playingGame.id) : []),
    [playingGame],
  );

  // Full-screen play modal
  if (playingGame) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-neutral-700">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-heading text-primary-light uppercase">
              {playingGame.name}
            </h2>
            {playingGame.genre && (
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${genreColors[playingGame.genre] || ""}`}
              >
                {playingGame.genre}
              </span>
            )}
            {playingGame.creator_name && (
              <span className="text-[11px] text-neutral-500">
                by {playingGame.creator_name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <LikeButton
              gameId={playingGame.id}
              initialCount={playingGame.likes_count}
            />
            <ShareButton
              gameId={playingGame.id}
              gameName={playingGame.name}
            />
            <button
              onClick={() => setPlayingGame(null)}
              className="text-xs font-semibold text-neutral-400 hover:text-neutral-200 px-3 py-1.5 rounded border border-neutral-700 hover:border-neutral-500 transition-colors"
            >
              CLOSE
            </button>
          </div>
        </div>

        {/* Game + comments */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Game iframe */}
          <div className="flex-1 relative">
            {playingGame.game_code && (
              <iframe
                srcDoc={playingGame.game_code}
                sandbox="allow-scripts"
                title={playingGame.name}
                className="w-full h-full bg-black"
              />
            )}
          </div>

          {/* Comments sidebar */}
          <div className="lg:w-[300px] border-t lg:border-t-0 lg:border-l border-neutral-700 bg-surface flex flex-col">
            <div className="px-4 py-3 border-b border-neutral-700">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                COMMENTS
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.map((comment, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-neutral-300">
                      {comment.avatar}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-300">
                      {comment.user}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Disabled comment input */}
            <div className="p-4 border-t border-neutral-700">
              <div className="flex items-center gap-2 px-3 py-2 rounded bg-surface-dark border border-neutral-700 opacity-60">
                <span className="text-xs text-neutral-500">
                  Create a game to join the conversation
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Featured */}
      {featured.length > 0 && (
        <section>
          <h2 className="text-xl font-heading text-secondary uppercase mb-4">
            FEATURED
          </h2>
          <FeaturedGames games={featured} onPlay={setPlayingGame} />
        </section>
      )}

      {/* Trending */}
      {trending.length > 0 && (
        <section>
          <h2 className="text-xl font-heading text-accent uppercase mb-4">
            TRENDING
          </h2>
          <TrendingGames games={trending} onPlay={setPlayingGame} />
        </section>
      )}

      {/* All Games */}
      <section>
        <h2 className="text-xl font-heading text-neutral-200 uppercase mb-4">
          ALL GAMES
        </h2>

        {/* Genre filter */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setFilter(genre)}
              className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded border transition-colors whitespace-nowrap ${
                filter === genre
                  ? "bg-primary/10 text-primary-light border-primary/40"
                  : "text-neutral-400 border-neutral-700 hover:border-neutral-500 hover:text-neutral-200"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Games grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg
              width="48"
              height="48"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
              className="text-neutral-700 mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-lg font-heading text-neutral-500 uppercase mb-2">
              NO GAMES FOUND
            </h3>
            <p className="text-sm text-neutral-600">
              No public games match this filter yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((game) => (
              <button
                key={game.id}
                onClick={() => setPlayingGame(game)}
                className="group block bg-surface border border-neutral-700 rounded-lg overflow-hidden hover:border-primary/40 transition-colors text-left"
              >
                {/* Preview thumbnail */}
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
                      <span className="text-neutral-700 text-sm">
                        No preview
                      </span>
                    </div>
                  )}

                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center glow-green">
                      <svg
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="text-white ml-1"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Card info */}
                <div className="p-4">
                  <h3 className="text-sm font-heading text-neutral-100 uppercase truncate group-hover:text-primary-light transition-colors">
                    {game.name}
                  </h3>
                  {game.creator_name && (
                    <p className="text-[10px] text-neutral-500 mt-0.5">
                      by {game.creator_name}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    {game.genre && (
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${genreColors[game.genre] || "text-neutral-400 border-neutral-600"}`}
                      >
                        {game.genre}
                      </span>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-neutral-500">
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
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

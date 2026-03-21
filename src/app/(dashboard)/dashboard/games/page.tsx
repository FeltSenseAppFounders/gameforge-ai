import Link from "next/link";
import { getStudioContext } from "@/lib/studio-context";
import { createClient } from "@/lib/supabase/server";
import { GamesGrid } from "@/features/games";
import type { GameProject } from "@/core/types";

export default async function GamesPage() {
  const ctx = await getStudioContext();
  if (!ctx) return null;

  const supabase = await createClient();
  const { data: games } = await supabase
    .from("game_projects")
    .select("*")
    .eq("studio_id", ctx.studioId)
    .order("updated_at", { ascending: false });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading text-primary-light uppercase neon-text">
            MY GAMES
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {(games || []).length} game{(games || []).length !== 1 ? "s" : ""} in your studio
          </p>
        </div>

        <Link
          href="/dashboard/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-light text-white text-sm font-semibold rounded transition-colors glow-green"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          CREATE GAME
        </Link>
      </div>

      {/* Games grid */}
      <GamesGrid games={(games || []) as GameProject[]} />
    </div>
  );
}

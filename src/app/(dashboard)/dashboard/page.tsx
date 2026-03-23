import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getStudioContext } from "@/lib/studio-context";
import { DemoTour } from "@/features/onboarding/DemoTour";
import { TemplateGallery } from "@/features/game-creator/TemplateGallery";

export default async function DashboardPage() {
  const supabase = await createClient();
  const ctx = await getStudioContext();

  if (!ctx) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-neutral-500">No studio found. Please sign in.</p>
      </div>
    );
  }

  // Fetch KPI data
  const [gamesResult, publishedResult, recentGamesResult] = await Promise.all([
    supabase
      .from("game_projects")
      .select("id", { count: "exact" })
      .eq("studio_id", ctx.studioId),
    supabase
      .from("game_projects")
      .select("id, likes_count, views_count", { count: "exact" })
      .eq("studio_id", ctx.studioId)
      .eq("status", "published"),
    supabase
      .from("game_projects")
      .select("id, name, genre, status, created_at")
      .eq("studio_id", ctx.studioId)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const gamesCreated = gamesResult.count ?? 0;
  const gamesPublished = publishedResult.count ?? 0;
  const publishedData = publishedResult.data ?? [];
  const totalPlays = publishedData.reduce((sum, g) => sum + (g.views_count ?? 0), 0);
  const totalLikes = publishedData.reduce((sum, g) => sum + (g.likes_count ?? 0), 0);
  const recentGames = recentGamesResult.data ?? [];

  const kpis = [
    { label: "GAMES CREATED", value: gamesCreated.toLocaleString() },
    { label: "PUBLISHED", value: gamesPublished.toLocaleString() },
    { label: "TOTAL PLAYS", value: totalPlays.toLocaleString() },
    { label: "COMMUNITY LIKES", value: totalLikes.toLocaleString() },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading text-primary-light uppercase neon-text">
          COMMAND CENTER
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Your game creation overview
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-surface rounded-lg border border-neutral-700 p-6 hud-bracket"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">
              {kpi.label}
            </p>
            <p className="text-3xl font-heading text-primary-light uppercase neon-text">
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick-start card */}
      <Link
        href="/dashboard/create"
        className="block bg-surface rounded-lg border border-primary-light/20 p-8 glow-green glow-green-hover transition-all duration-200 group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center group-hover:bg-primary-light transition-colors duration-200">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-heading text-primary-light uppercase">
              CREATE A NEW GAME
            </h2>
            <p className="text-sm text-neutral-400">
              Chat with MAX to build a new game from scratch
            </p>
          </div>
        </div>
      </Link>

      {/* Starter Game Templates */}
      <div>
        <h2 className="text-xl font-heading text-neutral-200 uppercase mb-1">
          STARTER GAMES
        </h2>
        <p className="text-sm text-neutral-500 mb-4">
          Play instantly or customize with MAX
        </p>
        <TemplateGallery />
      </div>

      {/* Recent Games */}
      {recentGames.length > 0 && (
        <div>
          <h2 className="text-xl font-heading text-neutral-200 uppercase mb-4">
            RECENT GAMES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentGames.map((game) => (
              <Link
                key={game.id}
                href={`/dashboard/games/${game.id}`}
                className="bg-surface rounded-lg border border-neutral-700 p-6 hover:border-primary-light/30 transition-colors duration-200"
              >
                <div className="flex items-center gap-2 mb-3">
                  {game.genre && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-secondary/10 text-secondary text-[11px] font-semibold uppercase tracking-wider border border-secondary/20">
                      {game.genre}
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[11px] font-semibold uppercase tracking-wider border ${
                      game.status === "playable"
                        ? "bg-success/10 text-success border-success/20"
                        : game.status === "published"
                          ? "bg-primary-light/10 text-primary-light border-primary-light/20"
                          : "bg-neutral-500/10 text-neutral-400 border-neutral-600"
                    }`}
                  >
                    {game.status}
                  </span>
                </div>
                <h3 className="text-lg font-heading text-neutral-200 uppercase">
                  {game.name}
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  {new Date(game.created_at).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
      <Suspense>
        <DemoTour />
      </Suspense>
    </div>
  );
}

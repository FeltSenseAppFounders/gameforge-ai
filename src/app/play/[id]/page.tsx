import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { PlayPageClient } from "./PlayPageClient";
import { injectTouchControls } from "@/lib/inject-touch-controls";

interface PlayPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: game } = await supabase
    .from("game_projects")
    .select("*")
    .eq("id", id)
    .eq("is_public", true)
    .eq("status", "published")
    .single();

  if (!game || !game.game_code) {
    notFound();
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1A1A1A] border-b border-neutral-700">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#47761E] flex items-center justify-center">
              <span className="text-xs font-bold text-white">GF</span>
            </div>
            <span className="text-sm font-bold text-[#7CFC00] uppercase tracking-wider hidden sm:inline">
              GAMEFORGE
            </span>
          </Link>

          <div className="w-px h-6 bg-neutral-700" />

          {/* Game info */}
          <h1 className="text-sm font-bold text-neutral-200 uppercase tracking-wider">
            {game.name}
          </h1>
          {game.genre && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-neutral-600 text-neutral-400">
              {game.genre}
            </span>
          )}
          {game.creator_name && (
            <span className="text-xs text-neutral-500 hidden sm:inline">
              by {game.creator_name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <PlayPageClient gameId={game.id} gameName={game.name} likesCount={game.likes_count} />
          <Link
            href="/try-it-now"
            className="px-4 py-1.5 rounded text-xs font-bold uppercase bg-[#47761E] text-white hover:bg-[#7CFC00] hover:text-black transition-colors"
          >
            CREATE YOUR OWN
          </Link>
        </div>
      </div>

      {/* Game iframe — full remaining height */}
      <div className="flex-1 relative">
        <iframe
          srcDoc={injectTouchControls(game.game_code)}
          sandbox="allow-scripts"
          title={game.name}
          className="absolute inset-0 w-full h-full bg-black"
        />
      </div>

      {/* Bottom CTA bar */}
      <div className="px-4 py-3 bg-[#1A1A1A] border-t border-neutral-700">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {game.views_count} plays
            </span>
          </div>
          <Link
            href="/try-it-now"
            className="text-xs font-semibold text-[#7CFC00] hover:underline"
          >
            Create your own game with GAMEFORGE AI — It&apos;s free
          </Link>
        </div>
      </div>
    </div>
  );
}

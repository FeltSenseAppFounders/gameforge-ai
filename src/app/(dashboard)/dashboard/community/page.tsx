import { createClient } from "@/lib/supabase/server";
import { CommunityGallery } from "@/features/community";
import { FeaturedGames } from "@/features/community/FeaturedGames";
import { TrendingGames } from "@/features/community/TrendingGames";
import type { GameProject } from "@/core/types";

export default async function CommunityPage() {
  const supabase = await createClient();

  // Fetch featured (top 3 by likes)
  const { data: featured } = await supabase
    .from("game_projects")
    .select("*")
    .eq("is_public", true)
    .eq("status", "published")
    .order("likes_count", { ascending: false })
    .limit(3);

  // Fetch trending (top 6 by views)
  const { data: trending } = await supabase
    .from("game_projects")
    .select("*")
    .eq("is_public", true)
    .eq("status", "published")
    .order("views_count", { ascending: false })
    .limit(6);

  // Fetch all for the gallery
  const { data: games } = await supabase
    .from("game_projects")
    .select("*")
    .eq("is_public", true)
    .eq("status", "published")
    .order("likes_count", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading text-primary-light uppercase neon-text">
          COMMUNITY ARCADE
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Play, share, and discover games built by creators worldwide
        </p>
      </div>

      {/* Featured section */}
      {featured && featured.length > 0 && (
        <CommunityGallery
          games={(games || []) as GameProject[]}
          featured={(featured || []) as GameProject[]}
          trending={(trending || []) as GameProject[]}
        />
      )}

      {/* Fallback if no featured */}
      {(!featured || featured.length === 0) && (
        <CommunityGallery
          games={(games || []) as GameProject[]}
          featured={[]}
          trending={[]}
        />
      )}
    </div>
  );
}

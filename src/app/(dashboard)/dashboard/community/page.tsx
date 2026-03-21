import { createClient } from "@/lib/supabase/server";
import { CommunityGallery } from "@/features/community";
import type { GameProject } from "@/core/types";

export default async function CommunityPage() {
  const supabase = await createClient();

  // Fetch all public games, ordered by likes then recency
  const { data: games } = await supabase
    .from("game_projects")
    .select("*")
    .eq("is_public", true)
    .eq("status", "published")
    .order("likes_count", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-heading text-primary-light uppercase neon-text">
          COMMUNITY GALLERY
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Play games built by creators around the world
        </p>
      </div>

      {/* Gallery */}
      <CommunityGallery games={(games || []) as GameProject[]} />
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import type { Studio } from "@/core/types";

export interface StudioContext {
  studioId: string;
  studio: Studio;
}

/**
 * Resolves the current user's studio.
 * Returns null if the user is not authenticated or has no studio.
 */
export async function getStudioContext(): Promise<StudioContext | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Get the user's studio (first one — users have one studio for now)
  const { data: studio } = await supabase
    .from("studios")
    .select("*")
    .eq("owner_id", user.id)
    .limit(1)
    .single();

  if (!studio) return null;

  return {
    studioId: studio.id,
    studio: studio as Studio,
  };
}

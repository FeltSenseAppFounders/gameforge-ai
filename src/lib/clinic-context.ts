import { createClient } from "@/lib/supabase/server";
import type { Clinic } from "@/core/types";

export interface ClinicContext {
  clinicId: string;
  clinic: Clinic;
}

/**
 * Resolves the current user's clinic from their clinic_members row.
 * Returns null if the user is not authenticated or has no clinic.
 */
export async function getClinicContext(): Promise<ClinicContext | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Get the user's clinic membership (first one — users have one clinic for now)
  const { data: membership } = await supabase
    .from("clinic_members")
    .select("clinic_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!membership) return null;

  // Fetch clinic details
  const { data: clinic } = await supabase
    .from("clinics")
    .select("*")
    .eq("id", membership.clinic_id)
    .single();

  if (!clinic) return null;

  return {
    clinicId: clinic.id,
    clinic,
  };
}

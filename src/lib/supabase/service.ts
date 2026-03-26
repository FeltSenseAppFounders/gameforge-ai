import { createClient } from "@supabase/supabase-js";

/**
 * Service role Supabase client — bypasses RLS.
 * Use ONLY in server-side API routes (webhooks, admin operations).
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase service role not configured");
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

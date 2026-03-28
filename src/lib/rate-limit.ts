import { createServiceClient } from "@/lib/supabase/service";

/**
 * Distributed rate limiter using Supabase.
 * Works across all serverless instances (unlike in-memory Map).
 * Returns true if allowed, false if rate-limited.
 */
export async function rateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number
): Promise<boolean> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase.rpc("check_rate_limit", {
      p_key: key,
      p_max_requests: maxRequests,
      p_window_seconds: windowSeconds,
    });

    if (error) {
      console.error("Rate limit check failed:", error);
      // Fail open — don't break the app if DB is down
      return true;
    }

    return data === true;
  } catch (err) {
    console.error("Rate limit error:", err);
    return true;
  }
}

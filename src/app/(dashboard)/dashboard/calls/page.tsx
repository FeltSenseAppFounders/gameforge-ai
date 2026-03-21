import { createClient } from "@/lib/supabase/server";
import { CallsTable } from "@/features/calls";
import type { Call } from "@/core/types";

export default async function CallsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("calls")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const calls = (data ?? []) as Call[];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold font-heading text-neutral-800">
          Call Log
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          All recorded calls — click a row to view transcript and details
        </p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-error/10 border-l-4 border-l-error rounded-r-md">
          <p className="text-sm text-error">
            Failed to load calls: {error.message}
          </p>
        </div>
      )}

      <CallsTable calls={calls} />
    </div>
  );
}

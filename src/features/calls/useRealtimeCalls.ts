"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Call } from "@/core/types";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

/**
 * Subscribes to Supabase Realtime postgres_changes on the `calls` table.
 * Starts with server-fetched initial data and applies INSERT/UPDATE/DELETE live.
 */
export function useRealtimeCalls(initialCalls: Call[]) {
  const [calls, setCalls] = useState<Call[]>(initialCalls);
  const initialRef = useRef(initialCalls);

  // Sync if server data changes (e.g. navigation)
  useEffect(() => {
    if (initialRef.current !== initialCalls) {
      initialRef.current = initialCalls;
      setCalls(initialCalls);
    }
  }, [initialCalls]);

  const handleChange = useCallback(
    (payload: RealtimePostgresChangesPayload<Call>) => {
      if (payload.eventType === "INSERT") {
        const newCall = payload.new as Call;
        setCalls((prev) => {
          // Avoid duplicates (in case initial fetch already has it)
          if (prev.some((c) => c.id === newCall.id)) return prev;
          return [newCall, ...prev];
        });
      } else if (payload.eventType === "UPDATE") {
        const updated = payload.new as Call;
        setCalls((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );
      } else if (payload.eventType === "DELETE") {
        const deleted = payload.old as Partial<Call>;
        if (deleted.id) {
          setCalls((prev) => prev.filter((c) => c.id !== deleted.id));
        }
      }
    },
    []
  );

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("calls:realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "calls",
        },
        handleChange
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [handleChange]);

  return calls;
}

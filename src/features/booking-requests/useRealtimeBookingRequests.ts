"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { BookingRequest } from "@/core/types";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

/**
 * Subscribes to Supabase Realtime on the `booking_requests` table.
 * Starts with server-fetched data and applies INSERT/UPDATE live.
 */
export function useRealtimeBookingRequests(initial: BookingRequest[]) {
  const [requests, setRequests] = useState<BookingRequest[]>(initial);
  const initialRef = useRef(initial);

  useEffect(() => {
    if (initialRef.current !== initial) {
      initialRef.current = initial;
      setRequests(initial);
    }
  }, [initial]);

  const handleChange = useCallback(
    (payload: RealtimePostgresChangesPayload<BookingRequest>) => {
      if (payload.eventType === "INSERT") {
        const row = payload.new as BookingRequest;
        setRequests((prev) => {
          if (prev.some((r) => r.id === row.id)) return prev;
          return [row, ...prev];
        });
      } else if (payload.eventType === "UPDATE") {
        const updated = payload.new as BookingRequest;
        setRequests((prev) =>
          prev.map((r) => (r.id === updated.id ? updated : r))
        );
      } else if (payload.eventType === "DELETE") {
        const deleted = payload.old as Partial<BookingRequest>;
        if (deleted.id) {
          setRequests((prev) => prev.filter((r) => r.id !== deleted.id));
        }
      }
    },
    []
  );

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("booking-requests:realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "booking_requests" },
        handleChange
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [handleChange]);

  return requests;
}

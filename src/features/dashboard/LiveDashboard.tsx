"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import type { Call, BookingRequest } from "@/core/types";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface KPIData {
  callsToday: number;
  appointmentsThisWeek: number;
  totalPatients: number;
  avgDuration: number;
  pendingBookings: number;
}

interface LiveDashboardProps {
  initialKPIs: KPIData;
  initialRecentCalls: Call[];
}

// ─── Helpers ───────────────────────────────────────────────

function formatDuration(seconds: number): string {
  if (seconds === 0) return "0s";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
}

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

const statusDot: Record<string, string> = {
  completed: "bg-success",
  in_progress: "bg-primary",
  failed: "bg-error",
  missed: "bg-warning",
  pending: "bg-neutral-400",
  ringing: "bg-accent",
};

const kpiConfig = [
  {
    key: "callsToday" as const,
    label: "Calls Today",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    key: "appointmentsThisWeek" as const,
    label: "Appointments This Week",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    key: "totalPatients" as const,
    label: "Total Patients",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    key: "avgDuration" as const,
    label: "Avg Call Duration",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: "pendingBookings" as const,
    label: "Pending Bookings",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
];

// ─── Component ─────────────────────────────────────────────

export function LiveDashboard({ initialKPIs, initialRecentCalls }: LiveDashboardProps) {
  const [kpis, setKPIs] = useState<KPIData>(initialKPIs);
  const [recentCalls, setRecentCalls] = useState<Call[]>(initialRecentCalls);

  // Track today's call durations for live avg calculation
  const todayDurationsRef = useRef<number[]>(
    initialRecentCalls
      .filter((c) => isToday(c.created_at))
      .map((c) => c.duration_seconds ?? 0)
      .filter((d) => d > 0)
  );

  // Live booking request counter
  const handleBookingChange = useCallback(
    (payload: RealtimePostgresChangesPayload<BookingRequest>) => {
      if (payload.eventType === "INSERT") {
        const row = payload.new as BookingRequest;
        if (row.status === "new") {
          setKPIs((prev) => ({ ...prev, pendingBookings: prev.pendingBookings + 1 }));
        }
      } else if (payload.eventType === "UPDATE") {
        const row = payload.new as BookingRequest;
        const old = payload.old as Partial<BookingRequest>;
        // Went from "new" to resolved
        if (old.status === "new" && row.status !== "new") {
          setKPIs((prev) => ({ ...prev, pendingBookings: Math.max(0, prev.pendingBookings - 1) }));
        }
        // Went from resolved back to "new" (unlikely but safe)
        if (old.status !== "new" && row.status === "new") {
          setKPIs((prev) => ({ ...prev, pendingBookings: prev.pendingBookings + 1 }));
        }
      }
    },
    []
  );

  const handleCallChange = useCallback(
    (payload: RealtimePostgresChangesPayload<Call>) => {
      if (payload.eventType === "INSERT") {
        const newCall = payload.new as Call;

        // Update recent calls (keep top 8)
        setRecentCalls((prev) => {
          if (prev.some((c) => c.id === newCall.id)) return prev;
          return [newCall, ...prev].slice(0, 8);
        });

        // Update KPIs if the call is from today
        if (isToday(newCall.created_at)) {
          setKPIs((prev) => ({
            ...prev,
            callsToday: prev.callsToday + 1,
          }));
        }

        // Notify post-call tour that call data is now visible
        window.dispatchEvent(new CustomEvent("feltsense:call-data-ready"));
      } else if (payload.eventType === "UPDATE") {
        const updated = payload.new as Call;

        // Update recent calls list
        setRecentCalls((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );

        // Recalculate avg duration if completed today
        if (
          updated.status === "completed" &&
          updated.duration_seconds &&
          isToday(updated.created_at)
        ) {
          todayDurationsRef.current = [
            ...todayDurationsRef.current,
            updated.duration_seconds,
          ];
          const durations = todayDurationsRef.current;
          const avg =
            durations.length > 0
              ? Math.round(
                  durations.reduce((a, b) => a + b, 0) / durations.length
                )
              : 0;
          setKPIs((prev) => ({ ...prev, avgDuration: avg }));
        }
      } else if (payload.eventType === "DELETE") {
        const deleted = payload.old as Partial<Call>;
        if (deleted.id) {
          setRecentCalls((prev) => prev.filter((c) => c.id !== deleted.id));
        }
      }
    },
    []
  );

  useEffect(() => {
    const supabase = createClient();

    const callsChannel = supabase
      .channel("dashboard:calls")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "calls" },
        handleCallChange
      )
      .subscribe();

    const bookingsChannel = supabase
      .channel("dashboard:booking-requests")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "booking_requests" },
        handleBookingChange
      )
      .subscribe();

    return () => {
      supabase.removeChannel(callsChannel);
      supabase.removeChannel(bookingsChannel);
    };
  }, [handleCallChange, handleBookingChange]);

  const kpiValues: Record<string, string> = {
    callsToday: String(kpis.callsToday),
    appointmentsThisWeek: String(kpis.appointmentsThisWeek),
    totalPatients: String(kpis.totalPatients),
    avgDuration: formatDuration(kpis.avgDuration),
    pendingBookings: String(kpis.pendingBookings),
  };

  return (
    <>
      {/* KPI Cards */}
      <div data-tour="kpi-cards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {kpiConfig.map((kpi) => (
          <div
            key={kpi.key}
            className="bg-white rounded-lg border border-neutral-200 border-t-3 border-t-primary shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                {kpi.label}
              </span>
              <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                {kpi.icon}
              </div>
            </div>
            <p className="text-3xl font-bold font-heading text-neutral-800">
              {kpiValues[kpi.key]}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div data-tour="recent-calls" className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold font-heading text-neutral-800">
              Recent Calls
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success/10 text-success text-[11px] font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Live
            </span>
          </div>
          <Link
            href="/dashboard/calls"
            className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            View all
          </Link>
        </div>

        {recentCalls.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-neutral-400">
              No calls yet. Start your voice agent to see activity here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-200">
            {recentCalls.map((call) => (
              <li
                key={call.id}
                className="flex items-start gap-4 px-6 py-4 hover:bg-neutral-100 transition-colors duration-100"
              >
                <div
                  className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${statusDot[call.status] ?? "bg-neutral-400"}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-700 truncate">
                    {call.call_type === "inbound"
                      ? "Inbound call"
                      : "Outbound call"}
                    {call.caller_phone && (
                      <span className="font-normal text-neutral-500">
                        {" "}
                        — {call.caller_phone}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-neutral-500 truncate">
                    {call.ai_summary ?? call.call_outcome ?? "No summary"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs text-neutral-400 whitespace-nowrap">
                    {timeAgo(call.created_at)}
                  </span>
                  {call.duration_seconds != null &&
                    call.duration_seconds > 0 && (
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {formatDuration(call.duration_seconds)}
                      </p>
                    )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

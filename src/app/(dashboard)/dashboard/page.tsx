import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getClinicContext } from "@/lib/clinic-context";
import { LiveDashboard } from "@/features/dashboard";
import { DashboardVoiceWidget } from "./DashboardVoiceWidget";
import { DemoTour } from "@/features/onboarding/DemoTour";
import { PostCallTour } from "@/features/onboarding/PostCallTour";
import type { Call } from "@/core/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const ctx = await getClinicContext();

  // Get today's start (UTC)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // Get this week's start (Monday)
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  weekStart.setHours(0, 0, 0, 0);

  // Fetch KPI data in parallel
  const [callsResult, appointmentsResult, patientsResult, recentCallsResult, pendingBookingsResult] =
    await Promise.all([
      supabase
        .from("calls")
        .select("id, duration_seconds", { count: "exact" })
        .gte("created_at", todayStart.toISOString()),

      supabase
        .from("appointments")
        .select("id", { count: "exact" })
        .gte("start_time", weekStart.toISOString()),

      supabase.from("patients").select("id", { count: "exact" }),

      supabase
        .from("calls")
        .select(
          "id, caller_phone, call_type, status, ai_summary, call_outcome, duration_seconds, created_at, patient_id"
        )
        .order("created_at", { ascending: false })
        .limit(8),

      supabase
        .from("booking_requests")
        .select("id", { count: "exact" })
        .eq("status", "new"),
    ]);

  const callsToday = callsResult.count ?? 0;
  const appointmentsThisWeek = appointmentsResult.count ?? 0;
  const totalPatients = patientsResult.count ?? 0;
  const pendingBookings = pendingBookingsResult.count ?? 0;

  const callDurations = (callsResult.data ?? [])
    .map((c) => c.duration_seconds ?? 0)
    .filter((d) => d > 0);
  const avgDuration =
    callDurations.length > 0
      ? Math.round(
          callDurations.reduce((a, b) => a + b, 0) / callDurations.length
        )
      : 0;

  const recentCalls = (recentCallsResult.data ?? []) as Call[];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold font-heading text-neutral-800">
          Overview
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Today&apos;s performance at a glance
        </p>
      </div>

      {/* Talk to Sarah — voice agent card */}
      <DashboardVoiceWidget clinicId={ctx?.clinicId} />

      <LiveDashboard
        initialKPIs={{
          callsToday,
          appointmentsThisWeek,
          totalPatients,
          avgDuration,
          pendingBookings,
        }}
        initialRecentCalls={recentCalls}
      />

      {/* Guided tour for demo users */}
      <Suspense fallback={null}>
        <DemoTour />
      </Suspense>
      <PostCallTour />
    </div>
  );
}

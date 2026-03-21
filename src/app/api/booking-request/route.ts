import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/**
 * POST /api/booking-request
 *
 * Called by the Python voice agent when a call is classified as "booking_requested".
 * Uses the Supabase service role key (server-to-server, no user auth).
 */
export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Supabase service role not configured" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const { callId, clinicId, patientName, callerPhone, reasonForVisit, preferredDate, preferredTime } = body;

  if (!callId || !clinicId) {
    return NextResponse.json(
      { error: "callId and clinicId are required" },
      { status: 400 }
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data, error } = await supabase
    .from("booking_requests")
    .insert({
      call_id: callId,
      clinic_id: clinicId,
      patient_name: patientName ?? null,
      caller_phone: callerPhone ?? null,
      reason_for_visit: reasonForVisit ?? null,
      preferred_date: preferredDate ?? null,
      preferred_time: preferredTime ?? null,
      status: "new",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create booking request:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}

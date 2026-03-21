import { createClient } from "@/lib/supabase/server";
import { AppointmentsList, type AppointmentRow } from "./AppointmentsList";

export default async function AppointmentsPage() {
  const supabase = await createClient();

  // Fetch appointments with patient + provider names
  const { data: rawAppointments } = await supabase
    .from("appointments")
    .select(
      `id, patient_id, provider_ref, start_time, end_time, status, appointment_type, reason, notes, created_at,
       patients!inner(first_name, last_name, phone),
       providers:provider_ref(first_name, last_name, title)`
    )
    .order("start_time", { ascending: true });

  // Normalize joined data (Supabase returns arrays for joins with hand-written types)
  const appointments: AppointmentRow[] = (rawAppointments ?? []).map((row) => ({
    id: row.id,
    patient_id: row.patient_id,
    provider_ref: row.provider_ref,
    start_time: row.start_time,
    end_time: row.end_time,
    status: row.status,
    appointment_type: row.appointment_type,
    reason: row.reason,
    notes: row.notes,
    created_at: row.created_at,
    patients: Array.isArray(row.patients) ? row.patients[0] : row.patients,
    providers: Array.isArray(row.providers) ? row.providers[0] ?? null : row.providers,
  }));

  return <AppointmentsList appointments={appointments} />;
}

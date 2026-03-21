import { createClient } from "@/lib/supabase/server";
import { PatientDirectory } from "./PatientDirectory";

export default async function PatientsPage() {
  const supabase = await createClient();

  const { data: patients } = await supabase
    .from("patients")
    .select("id, first_name, last_name, phone, email, date_of_birth, insurance_provider, created_at")
    .order("last_name", { ascending: true });

  return <PatientDirectory patients={patients ?? []} />;
}

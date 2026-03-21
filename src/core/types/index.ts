// Convenience re-exports for database types
// Usage: import { Clinic, Patient, Call } from "@/core/types"

export type { Database, Json } from "./database.types";

import type { Database } from "./database.types";

// Row types (what you get back from SELECT queries)
export type Clinic = Database["public"]["Tables"]["clinics"]["Row"];
export type ClinicMember = Database["public"]["Tables"]["clinic_members"]["Row"];
export type Patient = Database["public"]["Tables"]["patients"]["Row"];
export type Appointment = Database["public"]["Tables"]["appointments"]["Row"];
export type Call = Database["public"]["Tables"]["calls"]["Row"];
export type Campaign = Database["public"]["Tables"]["campaigns"]["Row"];
export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type BookingRequest = Database["public"]["Tables"]["booking_requests"]["Row"];
export type Provider = Database["public"]["Tables"]["providers"]["Row"];
export type ProviderAvailability = Database["public"]["Tables"]["provider_availability"]["Row"];

// Insert types (what you pass to INSERT queries)
export type ClinicInsert = Database["public"]["Tables"]["clinics"]["Insert"];
export type ClinicMemberInsert = Database["public"]["Tables"]["clinic_members"]["Insert"];
export type PatientInsert = Database["public"]["Tables"]["patients"]["Insert"];
export type AppointmentInsert = Database["public"]["Tables"]["appointments"]["Insert"];
export type CallInsert = Database["public"]["Tables"]["calls"]["Insert"];
export type CampaignInsert = Database["public"]["Tables"]["campaigns"]["Insert"];
export type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];
export type BookingRequestInsert = Database["public"]["Tables"]["booking_requests"]["Insert"];
export type ProviderInsert = Database["public"]["Tables"]["providers"]["Insert"];
export type ProviderAvailabilityInsert = Database["public"]["Tables"]["provider_availability"]["Insert"];

// Update types (what you pass to UPDATE queries)
export type ClinicUpdate = Database["public"]["Tables"]["clinics"]["Update"];
export type PatientUpdate = Database["public"]["Tables"]["patients"]["Update"];
export type AppointmentUpdate = Database["public"]["Tables"]["appointments"]["Update"];
export type CallUpdate = Database["public"]["Tables"]["calls"]["Update"];
export type CampaignUpdate = Database["public"]["Tables"]["campaigns"]["Update"];
export type LeadUpdate = Database["public"]["Tables"]["leads"]["Update"];
export type BookingRequestUpdate = Database["public"]["Tables"]["booking_requests"]["Update"];
export type ProviderUpdate = Database["public"]["Tables"]["providers"]["Update"];
export type ProviderAvailabilityUpdate = Database["public"]["Tables"]["provider_availability"]["Update"];

// Enum types
export type ClinicRole = Database["public"]["Enums"]["clinic_role"];
export type AppointmentStatus = Database["public"]["Enums"]["appointment_status"];
export type CallType = Database["public"]["Enums"]["call_type"];
export type CallStatus = Database["public"]["Enums"]["call_status"];
export type CampaignType = Database["public"]["Enums"]["campaign_type"];
export type CampaignStatus = Database["public"]["Enums"]["campaign_status"];
export type BookingRequestStatus = Database["public"]["Enums"]["booking_request_status"];

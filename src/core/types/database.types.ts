// database.types.ts
// Hand-written to match the schema in supabase/migrations/00001_initial_schema.sql
// Replace with auto-generated types via `bun run db:gen-types` once Supabase is running locally

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      clinics: {
        Row: {
          id: string;
          name: string;
          owner_id: string;
          subscription_tier: "free" | "starter" | "growth" | "enterprise" | "demo";
          phone: string | null;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          owner_id: string;
          subscription_tier?: "free" | "starter" | "growth" | "enterprise" | "demo";
          phone?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          owner_id?: string;
          subscription_tier?: "free" | "starter" | "growth" | "enterprise" | "demo";
          phone?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      clinic_members: {
        Row: {
          id: string;
          clinic_id: string;
          user_id: string;
          role: "owner" | "admin" | "dentist" | "hygienist" | "receptionist" | "staff";
          created_at: string;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          user_id: string;
          role?: "owner" | "admin" | "dentist" | "hygienist" | "receptionist" | "staff";
          created_at?: string;
        };
        Update: {
          id?: string;
          clinic_id?: string;
          user_id?: string;
          role?: "owner" | "admin" | "dentist" | "hygienist" | "receptionist" | "staff";
          created_at?: string;
        };
      };
      patients: {
        Row: {
          id: string;
          clinic_id: string;
          first_name: string;
          last_name: string;
          email: string | null;
          phone: string;
          date_of_birth: string | null;
          insurance_provider: string | null;
          insurance_member_id: string | null;
          insurance_group_number: string | null;
          status: "active" | "inactive" | "archived";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          first_name: string;
          last_name: string;
          email?: string | null;
          phone: string;
          date_of_birth?: string | null;
          insurance_provider?: string | null;
          insurance_member_id?: string | null;
          insurance_group_number?: string | null;
          status?: "active" | "inactive" | "archived";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clinic_id?: string;
          first_name?: string;
          last_name?: string;
          email?: string | null;
          phone?: string;
          date_of_birth?: string | null;
          insurance_provider?: string | null;
          insurance_member_id?: string | null;
          insurance_group_number?: string | null;
          status?: "active" | "inactive" | "archived";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          clinic_id: string;
          patient_id: string;
          provider_id: string | null;
          provider_ref: string | null;
          start_time: string;
          end_time: string;
          status: "scheduled" | "confirmed" | "completed" | "no_show" | "cancelled";
          appointment_type: string;
          reason: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          patient_id: string;
          provider_id?: string | null;
          provider_ref?: string | null;
          start_time: string;
          end_time: string;
          status?: "scheduled" | "confirmed" | "completed" | "no_show" | "cancelled";
          appointment_type: string;
          reason?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          clinic_id?: string;
          patient_id?: string;
          provider_id?: string | null;
          provider_ref?: string | null;
          start_time?: string;
          end_time?: string;
          status?: "scheduled" | "confirmed" | "completed" | "no_show" | "cancelled";
          appointment_type?: string;
          reason?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      calls: {
        Row: {
          id: string;
          clinic_id: string;
          patient_id: string | null;
          caller_phone: string | null;
          call_type: "inbound" | "outbound";
          status: "pending" | "ringing" | "in_progress" | "completed" | "failed" | "missed";
          start_time: string | null;
          end_time: string | null;
          duration_seconds: number | null;
          transcript: Json | null;
          ai_summary: string | null;
          call_outcome: string | null;
          appointment_booked_id: string | null;
          payment_collected: number | null;
          livekit_room_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          patient_id?: string | null;
          caller_phone?: string | null;
          call_type: "inbound" | "outbound";
          status?: "pending" | "ringing" | "in_progress" | "completed" | "failed" | "missed";
          start_time?: string | null;
          end_time?: string | null;
          duration_seconds?: number | null;
          transcript?: Json | null;
          ai_summary?: string | null;
          call_outcome?: string | null;
          appointment_booked_id?: string | null;
          payment_collected?: number | null;
          livekit_room_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          clinic_id?: string;
          patient_id?: string | null;
          caller_phone?: string | null;
          call_type?: "inbound" | "outbound";
          status?: "pending" | "ringing" | "in_progress" | "completed" | "failed" | "missed";
          start_time?: string | null;
          end_time?: string | null;
          duration_seconds?: number | null;
          transcript?: Json | null;
          ai_summary?: string | null;
          call_outcome?: string | null;
          appointment_booked_id?: string | null;
          payment_collected?: number | null;
          livekit_room_name?: string | null;
          created_at?: string;
        };
      };
      campaigns: {
        Row: {
          id: string;
          clinic_id: string;
          name: string;
          campaign_type: "recall" | "debt_collection" | "followup" | "lead_response";
          status: "draft" | "active" | "paused" | "completed" | "archived";
          target_patient_count: number;
          completed_call_count: number;
          ai_script: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          name: string;
          campaign_type: "recall" | "debt_collection" | "followup" | "lead_response";
          status?: "draft" | "active" | "paused" | "completed" | "archived";
          target_patient_count?: number;
          completed_call_count?: number;
          ai_script?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clinic_id?: string;
          name?: string;
          campaign_type?: "recall" | "debt_collection" | "followup" | "lead_response";
          status?: "draft" | "active" | "paused" | "completed" | "archived";
          target_patient_count?: number;
          completed_call_count?: number;
          ai_script?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          clinic_id: string;
          first_name: string | null;
          last_name: string | null;
          phone: string;
          email: string | null;
          source: "phone" | "web" | "referral" | "campaign" | "demo_signup";
          status: "new" | "contacted" | "converted" | "lost";
          call_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          first_name?: string | null;
          last_name?: string | null;
          phone: string;
          email?: string | null;
          source?: "phone" | "web" | "referral" | "campaign" | "demo_signup";
          status?: "new" | "contacted" | "converted" | "lost";
          call_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clinic_id?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string;
          email?: string | null;
          source?: "phone" | "web" | "referral" | "campaign" | "demo_signup";
          status?: "new" | "contacted" | "converted" | "lost";
          call_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      providers: {
        Row: {
          id: string;
          clinic_id: string;
          user_id: string | null;
          first_name: string;
          last_name: string;
          title: string;
          specialty: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          user_id?: string | null;
          first_name: string;
          last_name: string;
          title?: string;
          specialty?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clinic_id?: string;
          user_id?: string | null;
          first_name?: string;
          last_name?: string;
          title?: string;
          specialty?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      provider_availability: {
        Row: {
          id: string;
          clinic_id: string;
          provider_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          slot_duration_minutes: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          provider_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          slot_duration_minutes?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          clinic_id?: string;
          provider_id?: string;
          day_of_week?: number;
          start_time?: string;
          end_time?: string;
          slot_duration_minutes?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      booking_requests: {
        Row: {
          id: string;
          clinic_id: string;
          call_id: string;
          patient_name: string | null;
          caller_phone: string | null;
          reason_for_visit: string | null;
          preferred_date: string | null;
          preferred_time: string | null;
          notes: string | null;
          status: "new" | "confirmed" | "rejected";
          resolved_at: string | null;
          resolved_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          call_id: string;
          patient_name?: string | null;
          caller_phone?: string | null;
          reason_for_visit?: string | null;
          preferred_date?: string | null;
          preferred_time?: string | null;
          notes?: string | null;
          status?: "new" | "confirmed" | "rejected";
          resolved_at?: string | null;
          resolved_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clinic_id?: string;
          call_id?: string;
          patient_name?: string | null;
          caller_phone?: string | null;
          reason_for_visit?: string | null;
          preferred_date?: string | null;
          preferred_time?: string | null;
          notes?: string | null;
          status?: "new" | "confirmed" | "rejected";
          resolved_at?: string | null;
          resolved_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Enums: {
      clinic_role: "owner" | "admin" | "dentist" | "hygienist" | "receptionist" | "staff";
      appointment_status: "scheduled" | "confirmed" | "completed" | "no_show" | "cancelled";
      call_type: "inbound" | "outbound";
      call_status: "pending" | "ringing" | "in_progress" | "completed" | "failed" | "missed";
      campaign_type: "recall" | "debt_collection" | "followup" | "lead_response";
      campaign_status: "draft" | "active" | "paused" | "completed" | "archived";
      booking_request_status: "new" | "confirmed" | "rejected";
    };
  };
};

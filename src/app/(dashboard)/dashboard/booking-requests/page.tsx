import { createClient } from "@/lib/supabase/server";
import { BookingRequestsList } from "@/features/booking-requests";
import type { BookingRequest } from "@/core/types";

export default async function BookingRequestsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("booking_requests")
    .select("*")
    .order("created_at", { ascending: false });

  const requests = (data ?? []) as BookingRequest[];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold font-heading text-neutral-800">
          Booking Requests
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Review and manage appointment requests from voice calls
        </p>
      </div>

      <BookingRequestsList initialRequests={requests} />
    </div>
  );
}

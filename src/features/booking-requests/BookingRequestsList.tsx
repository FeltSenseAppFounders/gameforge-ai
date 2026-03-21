"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { BookingRequest } from "@/core/types";
import { useRealtimeBookingRequests } from "./useRealtimeBookingRequests";

// ─── Status config ────────────────────────────────────────

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: "New", className: "bg-warning/10 text-warning" },
  confirmed: { label: "Confirmed", className: "bg-success/10 text-success" },
  rejected: { label: "Rejected", className: "bg-error/10 text-error" },
};

type FilterTab = "new" | "confirmed" | "rejected" | "all";

// ─── Helpers ──────────────────────────────────────────────

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

// ─── Detail Modal ─────────────────────────────────────────

function BookingRequestModal({
  request,
  onClose,
  onConfirm,
  onReject,
}: {
  request: BookingRequest;
  onClose: () => void;
  onConfirm: () => void;
  onReject: () => void;
}) {
  const sc = statusConfig[request.status] ?? statusConfig.new;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl w-full max-w-[520px] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-0 gap-4">
          <div>
            <h2 className="text-xl font-semibold font-heading text-neutral-800">
              Booking Request
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              {request.patient_name ?? "Unknown patient"}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 p-1.5 rounded-md transition-colors shrink-0"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Details */}
        <div className="flex flex-wrap gap-x-6 gap-y-3 px-6 py-4 border-b border-neutral-200">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block">
              Status
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-[11px] font-semibold uppercase tracking-wider ${sc.className}`}>
              {sc.label}
            </span>
          </div>
          {request.caller_phone && (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block">
                Phone
              </span>
              <span className="text-sm font-medium text-neutral-700">
                {request.caller_phone}
              </span>
            </div>
          )}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block">
              Received
            </span>
            <span className="text-sm font-medium text-neutral-700">
              {timeAgo(request.created_at)}
            </span>
          </div>
        </div>

        {/* Reason */}
        {request.reason_for_visit && (
          <div className="mx-6 mt-4 px-4 py-3 bg-neutral-100 border-l-4 border-l-primary rounded-r-md">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 block mb-1">
              Reason for Visit
            </span>
            <p className="text-sm text-neutral-700">{request.reason_for_visit}</p>
          </div>
        )}

        {/* Preferred schedule */}
        {(request.preferred_date || request.preferred_time) && (
          <div className="mx-6 mt-3 px-4 py-3 bg-neutral-100 border-l-4 border-l-secondary rounded-r-md">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 block mb-1">
              Preferred Schedule
            </span>
            <p className="text-sm text-neutral-700">
              {[request.preferred_date, request.preferred_time]
                .filter(Boolean)
                .join(" at ")}
            </p>
          </div>
        )}

        {/* Notes */}
        {request.notes && (
          <div className="mx-6 mt-3 px-4 py-3 bg-neutral-100 border-l-4 border-l-accent rounded-r-md">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 block mb-1">
              Notes
            </span>
            <p className="text-sm text-neutral-700">{request.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 px-6 py-4 mt-2 border-t border-neutral-200">
          {request.status === "new" ? (
            <>
              <button
                onClick={onReject}
                className="border border-neutral-300 text-neutral-700 hover:bg-neutral-100 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors min-h-[44px]"
              >
                Reject
              </button>
              <button
                onClick={onConfirm}
                className="bg-primary hover:bg-primary-dark text-white rounded-md px-4 py-2.5 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 min-h-[44px]"
              >
                Confirm Booking
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="border border-neutral-300 text-neutral-700 hover:bg-neutral-100 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors min-h-[44px]"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────

export function BookingRequestsList({
  initialRequests,
}: {
  initialRequests: BookingRequest[];
}) {
  const requests = useRealtimeBookingRequests(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("new");

  const filtered =
    activeTab === "all"
      ? requests
      : requests.filter((r) => r.status === activeTab);

  const newCount = requests.filter((r) => r.status === "new").length;
  const confirmedCount = requests.filter((r) => r.status === "confirmed").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "new", label: "New", count: newCount },
    { key: "confirmed", label: "Confirmed", count: confirmedCount },
    { key: "rejected", label: "Rejected", count: rejectedCount },
    { key: "all", label: "All", count: requests.length },
  ];

  async function handleConfirm(id: string) {
    const supabase = createClient();
    await supabase
      .from("booking_requests")
      .update({ status: "confirmed", resolved_at: new Date().toISOString() })
      .eq("id", id);
    setSelectedRequest(null);
  }

  async function handleReject(id: string) {
    const supabase = createClient();
    await supabase
      .from("booking_requests")
      .update({ status: "rejected", resolved_at: new Date().toISOString() })
      .eq("id", id);
    setSelectedRequest(null);
  }

  return (
    <>
      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 bg-neutral-100 rounded-md p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-150 ${
              activeTab === tab.key
                ? "bg-white text-neutral-800 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-1.5 text-xs ${
                activeTab === tab.key ? "text-primary" : "text-neutral-400"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg border border-neutral-200 p-12 text-center">
          <svg
            width="40"
            height="40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            className="mx-auto text-neutral-300 mb-3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-neutral-400">
            {activeTab === "new"
              ? "No new booking requests."
              : `No ${activeTab} requests.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((request) => {
            const sc = statusConfig[request.status] ?? statusConfig.new;
            return (
              <div
                key={request.id}
                onClick={() => setSelectedRequest(request)}
                className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-secondary shadow-sm p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-neutral-800 truncate">
                      {request.patient_name ?? "Unknown Patient"}
                    </h3>
                    {request.caller_phone && (
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {request.caller_phone}
                      </p>
                    )}
                  </div>
                  <span className={`shrink-0 ml-2 inline-flex items-center px-2.5 py-0.5 rounded-sm text-[11px] font-semibold uppercase tracking-wider ${sc.className}`}>
                    {sc.label}
                  </span>
                </div>

                {request.reason_for_visit && (
                  <p className="text-sm text-neutral-600 mb-3 truncate">
                    {request.reason_for_visit}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>
                    {[request.preferred_date, request.preferred_time]
                      .filter(Boolean)
                      .join(" at ") || "No preference"}
                  </span>
                  <span>{timeAgo(request.created_at)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail modal */}
      {selectedRequest && (
        <BookingRequestModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onConfirm={() => handleConfirm(selectedRequest.id)}
          onReject={() => handleReject(selectedRequest.id)}
        />
      )}
    </>
  );
}

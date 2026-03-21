"use client";

import { useState, useMemo } from "react";
import { CalendarWeekView } from "./CalendarWeekView";

// Types for the joined query result
export interface AppointmentRow {
  id: string;
  patient_id: string;
  provider_ref: string | null;
  start_time: string;
  end_time: string;
  status: "scheduled" | "confirmed" | "completed" | "no_show" | "cancelled";
  appointment_type: string;
  reason: string | null;
  notes: string | null;
  created_at: string;
  patients: { first_name: string; last_name: string; phone: string | null };
  providers: { first_name: string; last_name: string; title: string | null } | null;
}

// ─── Status badge config ──────────────────────────────────────
const statusConfig: Record<string, { classes: string; label: string }> = {
  scheduled: { classes: "bg-info/10 text-info", label: "Scheduled" },
  confirmed: { classes: "bg-primary/10 text-primary", label: "Confirmed" },
  completed: { classes: "bg-success/10 text-success", label: "Completed" },
  no_show: { classes: "bg-warning/10 text-warning", label: "No Show" },
  cancelled: { classes: "bg-error/10 text-error", label: "Cancelled" },
};

// ─── Type badge colors (Tailwind) ─────────────────────────────
const typeColorMap: Record<string, string> = {
  cleaning: "bg-accent/10 text-accent",
  checkup: "bg-secondary/10 text-secondary",
  "root canal": "bg-error/10 text-error",
  consultation: "bg-success/10 text-success",
  "x-ray": "bg-warning/10 text-warning",
  fillings: "bg-primary-light/10 text-primary-light",
  "crown fitting": "bg-warning/10 text-warning",
  extraction: "bg-error/10 text-error",
  emergency: "bg-error/10 text-error",
  exam: "bg-secondary/10 text-secondary",
};

function getTypeBadgeClasses(type: string): string {
  return typeColorMap[type.toLowerCase()] ?? "bg-neutral-100 text-neutral-600";
}

// ─── Helpers ──────────────────────────────────────────────────
function formatTime(isoStr: string): string {
  const d = new Date(isoStr);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatDate(isoStr: string): string {
  const d = new Date(isoStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDateFull(isoStr: string): string {
  const d = new Date(isoStr);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function getProviderName(row: AppointmentRow): string {
  if (row.providers) {
    const { title, first_name, last_name } = row.providers;
    return title ? `${title} ${first_name} ${last_name}` : `${first_name} ${last_name}`;
  }
  return "—";
}

function getPatientName(row: AppointmentRow): string {
  return `${row.patients.first_name} ${row.patients.last_name}`;
}

// ─── Filter & View ──────────────────────────────────────────────
type FilterStatus = "all" | "upcoming" | "completed" | "cancelled";
type ViewMode = "list" | "calendar";

// ─── Component ────────────────────────────────────────────────
export function AppointmentsList({ appointments }: { appointments: AppointmentRow[] }) {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("calendar");

  const filtered = useMemo(() => {
    let list = appointments;

    // Status filter
    if (filter === "upcoming") {
      list = list.filter((a) => a.status === "scheduled" || a.status === "confirmed");
    } else if (filter === "completed") {
      list = list.filter((a) => a.status === "completed");
    } else if (filter === "cancelled") {
      list = list.filter((a) => a.status === "cancelled" || a.status === "no_show");
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          getPatientName(a).toLowerCase().includes(q) ||
          a.appointment_type.toLowerCase().includes(q) ||
          getProviderName(a).toLowerCase().includes(q)
      );
    }

    return list;
  }, [appointments, filter, search]);

  const filterButtons: { key: FilterStatus; label: string }[] = [
    { key: "all", label: "All" },
    { key: "upcoming", label: "Upcoming" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold font-heading text-neutral-800">
          Appointments
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          {appointments.length} total appointments
        </p>
      </div>

      {/* Toolbar: filters + search */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        {/* Filter pills */}
        <div className="flex items-center gap-1 bg-neutral-100 rounded-md p-1">
          {filterButtons.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-sm text-sm font-semibold transition-all duration-150
                ${
                  filter === key
                    ? "bg-white text-primary shadow-xs"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-1 bg-neutral-100 rounded-md p-1">
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-sm transition-all duration-150
                ${view === "list" ? "bg-white text-primary shadow-xs" : "text-neutral-500 hover:text-neutral-700"}`}
              aria-label="List view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`p-2 rounded-sm transition-all duration-150
                ${view === "calendar" ? "bg-white text-primary shadow-xs" : "text-neutral-500 hover:text-neutral-700"}`}
              aria-label="Calendar view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search appointments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 bg-white border border-neutral-300 rounded-md pl-9 pr-3.5 py-2.5 text-sm text-neutral-700
                placeholder:text-neutral-400 focus:border-primary focus:ring-2 focus:ring-primary/35 focus:outline-none
                transition-colors duration-150"
            />
          </div>
        </div>
      </div>

      {/* Content: List or Calendar */}
      {view === "list" ? (
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-neutral-400">No appointments found.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="text-left text-sm font-semibold text-neutral-600 px-4 py-3">Patient</th>
                  <th className="text-left text-sm font-semibold text-neutral-600 px-4 py-3">Type</th>
                  <th className="text-left text-sm font-semibold text-neutral-600 px-4 py-3">Date & Time</th>
                  <th className="text-left text-sm font-semibold text-neutral-600 px-4 py-3">Provider</th>
                  <th className="text-left text-sm font-semibold text-neutral-600 px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((appt) => {
                  const statusBadge = statusConfig[appt.status] ?? statusConfig.scheduled;
                  return (
                    <tr
                      key={appt.id}
                      className="border-b border-neutral-200 hover:bg-neutral-100 transition-colors duration-100"
                    >
                      {/* Patient */}
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-neutral-700">{getPatientName(appt)}</p>
                        {appt.patients.phone && (
                          <p className="text-xs text-neutral-400 mt-0.5">{appt.patients.phone}</p>
                        )}
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-[11px] font-semibold uppercase tracking-wider ${getTypeBadgeClasses(appt.appointment_type)}`}
                        >
                          {appt.appointment_type}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="px-4 py-3">
                        <p className="text-sm text-neutral-700">{formatTime(appt.start_time)}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">{formatDateFull(appt.start_time)}</p>
                      </td>

                      {/* Provider */}
                      <td className="px-4 py-3 text-sm text-neutral-700">
                        {getProviderName(appt)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-[11px] font-semibold uppercase tracking-wider ${statusBadge.classes}`}
                        >
                          {statusBadge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <CalendarWeekView appointments={filtered} />
      )}
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import type { Call } from "@/core/types";
import type { Json } from "@/core/types";
import { useRealtimeCalls } from "./useRealtimeCalls";

type SortKey = "caller_phone" | "created_at" | "duration_seconds" | "status" | "call_outcome";
type SortDir = "asc" | "desc";

interface TranscriptTurn {
  role: string;
  content: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  completed: { label: "Completed", className: "bg-success/10 text-success" },
  in_progress: { label: "In Progress", className: "bg-primary/10 text-primary" },
  failed: { label: "Failed", className: "bg-error/10 text-error" },
  missed: { label: "Missed", className: "bg-warning/10 text-warning" },
  pending: { label: "Pending", className: "bg-neutral-100 text-neutral-500" },
  ringing: { label: "Ringing", className: "bg-accent/10 text-accent" },
};

function formatDuration(seconds: number | null): string {
  if (!seconds || seconds === 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function parseTranscript(transcript: Json | null): TranscriptTurn[] {
  if (!transcript || !Array.isArray(transcript)) return [];
  return transcript as unknown as TranscriptTurn[];
}

function CallDetailModal({
  call,
  onClose,
}: {
  call: Call;
  onClose: () => void;
}) {
  const sc = statusConfig[call.status] ?? statusConfig.pending;
  const transcript = parseTranscript(call.transcript);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl w-full max-w-[720px] max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-0 gap-4">
          <div>
            <h2 className="text-xl font-semibold font-heading text-neutral-800">
              {call.call_type === "inbound" ? "Inbound Call" : "Outbound Call"}
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              {call.caller_phone ?? "Unknown caller"}
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

        {/* Metadata */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 px-6 py-4 border-b border-neutral-200">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block">Time</span>
            <span className="text-sm font-medium text-neutral-700">{formatTime(call.created_at)}</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block">Duration</span>
            <span className="text-sm font-medium text-neutral-700">{formatDuration(call.duration_seconds)}</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block">Status</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-[11px] font-semibold uppercase tracking-wider ${sc.className}`}>
              {sc.label}
            </span>
          </div>
        </div>

        {/* AI Summary */}
        {call.ai_summary && (
          <div className="mx-6 mt-4 px-4 py-3 bg-neutral-100 border-l-4 border-l-primary rounded-r-md">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 block mb-1">
              AI Summary
            </span>
            <p className="text-sm text-neutral-700">{call.ai_summary}</p>
          </div>
        )}

        {/* Outcome */}
        {call.call_outcome && (
          <div className="mx-6 mt-3 px-4 py-3 bg-neutral-100 border-l-4 border-l-secondary rounded-r-md">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 block mb-1">
              Outcome
            </span>
            <p className="text-sm text-neutral-700">{call.call_outcome}</p>
          </div>
        )}

        {/* Transcript */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-3">
            Transcript
          </p>
          {transcript.length === 0 ? (
            <p className="text-sm text-neutral-400">No transcript available.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {transcript.map((turn, i) => {
                const isAgent = turn.role === "assistant" || turn.role === "AI";
                return (
                  <div
                    key={i}
                    className={`flex ${isAgent ? "flex-row" : "flex-row-reverse"} items-start gap-2`}
                  >
                    <div
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold ${
                        isAgent
                          ? "bg-primary text-white"
                          : "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {isAgent ? "AI" : "PT"}
                    </div>
                    <div className="max-w-[75%]">
                      <span
                        className={`text-[11px] font-semibold text-neutral-500 block mb-1 ${
                          isAgent ? "text-left" : "text-right"
                        }`}
                      >
                        {isAgent ? "AI Assistant" : "Patient"}
                      </span>
                      <div
                        className={`px-3.5 py-2.5 rounded-lg text-sm leading-relaxed ${
                          isAgent
                            ? "bg-neutral-100 text-neutral-700 rounded-tl-sm"
                            : "bg-primary text-white rounded-tr-sm"
                        }`}
                      >
                        {turn.content}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const columns: { key: SortKey; label: string }[] = [
  { key: "caller_phone", label: "Caller" },
  { key: "created_at", label: "Time" },
  { key: "duration_seconds", label: "Duration" },
  { key: "status", label: "Status" },
  { key: "call_outcome", label: "Outcome" },
];

export function CallsTable({ calls: initialCalls }: { calls: Call[] }) {
  const calls = useRealtimeCalls(initialCalls);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return calls;
    return calls.filter(
      (c) =>
        c.caller_phone?.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q) ||
        c.ai_summary?.toLowerCase().includes(q) ||
        c.call_outcome?.toLowerCase().includes(q)
    );
  }, [calls, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av: string | number;
      let bv: string | number;

      if (sortKey === "created_at") {
        av = new Date(a.created_at).getTime();
        bv = new Date(b.created_at).getTime();
      } else if (sortKey === "duration_seconds") {
        av = a.duration_seconds ?? 0;
        bv = b.duration_seconds ?? 0;
      } else {
        av = (a[sortKey] ?? "").toLowerCase();
        bv = (b[sortKey] ?? "").toLowerCase();
      }

      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  return (
    <>
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by phone, status, or outcome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs bg-white border border-neutral-300 rounded-md px-3.5 py-2.5 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-primary focus:ring-2 focus:ring-primary/35 focus:outline-none transition-colors duration-150"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="text-left text-sm font-semibold text-neutral-600 px-4 py-3 cursor-pointer select-none whitespace-nowrap hover:text-neutral-800 transition-colors"
                  >
                    {col.label}
                    <span className="ml-1 text-xs">
                      {sortKey === col.key ? (
                        <span className="text-primary">
                          {sortDir === "asc" ? "↑" : "↓"}
                        </span>
                      ) : (
                        <span className="text-neutral-300">⇅</span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-sm text-neutral-400"
                  >
                    {calls.length === 0
                      ? "No calls recorded yet."
                      : "No calls match your search."}
                  </td>
                </tr>
              ) : (
                sorted.map((call) => {
                  const sc =
                    statusConfig[call.status] ?? statusConfig.pending;
                  return (
                    <tr
                      key={call.id}
                      onClick={() => setSelectedCall(call)}
                      className="border-b border-neutral-200 hover:bg-neutral-100 transition-colors duration-100 cursor-pointer"
                    >
                      <td className="px-4 py-3 text-sm font-semibold text-neutral-700">
                        {call.caller_phone ?? "Unknown"}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-700 whitespace-nowrap">
                        {formatTime(call.created_at)}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-700 text-right tabular-nums">
                        {formatDuration(call.duration_seconds)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-[11px] font-semibold uppercase tracking-wider ${sc.className}`}
                        >
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500 max-w-[200px] truncate">
                        {call.call_outcome ?? call.ai_summary ?? "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-neutral-200 text-xs text-neutral-400">
          {sorted.length} of {calls.length} calls
        </div>
      </div>

      {selectedCall && (
        <CallDetailModal
          call={selectedCall}
          onClose={() => setSelectedCall(null)}
        />
      )}
    </>
  );
}

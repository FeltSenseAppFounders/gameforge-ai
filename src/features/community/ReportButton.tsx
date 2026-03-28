"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

const REASONS = [
  "Inappropriate content",
  "Offensive language",
  "Phishing / scam",
  "Copyright violation",
] as const;

interface ReportButtonProps {
  gameId: string;
}

export function ReportButton({ gameId }: ReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reported, setReported] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReport = useCallback(
    async (reason: string) => {
      if (loading || reported) return;
      setLoading(true);

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          window.location.href = "/try-it-now";
          return;
        }

        const { error } = await supabase.from("game_reports").insert({
          game_project_id: gameId,
          reporter_id: user.id,
          reason,
        });

        if (error) {
          if (error.code === "23505") {
            // Already reported (unique constraint)
            setReported(true);
          }
          return;
        }

        setReported(true);
      } finally {
        setLoading(false);
        setIsOpen(false);
      }
    },
    [gameId, loading, reported]
  );

  if (reported) {
    return (
      <span className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 px-3 py-1.5">
        <svg
          width="14"
          height="14"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
        REPORTED
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-error px-3 py-1.5 rounded border border-neutral-700/50 hover:border-error/40 transition-colors"
        title="Report game"
      >
        <svg
          width="14"
          height="14"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2z"
          />
        </svg>
        <span className="hidden sm:inline">REPORT</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-1 w-52 bg-surface-dark border border-neutral-700 rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="px-3 py-2 border-b border-neutral-700">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Report reason
              </p>
            </div>
            {REASONS.map((reason) => (
              <button
                key={reason}
                onClick={() => handleReport(reason)}
                disabled={loading}
                className="w-full text-left px-3 py-2.5 text-xs text-neutral-300 hover:bg-surface hover:text-error transition-colors disabled:opacity-50"
              >
                {reason}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

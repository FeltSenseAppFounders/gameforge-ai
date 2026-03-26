"use client";

import { useCredits } from "./CreditsProvider";

export function CreditBadge() {
  const { balance, isLoading, openPurchaseModal } = useCredits();

  return (
    <button
      onClick={openPurchaseModal}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-neutral-700 bg-surface-light hover:bg-neutral-800 transition-colors"
      title="AI generation credits"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="text-primary-light"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
      <span className="text-xs font-bold font-mono text-neutral-200">
        {isLoading ? "..." : balance}
      </span>
    </button>
  );
}

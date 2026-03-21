"use client";

export function ReplayTourButton() {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new CustomEvent("feltsense:replay-tour"));
      }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-neutral-500 hover:text-primary hover:bg-primary/5 transition-colors duration-150"
      aria-label="Replay guided tour"
      title="Replay tour"
    >
      <svg
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
        />
      </svg>
      Tour
    </button>
  );
}

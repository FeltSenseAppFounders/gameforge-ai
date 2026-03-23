"use client";

import { useMobileSidebar } from "./MobileSidebarProvider";

export function MobileSidebarTrigger() {
  const { setOpen } = useMobileSidebar();

  return (
    <button
      onClick={() => setOpen(true)}
      className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2 text-neutral-400 hover:text-neutral-200 transition-colors"
      aria-label="Open navigation"
    >
      <svg
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
}

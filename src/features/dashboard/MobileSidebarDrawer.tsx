"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMobileSidebar } from "./MobileSidebarProvider";

const navItems = [
  {
    label: "OVERVIEW",
    href: "/dashboard",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "CREATE GAME",
    href: "/dashboard/create",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    label: "MY GAMES",
    href: "/dashboard/games",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <line x1="6" y1="11" x2="10" y2="11" />
        <line x1="8" y1="9" x2="8" y2="13" />
        <line x1="15" y1="12" x2="15.01" y2="12" />
        <line x1="18" y1="10" x2="18.01" y2="10" />
        <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
      </svg>
    ),
  },
  {
    label: "COMMUNITY",
    href: "/dashboard/community",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export function MobileSidebarDrawer() {
  const { open, close } = useMobileSidebar();
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape key handling
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, close]);

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside className="absolute inset-y-0 left-0 w-72 bg-surface border-r border-neutral-700 flex flex-col animate-in slide-in-from-left duration-200">
        {/* Header: Logo + Close */}
        <div className="px-6 py-6 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-1" onClick={close}>
            <span className="text-lg font-heading text-primary-light uppercase">
              GAMEFORGE
            </span>
            <span className="text-lg font-heading text-secondary uppercase">
              AI
            </span>
          </Link>
          <button
            onClick={close}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-400 hover:text-neutral-200 transition-colors"
            aria-label="Close navigation"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Main nav */}
        <nav className="flex-1 px-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-semibold transition-colors duration-150 ${
                  active
                    ? "bg-primary/10 text-primary-light border-l-2 border-primary-light"
                    : "text-neutral-400 hover:bg-surface-light hover:text-neutral-200"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* MAX status at bottom */}
        <div className="px-3 pb-6">
          <div className="border-t border-neutral-700 pt-4">
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-2 h-2 rounded-full bg-primary-light animate-pulse" />
              <span className="text-xs font-semibold text-primary-light uppercase tracking-wider">
                MAX ONLINE
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

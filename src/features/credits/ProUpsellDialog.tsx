"use client";

import { useState, useEffect, useCallback } from "react";
import { useCredits } from "./CreditsProvider";

const STORAGE_KEY = "gameforge:pro-upsell-dismissed";
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

const PRO_PERKS = [
  {
    label: "150 CREDITS",
    detail: "3x more than Starter",
    icon: "bolt",
  },
  {
    label: "MAX PRO MODE",
    detail: "Most advanced game engine",
    icon: "brain",
  },
  {
    label: "PRIORITY SUPPORT",
    detail: "Skip the line",
    icon: "shield",
  },
] as const;

function BoltIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

const PERK_ICONS = { bolt: BoltIcon, brain: BrainIcon, shield: ShieldIcon };

interface ProUpsellDialogProps {
  forceOpen?: boolean;
  onForceClose?: () => void;
}

export function ProUpsellDialog({ forceOpen, onForceClose }: ProUpsellDialogProps) {
  const { isPaidUser, isLoading, openPurchaseModalForPack } = useCredits();
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<"entering" | "visible" | "exiting">("entering");

  // Auto-show on dashboard entry (24h cooldown, non-paid only)
  useEffect(() => {
    if (forceOpen) return; // Don't auto-show if being force-opened
    if (isLoading || isPaidUser) return;

    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const ts = parseInt(dismissed, 10);
      if (Date.now() - ts < COOLDOWN_MS) return;
    }

    const showTimer = setTimeout(() => {
      setVisible(true);
      setPhase("entering");
      setTimeout(() => setPhase("visible"), 600);
    }, 800);

    return () => clearTimeout(showTimer);
  }, [isLoading, isPaidUser, forceOpen]);

  // Force-open from context (e.g. ChatPanel PRO button click)
  useEffect(() => {
    if (forceOpen && !visible) {
      setVisible(true);
      setPhase("entering");
      setTimeout(() => setPhase("visible"), 600);
    }
  }, [forceOpen, visible]);

  const dismiss = useCallback(() => {
    setPhase("exiting");
    setTimeout(() => {
      setVisible(false);
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
      onForceClose?.();
    }, 400);
  }, [onForceClose]);

  const handleUpgrade = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setVisible(false);
    onForceClose?.();
    openPurchaseModalForPack("pro");
  }, [openPurchaseModalForPack, onForceClose]);

  // Escape key dismiss
  useEffect(() => {
    if (!visible) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible, dismiss]);

  if (!visible) return null;

  const isExiting = phase === "exiting";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pro-upsell-heading"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/85 backdrop-blur-sm transition-opacity duration-300 ${
          isExiting ? "opacity-0" : "opacity-100"
        }`}
        onClick={dismiss}
      />

      {/* Scan-line overlay */}
      <div
        className={`absolute inset-0 animate-scan-lines pointer-events-none transition-opacity duration-300 ${
          isExiting ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Dialog card */}
      <div
        className={`relative bg-surface border border-primary-light/20 rounded-lg max-w-lg w-full p-6 sm:p-8 transition-all duration-400 ${
          isExiting
            ? "opacity-0 scale-[0.98]"
            : phase === "entering"
              ? "opacity-0 scale-[0.95]"
              : "opacity-100 scale-100"
        }`}
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          aria-label="Dismiss upgrade offer"
          className="absolute top-4 right-4 text-neutral-600 hover:text-neutral-400 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Overline — blinking transmission */}
        <p className="text-[11px] font-mono text-primary-light tracking-[0.2em] mb-4 animate-glow-pulse">
          // INCOMING TRANSMISSION
        </p>

        {/* Main heading */}
        <h2
          id="pro-upsell-heading"
          className="text-3xl sm:text-4xl font-heading text-secondary uppercase neon-text-yellow motion-safe:animate-flicker-in"
        >
          NEW MISSION AVAILABLE
        </h2>

        {/* Sub-heading */}
        <p className="text-xl sm:text-2xl font-heading text-primary-light uppercase neon-text mt-1 mb-6">
          UPGRADE TO PRO
        </p>

        {/* HUD divider */}
        <div className="h-px bg-primary-light/20 mb-6" />

        {/* Perk rows */}
        <div className="space-y-4 mb-6">
          {PRO_PERKS.map((perk, i) => {
            const Icon = PERK_ICONS[perk.icon];
            return (
              <div
                key={perk.label}
                className="flex items-center gap-4 motion-safe:animate-slide-up"
                style={{ animationDelay: `${700 + i * 150}ms` }}
              >
                <div className="w-10 h-10 rounded-md bg-primary/20 border border-primary-light/30 flex items-center justify-center shrink-0 text-primary-light">
                  <Icon />
                </div>
                <div>
                  <p className="text-sm font-heading text-neutral-100 uppercase">
                    {perk.label}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {perk.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Model toggle mock — before/after */}
        <div
          className="bg-surface-dark rounded-lg border border-neutral-700 p-4 mb-6 motion-safe:animate-slide-up"
          style={{ animationDelay: "1050ms" }}
        >
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-3">
            UNLOCK IN GAME CREATOR
          </p>
          <div className="flex items-center gap-4">
            {/* Before */}
            <div className="flex-1">
              <p className="text-[9px] text-neutral-600 uppercase tracking-wider mb-1.5">NOW</p>
              <div className="flex items-center gap-0.5 bg-surface rounded border border-neutral-700 p-0.5 w-fit">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-primary/20 text-primary-light">
                  MAX
                </span>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded text-neutral-600 flex items-center gap-1">
                  PRO <LockIcon className="text-neutral-600" />
                </span>
              </div>
            </div>

            {/* Arrow */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-primary-light shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>

            {/* After */}
            <div className="flex-1">
              <p className="text-[9px] text-primary-light uppercase tracking-wider mb-1.5">WITH PRO</p>
              <div className="flex items-center gap-0.5 bg-surface rounded border border-primary-light/30 p-0.5 w-fit glow-green">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded text-neutral-400">
                  MAX
                </span>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-secondary/20 text-secondary">
                  PRO
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Price tag */}
        <div className="bg-surface-light rounded-md border border-secondary/20 p-4 flex items-center justify-between mb-6">
          <span className="text-3xl font-heading text-secondary neon-text-yellow">
            $29.99
          </span>
          <span className="text-[11px] text-neutral-500 uppercase tracking-wider text-right">
            $0.20/CREDIT<br />BEST VALUE
          </span>
        </div>

        {/* Primary CTA */}
        <button
          onClick={handleUpgrade}
          className="w-full rounded-md bg-primary hover:bg-primary-light text-white font-heading text-lg uppercase tracking-wider py-3.5 transition-all duration-200 glow-green animate-pulse-neon min-h-[52px]"
        >
          ACCEPT MISSION &mdash; GO PRO
        </button>

        {/* Dismiss link */}
        <button
          onClick={dismiss}
          className="w-full text-center text-xs text-neutral-600 hover:text-neutral-400 uppercase tracking-wider mt-3 py-1 transition-colors"
        >
          MAYBE LATER
        </button>

        {/* Fine print */}
        <p className="text-[10px] text-neutral-700 text-center mt-3">
          Secure payment via Stripe. Credits never expire.
        </p>
      </div>
    </div>
  );
}

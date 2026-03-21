"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface-dark/90 backdrop-blur-xl border-b border-neutral-700 shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-1">
            <span className="text-lg font-heading text-primary-light uppercase">
              GAMEFORGE
            </span>
            <span className="text-lg font-heading text-secondary uppercase">
              AI
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-neutral-400 hover:text-primary-light transition-colors duration-200 uppercase tracking-wider"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/login"
              className="text-sm font-semibold text-neutral-400 hover:text-primary-light transition-colors duration-200 uppercase tracking-wider"
            >
              Sign In
            </a>
            <a
              href="/try-it-now"
              className="bg-primary hover:bg-primary-light text-white rounded-md px-6 py-2.5 text-sm font-bold uppercase tracking-wider glow-green glow-green-hover transition-all duration-300 min-h-[44px] flex items-center gap-2"
            >
              {/* Gamepad icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="6" y1="11" x2="10" y2="11" />
                <line x1="8" y1="9" x2="8" y2="13" />
                <line x1="15" y1="12" x2="15.01" y2="12" />
                <line x1="18" y1="10" x2="18.01" y2="10" />
                <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
              </svg>
              START CREATING
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-neutral-300"
              strokeWidth={2}
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-dark/95 backdrop-blur-xl border-t border-neutral-700">
          <div className="px-4 py-6 flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-neutral-300 hover:text-primary-light text-base font-semibold px-4 py-3 rounded-md hover:bg-surface-light transition-colors duration-150 min-h-[44px] flex items-center uppercase tracking-wider"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="text-neutral-300 hover:text-primary-light text-base font-semibold px-4 py-3 rounded-md hover:bg-surface-light transition-colors duration-150 min-h-[44px] flex items-center uppercase tracking-wider"
            >
              Sign In
            </a>
            <a
              href="/try-it-now"
              onClick={() => setMobileOpen(false)}
              className="mt-2 bg-primary hover:bg-primary-light text-white rounded-md px-6 py-3 text-base font-bold text-center min-h-[44px] flex items-center justify-center gap-2 glow-green uppercase tracking-wider"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="6" y1="11" x2="10" y2="11" />
                <line x1="8" y1="9" x2="8" y2="13" />
                <line x1="15" y1="12" x2="15.01" y2="12" />
                <line x1="18" y1="10" x2="18.01" y2="10" />
                <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
              </svg>
              START CREATING
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

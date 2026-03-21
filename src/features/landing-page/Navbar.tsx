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
          ? "bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-1.5">
            <span
              className={`text-lg font-bold font-heading transition-colors duration-300 ${
                scrolled ? "text-neutral-800" : "text-white"
              }`}
            >
              FeltSense
            </span>
            <span className="text-lg font-bold font-heading text-accent">
              Clinic
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors duration-200 hover:text-primary ${
                  scrolled ? "text-neutral-600" : "text-neutral-300 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/login"
              className={`text-sm font-semibold transition-colors duration-200 hover:text-primary ${
                scrolled ? "text-neutral-600" : "text-neutral-300 hover:text-white"
              }`}
            >
              Sign In
            </a>
            <a
              href="/try-it-now"
              className="group bg-[linear-gradient(110deg,#4F46E5,#818CF8,#06B6D4,#4F46E5)] bg-[length:200%_auto] text-white rounded-full px-6 py-2.5 text-sm font-bold shadow-sm hover:shadow-lg hover:scale-105 active:scale-[0.98] transition-all duration-300 min-h-[44px] flex items-center gap-2 cta-glow cta-shimmer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
              Try it Live
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
              className={`transition-colors duration-300 ${
                scrolled ? "stroke-neutral-800" : "stroke-white"
              }`}
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
        <div className="md:hidden backdrop-blur-xl bg-neutral-900/95 border-t border-white/10">
          <div className="px-4 py-6 flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-neutral-300 hover:text-white text-base font-semibold px-4 py-3 rounded-md hover:bg-white/10 transition-colors duration-150 min-h-[44px] flex items-center"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="text-neutral-300 hover:text-white text-base font-semibold px-4 py-3 rounded-md hover:bg-white/10 transition-colors duration-150 min-h-[44px] flex items-center"
            >
              Sign In
            </a>
            <a
              href="/try-it-now"
              onClick={() => setMobileOpen(false)}
              className="mt-2 bg-[linear-gradient(110deg,#4F46E5,#818CF8,#06B6D4,#4F46E5)] bg-[length:200%_auto] text-white rounded-full px-6 py-3 text-base font-bold text-center min-h-[44px] flex items-center justify-center gap-2 cta-glow cta-shimmer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
              Try it Live
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

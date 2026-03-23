"use client";

import { useState } from "react";

export default function TryItNowPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/demo/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <section className="min-h-screen bg-surface-dark flex items-center justify-center px-4 pt-24 pb-16 relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[350px] bg-primary/8 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 w-full max-w-[420px] text-center">
          <div className="bg-surface border border-neutral-700 rounded-lg p-8">
            <div className="w-16 h-16 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-primary-light">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h2 className="text-2xl font-heading text-neutral-100 uppercase mb-3">
              CHECK YOUR EMAIL
            </h2>
            <p className="text-base text-neutral-400 mb-2">
              We sent a confirmation link to
            </p>
            <p className="text-base font-semibold text-primary-light mb-4">{email}</p>
            <p className="text-sm text-neutral-500">
              Click the link in your email to access your studio. The link will
              take you straight to your dashboard.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-surface-dark flex items-center justify-center px-4 pt-24 pb-16 relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[350px] bg-primary/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-primary/10 border border-primary/20 text-sm text-primary-light mb-6">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Free — no credit card
          </div>
          <h1 className="text-3xl md:text-4xl font-heading text-neutral-100 uppercase mb-3">
            START <span className="text-primary-light neon-text">CREATING</span>
          </h1>
          <p className="text-base text-neutral-400 max-w-sm mx-auto">
            Create your studio and start building games with MAX — your AI game
            designer.
          </p>
        </div>

        <div className="bg-surface border border-neutral-700 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-semibold text-neutral-300">
                Your name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                required
                className="w-full bg-surface-dark border border-neutral-700 rounded px-3.5 py-2.5 text-base text-neutral-200 placeholder:text-neutral-600 focus:border-primary/50 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-neutral-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                required
                className="w-full bg-surface-dark border border-neutral-700 rounded px-3.5 py-2.5 text-base text-neutral-200 placeholder:text-neutral-600 focus:border-primary/50 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-neutral-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
                className="w-full bg-surface-dark border border-neutral-700 rounded px-3.5 py-2.5 text-base text-neutral-200 placeholder:text-neutral-600 focus:border-primary/50 focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <div className="px-3 py-2 bg-error/10 border-l-2 border-l-error rounded-r">
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-light text-white rounded px-8 py-3 text-base font-semibold transition-colors glow-green min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating your studio...
                </span>
              ) : (
                "START CREATING"
              )}
            </button>
          </form>

          <p className="text-xs text-neutral-600 text-center mt-4">
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline hover:text-neutral-400">terms</a>{" "}
            and{" "}
            <a href="/privacy" className="underline hover:text-neutral-400">privacy policy</a>.
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 mt-6 text-neutral-500">
          <div className="flex items-center gap-1.5 text-xs">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Secure
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            10-second setup
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <line x1="6" y1="11" x2="10" y2="11" />
              <line x1="8" y1="9" x2="8" y2="13" />
              <line x1="15" y1="12" x2="15.01" y2="12" />
              <line x1="18" y1="10" x2="18.01" y2="10" />
              <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
            </svg>
            5 demo games
          </div>
        </div>
      </div>
    </section>
  );
}

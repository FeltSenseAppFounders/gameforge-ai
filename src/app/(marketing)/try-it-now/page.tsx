"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function TryItNowPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Create demo clinic via API
      const res = await fetch("/api/demo/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          clinicName: clinicName.trim() || undefined,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      // 2. Sign in with the demo credentials
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        setError("Account created but sign-in failed. Try logging in.");
        setLoading(false);
        return;
      }

      // 3. Redirect to dashboard with tour
      window.location.href = "/dashboard?tour=true";
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-800 flex items-center justify-center px-4 pt-24 pb-16">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary-light mb-6">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Instant demo — no credit card
          </div>

          <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-3">
            Try FeltSense Clinic{" "}
            <span className="text-gradient-ai">in 30 seconds</span>
          </h1>
          <p className="text-base text-neutral-400 max-w-sm mx-auto">
            Create your demo clinic and talk to Sarah, your AI receptionist.
            She&apos;ll book real appointments.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-neutral-300"
              >
                Your name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Jane Smith"
                required
                className="w-full bg-white/5 border border-white/15 rounded-md px-3.5 py-2.5 text-base text-white placeholder:text-neutral-500 focus:border-primary focus:ring-2 focus:ring-primary/35 focus:outline-none transition-colors duration-150"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-neutral-300"
              >
                Work email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@brightsmile.com"
                required
                className="w-full bg-white/5 border border-white/15 rounded-md px-3.5 py-2.5 text-base text-white placeholder:text-neutral-500 focus:border-primary focus:ring-2 focus:ring-primary/35 focus:outline-none transition-colors duration-150"
              />
            </div>

            {/* Clinic Name (optional) */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="clinicName"
                className="text-sm font-semibold text-neutral-300"
              >
                Clinic name{" "}
                <span className="text-neutral-500 font-normal">(optional)</span>
              </label>
              <input
                id="clinicName"
                type="text"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                placeholder="Bright Smile Dental"
                className="w-full bg-white/5 border border-white/15 rounded-md px-3.5 py-2.5 text-base text-white placeholder:text-neutral-500 focus:border-primary focus:ring-2 focus:ring-primary/35 focus:outline-none transition-colors duration-150"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="px-3 py-2 bg-error/10 border-l-4 border-l-error rounded-r-md">
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-br from-primary to-accent text-white rounded-md px-8 py-3.5 text-base font-semibold shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/35 focus:ring-offset-2 focus:ring-offset-neutral-900 min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed glow-primary-hover"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Creating your demo...
                </span>
              ) : (
                "Create My Demo"
              )}
            </button>
          </form>

          {/* Fine print */}
          <p className="text-xs text-neutral-500 text-center mt-4">
            By continuing, you agree to our terms. Your demo includes sample
            data you can explore freely.
          </p>
        </div>

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-6 mt-6 text-neutral-500">
          <div className="flex items-center gap-1.5 text-xs">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Secure
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            30-second setup
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            Full demo data
          </div>
        </div>
      </div>
    </section>
  );
}

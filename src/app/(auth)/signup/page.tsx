"use client";

import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center px-4">
        <div className="w-full max-w-[400px] text-center">
          <a href="/" className="flex items-center justify-center gap-1 mb-8">
            <span className="text-2xl font-heading text-primary-light uppercase">
              GAMEFORGE
            </span>
            <span className="text-2xl font-heading text-secondary uppercase">
              AI
            </span>
          </a>
          <div className="bg-surface rounded-lg border border-neutral-700 p-8">
            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
              <svg
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                className="text-primary-light"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-heading text-neutral-100 mb-2 uppercase">
              Check your email
            </h2>
            <p className="text-sm text-neutral-400">
              We sent a confirmation link to{" "}
              <span className="font-semibold text-neutral-200">{email}</span>.
              Click the link to activate your account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-dark flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <a href="/" className="flex items-center justify-center gap-1 mb-8">
          <span className="text-2xl font-heading text-primary-light uppercase">
            GAMEFORGE
          </span>
          <span className="text-2xl font-heading text-secondary uppercase">
            AI
          </span>
        </a>

        <div className="bg-surface rounded-lg border border-neutral-700 p-8">
          <h1 className="text-xl font-heading text-neutral-100 text-center mb-1 uppercase">
            Create your account
          </h1>
          <p className="text-sm text-neutral-500 text-center mb-6">
            Start creating games with MAX
          </p>

          {/* Email/Password form */}
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="fullName"
                className="text-sm font-semibold text-neutral-300"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Rivera"
                required
                className="w-full bg-surface-dark border border-neutral-700 rounded px-3.5 py-2.5 text-base text-neutral-200 placeholder:text-neutral-600 focus:border-primary/50 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-neutral-300"
              >
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
              <label
                htmlFor="password"
                className="text-sm font-semibold text-neutral-300"
              >
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
              className="bg-primary hover:bg-primary-light text-white rounded px-6 py-3 text-sm font-semibold transition-colors glow-green min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-sm text-neutral-500 text-center mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-primary-light font-semibold hover:text-primary transition-colors"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

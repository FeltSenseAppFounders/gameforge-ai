"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

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

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  async function handleOAuthLogin(provider: "google") {
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
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

          {/* OAuth */}
          <button
            onClick={() => handleOAuthLogin("google")}
            className="w-full flex items-center justify-center gap-3 border border-neutral-700 rounded px-4 py-2.5 text-sm font-semibold text-neutral-300 hover:bg-surface-light transition-colors min-h-[44px] mb-6"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-neutral-700" />
            <span className="text-xs text-neutral-500">or</span>
            <div className="flex-1 h-px bg-neutral-700" />
          </div>

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

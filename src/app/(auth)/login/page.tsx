"use client";

import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    window.location.href = redirect;
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
            Welcome back
          </h1>
          <p className="text-sm text-neutral-500 text-center mb-6">
            Sign in to your studio
          </p>

          {/* Email/Password form */}
          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
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
                placeholder="you@example.com"
                required
                className="w-full bg-surface-dark border border-neutral-700 rounded px-3.5 py-2.5 text-base text-neutral-200 placeholder:text-neutral-600 focus:border-primary/50 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-neutral-300"
                >
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-xs text-primary-light hover:text-primary transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
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
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-sm text-neutral-500 text-center mt-6">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="text-primary-light font-semibold hover:text-primary transition-colors"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

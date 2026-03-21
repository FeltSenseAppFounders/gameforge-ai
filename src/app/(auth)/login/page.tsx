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

  async function handleOAuthLogin(provider: "google") {
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });

    if (error) {
      setError(error.message);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <a href="/" className="flex items-center justify-center gap-1.5 mb-8">
          <span className="text-2xl font-bold font-heading text-neutral-800">
            FeltSense
          </span>
          <span className="text-2xl font-bold font-heading text-accent">
            Clinic
          </span>
        </a>

        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-8">
          <h1 className="text-xl font-semibold font-heading text-neutral-800 text-center mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-neutral-500 text-center mb-6">
            Sign in to your dashboard
          </p>

          {/* OAuth */}
          <button
            onClick={() => handleOAuthLogin("google")}
            className="w-full flex items-center justify-center gap-3 border border-neutral-300 rounded-md px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors duration-150 min-h-[44px] mb-6"
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
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-xs text-neutral-400">or</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          {/* Email/Password form */}
          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-neutral-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@clinic.com"
                required
                className="w-full bg-white border border-neutral-300 rounded-md px-3.5 py-2.5 text-base text-neutral-700 placeholder:text-neutral-400 focus:border-primary focus:ring-2 focus:ring-primary/35 focus:outline-none transition-colors duration-150"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-neutral-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                className="w-full bg-white border border-neutral-300 rounded-md px-3.5 py-2.5 text-base text-neutral-700 placeholder:text-neutral-400 focus:border-primary focus:ring-2 focus:ring-primary/35 focus:outline-none transition-colors duration-150"
              />
            </div>

            {error && (
              <div className="px-3 py-2 bg-error/10 border-l-4 border-l-error rounded-r-md">
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-dark text-white rounded-md px-6 py-3 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/35 focus:ring-offset-2 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-sm text-neutral-500 text-center mt-6">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="text-primary font-semibold hover:text-primary-dark transition-colors"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

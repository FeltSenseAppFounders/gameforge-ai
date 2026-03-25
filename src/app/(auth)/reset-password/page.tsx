"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface-dark flex items-center justify-center px-4">
          <div className="w-full max-w-[400px] text-center">
            <p className="text-sm text-neutral-500">Loading...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    async function verifyToken() {
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      if (tokenHash && type === "recovery") {
        const supabase = createClient();
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        });
        if (error) {
          setError("This reset link has expired or is invalid. Please request a new one.");
        } else {
          setSessionReady(true);
        }
      } else {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setSessionReady(true);
        } else {
          setError("No valid reset token found. Please request a new password reset.");
        }
      }
      setVerifying(false);
    }
    verifyToken();
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
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
              Password updated
            </h2>
            <p className="text-sm text-neutral-400 mb-6">
              Your password has been reset successfully. You can now sign in
              with your new password.
            </p>
            <a
              href="/login"
              className="inline-block bg-primary hover:bg-primary-light text-white rounded px-6 py-3 text-sm font-semibold transition-colors glow-green"
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (verifying) {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center px-4">
        <div className="w-full max-w-[400px] text-center">
          <p className="text-sm text-neutral-500">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (!sessionReady) {
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
            <h2 className="text-xl font-heading text-neutral-100 mb-2 uppercase">
              Invalid or expired link
            </h2>
            <p className="text-sm text-neutral-400 mb-6">
              {error || "This password reset link is no longer valid."}
            </p>
            <a
              href="/forgot-password"
              className="inline-block bg-primary hover:bg-primary-light text-white rounded px-6 py-3 text-sm font-semibold transition-colors glow-green"
            >
              Request new reset link
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-dark flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
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
            Set new password
          </h1>
          <p className="text-sm text-neutral-500 text-center mb-6">
            Choose a strong password for your account
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-neutral-300"
              >
                New password
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

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-semibold text-neutral-300"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
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
              {loading ? "Updating..." : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

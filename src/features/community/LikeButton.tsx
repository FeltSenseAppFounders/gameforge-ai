"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface LikeButtonProps {
  gameId: string;
  initialCount: number;
  /** If false, clicking redirects to signup instead of toggling */
  requiresAuth?: boolean;
}

export function LikeButton({
  gameId,
  initialCount,
  requiresAuth = true,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const checkedRef = useRef(false);

  // Check if user has liked this game on mount
  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;

    async function checkLiked() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase.rpc("is_liked_by_user", {
        p_game_id: gameId,
      });
      if (data === true) setLiked(true);
    }

    checkLiked();
  }, [gameId]);

  const handleToggle = useCallback(async () => {
    if (loading) return;

    // If not authed and requiresAuth is false, redirect to signup
    if (!requiresAuth) {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/try-it-now";
        return;
      }
    }

    // Optimistic update
    const wasLiked = liked;
    setLiked(!wasLiked);
    setCount((c) => (wasLiked ? Math.max(c - 1, 0) : c + 1));
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("toggle_like", {
        p_game_id: gameId,
      });

      if (error) {
        // Revert on error
        setLiked(wasLiked);
        setCount((c) => (wasLiked ? c + 1 : Math.max(c - 1, 0)));

        // If not authenticated, redirect
        if (error.message?.includes("Not authenticated")) {
          window.location.href = "/try-it-now";
        }
      }
    } catch {
      // Revert
      setLiked(wasLiked);
      setCount((c) => (wasLiked ? c + 1 : Math.max(c - 1, 0)));
    } finally {
      setLoading(false);
    }
  }, [gameId, liked, loading, requiresAuth]);

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-1.5 text-xs transition-colors ${
        liked
          ? "text-accent hover:text-accent/80"
          : "text-neutral-400 hover:text-accent"
      }`}
      title={liked ? "Unlike" : "Like"}
    >
      <svg
        width="16"
        height="16"
        fill={liked ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <span className="font-semibold">{count}</span>
    </button>
  );
}

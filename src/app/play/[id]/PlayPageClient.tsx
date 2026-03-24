"use client";

import { ShareButton } from "@/features/community/ShareButton";
import { LikeButton } from "@/features/community/LikeButton";

interface PlayPageClientProps {
  gameId: string;
  gameName: string;
  likesCount: number;
}

export function PlayPageClient({
  gameId,
  gameName,
  likesCount,
}: PlayPageClientProps) {
  return (
    <div className="flex items-center gap-3">
      <LikeButton
        gameId={gameId}
        initialCount={likesCount}
        requiresAuth={false}
      />
      <ShareButton gameId={gameId} gameName={gameName} />
    </div>
  );
}

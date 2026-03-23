"use client";

import { ShareButton } from "@/features/community/ShareButton";

interface PlayPageClientProps {
  gameId: string;
  gameName: string;
}

export function PlayPageClient({ gameId, gameName }: PlayPageClientProps) {
  return <ShareButton gameId={gameId} gameName={gameName} />;
}

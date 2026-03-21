import { createClient } from "@/lib/supabase/server";
import { getStudioContext } from "@/lib/studio-context";
import { notFound } from "next/navigation";
import { GameEditor } from "./GameEditor";
import type { GameProject, ChatMessage } from "@/core/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function GameDetailPage({ params }: Props) {
  const { id } = await params;
  const ctx = await getStudioContext();
  if (!ctx) return null;

  const supabase = await createClient();

  // Fetch game project
  const { data: game } = await supabase
    .from("game_projects")
    .select("*")
    .eq("id", id)
    .eq("studio_id", ctx.studioId)
    .single();

  if (!game) notFound();

  // Fetch chat session for this game
  const { data: chatSession } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("game_project_id", id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  const initialMessages: ChatMessage[] = chatSession?.messages
    ? (chatSession.messages as ChatMessage[])
    : [];

  return (
    <GameEditor
      game={game as GameProject}
      initialMessages={initialMessages}
    />
  );
}

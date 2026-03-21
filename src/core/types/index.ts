// GameForge AI — Type definitions
// Manual types until we generate from Supabase schema

export interface Studio {
  id: string;
  name: string;
  owner_id: string;
  subscription_tier: string;
  created_at: string;
  updated_at: string;
}

export interface GameProject {
  id: string;
  studio_id: string;
  name: string;
  description: string | null;
  genre: string | null;
  status: string; // 'draft' | 'playable' | 'published'
  game_code: string | null;
  thumbnail_url: string | null;
  likes_count: number;
  views_count: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  studio_id: string;
  game_project_id: string | null;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  email: string;
  name: string | null;
  source: string;
  created_at: string;
}

// Insert types
export type StudioInsert = Omit<Studio, "id" | "created_at" | "updated_at">;
export type GameProjectInsert = Omit<GameProject, "id" | "created_at" | "updated_at" | "likes_count" | "views_count">;
export type ChatSessionInsert = Omit<ChatSession, "id" | "created_at" | "updated_at">;
export type LeadInsert = Omit<Lead, "id" | "created_at">;

// Update types
export type StudioUpdate = Partial<StudioInsert>;
export type GameProjectUpdate = Partial<GameProjectInsert>;
export type ChatSessionUpdate = Partial<ChatSessionInsert>;

// Game genres
export type GameGenre = "platformer" | "shooter" | "puzzle" | "racing" | "rpg" | "other";

// Game statuses
export type GameStatus = "draft" | "playable" | "published";

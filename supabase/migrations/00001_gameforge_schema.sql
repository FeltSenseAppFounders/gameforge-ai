-- ============================================================
-- GameForge AI — Core Schema
-- ============================================================

-- Studios (replaces clinics)
CREATE TABLE studios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Game projects (core entity)
CREATE TABLE game_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  genre TEXT, -- 'platformer', 'shooter', 'puzzle', 'racing', 'rpg', etc.
  status TEXT DEFAULT 'draft', -- 'draft', 'playable', 'published'
  game_code TEXT, -- Full HTML/JS Phaser code
  thumbnail_url TEXT,
  likes_count INT DEFAULT 0,
  views_count INT DEFAULT 0,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Chat sessions
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  game_project_id UUID REFERENCES game_projects(id) ON DELETE SET NULL,
  messages JSONB DEFAULT '[]', -- Array of {role, content, timestamp}
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Leads/waitlist
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT,
  source TEXT DEFAULT 'demo_signup',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- GameForge AI — RLS Policies & Indexes
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE studios ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- ── Studios ──────────────────────────────────────────────────

-- Owner can CRUD their studios
CREATE POLICY "studio_owner_all" ON studios
  FOR ALL USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- ── Game Projects ────────────────────────────────────────────

-- Studio owner can CRUD their game projects
CREATE POLICY "game_project_owner_all" ON game_projects
  FOR ALL USING (
    studio_id IN (SELECT id FROM studios WHERE owner_id = auth.uid())
  )
  WITH CHECK (
    studio_id IN (SELECT id FROM studios WHERE owner_id = auth.uid())
  );

-- Public game projects readable by all authenticated users
CREATE POLICY "game_project_public_read" ON game_projects
  FOR SELECT USING (is_public = true);

-- ── Chat Sessions ────────────────────────────────────────────

-- Studio owner can CRUD their chat sessions
CREATE POLICY "chat_session_owner_all" ON chat_sessions
  FOR ALL USING (
    studio_id IN (SELECT id FROM studios WHERE owner_id = auth.uid())
  )
  WITH CHECK (
    studio_id IN (SELECT id FROM studios WHERE owner_id = auth.uid())
  );

-- ── Leads ────────────────────────────────────────────────────

-- Anyone can insert leads (public signup)
CREATE POLICY "leads_insert" ON leads
  FOR INSERT WITH CHECK (true);

-- ── Indexes ──────────────────────────────────────────────────

CREATE INDEX idx_studios_owner_id ON studios(owner_id);
CREATE INDEX idx_game_projects_studio_id ON game_projects(studio_id);
CREATE INDEX idx_game_projects_status ON game_projects(status);
CREATE INDEX idx_game_projects_is_public ON game_projects(is_public);
CREATE INDEX idx_game_projects_genre ON game_projects(genre);
CREATE INDEX idx_chat_sessions_studio_id ON chat_sessions(studio_id);
CREATE INDEX idx_chat_sessions_game_project_id ON chat_sessions(game_project_id);
CREATE INDEX idx_leads_email ON leads(email);

-- ============================================================
-- GameForge AI — Game Likes (auth-required)
-- ============================================================

CREATE TABLE game_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  game_project_id UUID NOT NULL REFERENCES game_projects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, game_project_id)
);

-- RLS
ALTER TABLE game_likes ENABLE ROW LEVEL SECURITY;

-- Users can see all likes (for count queries)
CREATE POLICY "game_likes_select" ON game_likes
  FOR SELECT USING (true);

-- Users can insert their own likes
CREATE POLICY "game_likes_insert" ON game_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes
CREATE POLICY "game_likes_delete" ON game_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX idx_game_likes_user_game ON game_likes(user_id, game_project_id);
CREATE INDEX idx_game_likes_game ON game_likes(game_project_id);

-- Toggle like: insert or delete, update count, return new liked state
CREATE OR REPLACE FUNCTION toggle_like(p_game_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_exists boolean;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM game_likes
    WHERE user_id = v_user_id AND game_project_id = p_game_id
  ) INTO v_exists;

  IF v_exists THEN
    -- Unlike
    DELETE FROM game_likes
    WHERE user_id = v_user_id AND game_project_id = p_game_id;

    UPDATE game_projects
    SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = p_game_id;

    RETURN false;
  ELSE
    -- Like
    INSERT INTO game_likes (user_id, game_project_id)
    VALUES (v_user_id, p_game_id);

    UPDATE game_projects
    SET likes_count = likes_count + 1
    WHERE id = p_game_id;

    RETURN true;
  END IF;
END;
$$;

-- Check if current user has liked a game
CREATE OR REPLACE FUNCTION is_liked_by_user(p_game_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM game_likes
    WHERE user_id = auth.uid() AND game_project_id = p_game_id
  );
END;
$$;

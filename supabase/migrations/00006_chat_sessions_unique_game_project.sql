-- Add unique constraint on game_project_id so upsert with onConflict works
ALTER TABLE chat_sessions ADD CONSTRAINT chat_sessions_game_project_id_key UNIQUE (game_project_id);

-- ============================================================
-- GameForge AI — Security Hardening
-- Rate limiting, credit transaction audit log, add_credits bounds
-- ============================================================

-- 1. Rate limits table — distributed rate limiting via Supabase
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_rate_limits_key_created ON rate_limits (key, created_at DESC);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
-- No public policies — accessed only via SECURITY DEFINER functions

-- Atomic check-and-record rate limit
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_key TEXT,
  p_max_requests INT,
  p_window_seconds INT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INT;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM rate_limits
  WHERE key = p_key
    AND created_at > now() - make_interval(secs => p_window_seconds);

  IF v_count >= p_max_requests THEN
    RETURN FALSE;
  END IF;

  INSERT INTO rate_limits (key) VALUES (p_key);
  RETURN TRUE;
END;
$$;

-- Periodic cleanup (call from cron or manually)
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  DELETE FROM rate_limits WHERE created_at < now() - INTERVAL '2 hours';
$$;

-- 2. Credit transaction audit log
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  endpoint TEXT NOT NULL,
  model TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_credit_tx_studio_date ON credit_transactions (studio_id, created_at);

ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "credit_tx_owner_read" ON credit_transactions
  FOR SELECT USING (
    studio_id IN (SELECT id FROM studios WHERE owner_id = auth.uid())
  );

-- Daily credit usage check (for caps)
CREATE OR REPLACE FUNCTION get_daily_credit_usage(p_studio_id UUID)
RETURNS INT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(SUM(amount), 0)::INT
  FROM credit_transactions
  WHERE studio_id = p_studio_id
    AND created_at > date_trunc('day', now());
$$;

-- 3. Harden add_credits with bounds check
CREATE OR REPLACE FUNCTION add_credits(studio_id UUID, amount INT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF amount <= 0 OR amount > 1000 THEN
    RAISE EXCEPTION 'Invalid credit amount: %', amount;
  END IF;
  UPDATE studios SET credits = credits + amount WHERE id = add_credits.studio_id;
END;
$$;

-- 4. Game reports table (for community content moderation)
CREATE TABLE game_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_project_id UUID NOT NULL REFERENCES game_projects(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES auth.users(id),
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(reporter_id, game_project_id)
);

ALTER TABLE game_reports ENABLE ROW LEVEL SECURITY;

-- Users can insert reports for games they haven't already reported
CREATE POLICY "game_reports_insert" ON game_reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Users can see their own reports
CREATE POLICY "game_reports_own_read" ON game_reports
  FOR SELECT USING (auth.uid() = reporter_id);

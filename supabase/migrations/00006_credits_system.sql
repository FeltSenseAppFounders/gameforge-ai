-- ============================================================
-- GameForge AI — Credit System (minimal)
-- Adds a credits column to studios + a single purchases table
-- ============================================================

-- 1. Add credits column to studios (default 10 free credits)
ALTER TABLE studios ADD COLUMN credits INT NOT NULL DEFAULT 10;

-- 2. Credit purchases — tracks Stripe checkout fulfillment
CREATE TABLE credit_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  stripe_checkout_session_id TEXT NOT NULL UNIQUE,
  credits_amount INT NOT NULL,
  price_cents INT NOT NULL,
  status TEXT DEFAULT 'pending',  -- 'pending', 'completed'
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE credit_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "credit_purchases_owner_read" ON credit_purchases
  FOR SELECT USING (
    studio_id IN (SELECT id FROM studios WHERE owner_id = auth.uid())
  );

-- 3. Atomic credit deduction (prevents race conditions)
--    Returns true if a credit was deducted, false if insufficient
CREATE OR REPLACE FUNCTION deduct_credit(studio_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE studios SET credits = credits - 1 WHERE id = studio_id AND credits > 0;
  RETURN FOUND;
END;
$$;

-- 4. Atomic credit addition (prevents race conditions)
CREATE OR REPLACE FUNCTION add_credits(studio_id UUID, amount INT)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE studios SET credits = credits + amount WHERE id = studio_id;
$$;

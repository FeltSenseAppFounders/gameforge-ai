-- ============================================================
-- Update deduct_credit to accept an amount parameter
-- Backwards compatible: deduct_credit(studio_id) still deducts 1
-- ============================================================

CREATE OR REPLACE FUNCTION deduct_credit(studio_id UUID, amount INT DEFAULT 1)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE studios SET credits = credits - amount
  WHERE id = deduct_credit.studio_id AND credits >= amount;
  RETURN FOUND;
END;
$$;

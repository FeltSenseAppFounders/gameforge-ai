-- ============================================================
-- Remove mock game seeding from seed_demo_studio()
-- Studio is still created, but no fake games are inserted.
-- ============================================================

CREATE OR REPLACE FUNCTION seed_demo_studio(p_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_studio_id UUID;
BEGIN
  INSERT INTO studios (name, owner_id, subscription_tier)
  VALUES ('Demo Studio', p_user_id, 'free')
  RETURNING id INTO v_studio_id;

  RETURN v_studio_id;
END;
$$;

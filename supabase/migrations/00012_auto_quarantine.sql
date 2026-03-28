-- Auto-quarantine: unpublish games that receive 3+ reports.
-- Runs as a trigger after each new report is inserted.

CREATE OR REPLACE FUNCTION auto_quarantine_game()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  report_count INT;
BEGIN
  -- Count total reports for this game
  SELECT COUNT(*) INTO report_count
  FROM game_reports
  WHERE game_project_id = NEW.game_project_id;

  -- Auto-unpublish at 3+ reports
  IF report_count >= 3 THEN
    UPDATE game_projects
    SET is_public = false,
        status = 'quarantined',
        updated_at = now()
    WHERE id = NEW.game_project_id
      AND is_public = true;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_auto_quarantine
  AFTER INSERT ON game_reports
  FOR EACH ROW
  EXECUTE FUNCTION auto_quarantine_game();

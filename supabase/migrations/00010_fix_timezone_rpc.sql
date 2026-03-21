-- 00010_fix_timezone_rpc.sql
-- Fix: use clinic timezone instead of hardcoded 'UTC' when converting availability slots.
-- The clinics.timezone column (default 'America/New_York') was already present but unused.

CREATE OR REPLACE FUNCTION get_available_slots(
  _clinic_id UUID,
  _date DATE
)
RETURNS TABLE (
  provider_id UUID,
  provider_name TEXT,
  provider_specialty TEXT,
  slot_start TIMESTAMPTZ,
  slot_end TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _day_of_week INT;
  _now TIMESTAMPTZ;
  _tz TEXT;
BEGIN
  _day_of_week := EXTRACT(DOW FROM _date)::INT;  -- 0=Sunday
  _now := now();

  -- Load the clinic's timezone (fall back to America/New_York)
  SELECT timezone INTO _tz FROM clinics WHERE id = _clinic_id;
  IF _tz IS NULL THEN _tz := 'America/New_York'; END IF;

  RETURN QUERY
  WITH
  -- Generate all possible slots from availability templates
  all_slots AS (
    SELECT
      p.id AS prov_id,
      p.title || ' ' || p.first_name || ' ' || p.last_name AS prov_name,
      p.specialty AS prov_specialty,
      gs.slot_time AS s_start,
      gs.slot_time + (pa.slot_duration_minutes || ' minutes')::INTERVAL AS s_end
    FROM providers p
    JOIN provider_availability pa ON pa.provider_id = p.id
    CROSS JOIN LATERAL generate_series(
      _date + pa.start_time,
      _date + pa.end_time - (pa.slot_duration_minutes || ' minutes')::INTERVAL,
      (pa.slot_duration_minutes || ' minutes')::INTERVAL
    ) AS gs(slot_time)
    WHERE p.clinic_id = _clinic_id
      AND p.is_active = true
      AND pa.clinic_id = _clinic_id
      AND pa.is_active = true
      AND pa.day_of_week = _day_of_week
  ),
  -- Find booked slots (non-cancelled appointments for this clinic+date)
  booked AS (
    SELECT
      a.provider_ref AS booked_provider,
      a.start_time AS booked_start,
      a.end_time AS booked_end
    FROM appointments a
    WHERE a.clinic_id = _clinic_id
      AND a.status != 'cancelled'
      AND a.start_time >= _date::TIMESTAMP AT TIME ZONE _tz
      AND a.start_time < (_date + 1)::TIMESTAMP AT TIME ZONE _tz
      AND a.provider_ref IS NOT NULL
  )
  SELECT
    s.prov_id,
    s.prov_name,
    s.prov_specialty,
    -- Convert naive slot times to TIMESTAMPTZ in the clinic's timezone
    s.s_start AT TIME ZONE _tz AS slot_start_tz,
    s.s_end AT TIME ZONE _tz AS slot_end_tz
  FROM all_slots s
  WHERE
    NOT EXISTS (
      SELECT 1 FROM booked b
      WHERE b.booked_provider = s.prov_id
        AND b.booked_start < (s.s_end AT TIME ZONE _tz)
        AND b.booked_end > (s.s_start AT TIME ZONE _tz)
    )
    AND (
      _date > _now::DATE
      OR (s.s_start AT TIME ZONE _tz) > _now
    )
  ORDER BY s.s_start, s.prov_name;
END;
$$;

-- 00008_available_slots_rpc.sql
-- RPC function: given a clinic_id and date, returns all open appointment slots
--
-- Logic:
-- 1. Generate time slots from provider_availability templates for that day-of-week
-- 2. Subtract existing non-cancelled appointments
-- 3. Filter out past slots (if date is today)
-- 4. Returns: provider_id, provider_name, slot_start, slot_end

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
BEGIN
  _day_of_week := EXTRACT(DOW FROM _date)::INT;  -- 0=Sunday
  _now := now();

  RETURN QUERY
  WITH
  -- Generate all possible slots from availability templates
  all_slots AS (
    SELECT
      p.id AS prov_id,
      p.title || ' ' || p.first_name || ' ' || p.last_name AS prov_name,
      p.specialty AS prov_specialty,
      -- Generate series of slot start times within each availability block
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
      AND a.start_time >= _date::TIMESTAMPTZ
      AND a.start_time < (_date + INTERVAL '1 day')::TIMESTAMPTZ
      AND a.provider_ref IS NOT NULL
  )
  SELECT
    s.prov_id,
    s.prov_name,
    s.prov_specialty,
    s.s_start AT TIME ZONE 'UTC',
    s.s_end AT TIME ZONE 'UTC'
  FROM all_slots s
  WHERE
    -- Exclude slots that overlap with existing appointments
    NOT EXISTS (
      SELECT 1 FROM booked b
      WHERE b.booked_provider = s.prov_id
        AND b.booked_start < s.s_end
        AND b.booked_end > s.s_start
    )
    -- Filter out past slots if the date is today
    AND (
      _date > _now::DATE
      OR s.s_start > _now
    )
  ORDER BY s.s_start, s.prov_name;
END;
$$;

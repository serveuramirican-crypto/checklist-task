-- Survival Daily Checklist Schema, Strict RLS & Atomic Survival RPC Engine

CREATE TABLE IF NOT EXISTS public.survival_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  survivor_name text NOT NULL DEFAULT 'Wanderer' CHECK (char_length(trim(survivor_name)) BETWEEN 1 AND 40),
  timezone text NOT NULL DEFAULT 'UTC',
  current_run_id uuid NOT NULL DEFAULT gen_random_uuid(),
  current_day integer NOT NULL DEFAULT 1 CHECK (current_day >= 1),
  level integer NOT NULL DEFAULT 1 CHECK (level >= 1),
  points integer NOT NULL DEFAULT 0 CHECK (points >= 0),
  best_day integer NOT NULL DEFAULT 1 CHECK (best_day >= 1),
  best_points integer NOT NULL DEFAULT 0 CHECK (best_points >= 0),
  active_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.daily_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  run_id uuid NOT NULL,
  day_number integer NOT NULL CHECK (day_number >= 1),
  date_key date NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'survived', 'failed')),
  bonus_awarded integer NOT NULL DEFAULT 0 CHECK (bonus_awarded >= 0),
  survived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, run_id, date_key)
);

CREATE TABLE IF NOT EXISTS public.daily_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_id uuid NOT NULL REFERENCES public.daily_days(id) ON DELETE CASCADE,
  run_id uuid NOT NULL,
  title text NOT NULL CHECK (char_length(trim(title)) BETWEEN 1 AND 160),
  difficulty text NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  points integer NOT NULL CHECK (points IN (15, 30, 50)),
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.run_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  run_id uuid NOT NULL,
  days_survived integer NOT NULL CHECK (days_survived >= 0),
  peak_level integer NOT NULL CHECK (peak_level >= 1),
  points_lost integer NOT NULL CHECK (points_lost >= 0),
  failure_reason text NOT NULL,
  failed_date date NOT NULL,
  acknowledged boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_daily_days_user_run_date ON public.daily_days (user_id, run_id, date_key);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_day_id ON public.daily_tasks (day_id, created_at);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_id ON public.daily_tasks (user_id);
CREATE INDEX IF NOT EXISTS idx_run_history_user_created ON public.run_history (user_id, created_at DESC);

ALTER TABLE public.survival_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.run_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "survival_profiles_select_own"
  ON public.survival_profiles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "daily_days_select_own"
  ON public.daily_days FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "daily_tasks_select_own"
  ON public.daily_tasks FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "run_history_select_own"
  ON public.run_history FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE OR REPLACE FUNCTION public._build_survival_payload(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_profile public.survival_profiles%ROWTYPE;
  v_day public.daily_days%ROWTYPE;
  v_tasks jsonb;
  v_unack_death jsonb;
  v_graveyard jsonb;
BEGIN
  SELECT * INTO v_profile
  FROM public.survival_profiles
  WHERE user_id = p_user_id;

  SELECT * INTO v_day
  FROM public.daily_days
  WHERE user_id = p_user_id
    AND run_id = v_profile.current_run_id
    AND date_key = v_profile.active_date;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(t) ORDER BY t.created_at ASC),
    '[]'::jsonb
  )
  INTO v_tasks
  FROM public.daily_tasks t
  WHERE t.day_id = v_day.id;

  SELECT to_jsonb(r)
  INTO v_unack_death
  FROM public.run_history r
  WHERE r.user_id = p_user_id
    AND r.acknowledged = false
  ORDER BY r.created_at DESC
  LIMIT 1;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(r) ORDER BY r.created_at DESC),
    '[]'::jsonb
  )
  INTO v_graveyard
  FROM (
    SELECT *
    FROM public.run_history
    WHERE user_id = p_user_id
    ORDER BY created_at DESC
    LIMIT 20
  ) r;

  RETURN jsonb_build_object(
    'profile', to_jsonb(v_profile),
    'current_day_record', to_jsonb(v_day),
    'tasks', v_tasks,
    'unacknowledged_death', v_unack_death,
    'graveyard', v_graveyard,
    'server_now', now()
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.init_or_sync_survival(
  p_timezone text DEFAULT 'UTC',
  p_survivor_name text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_tz text := 'UTC';
  v_name text;
  v_today date;
  v_profile public.survival_profiles%ROWTYPE;
  v_day public.daily_days%ROWTYPE;
  v_total_tasks integer := 0;
  v_completed_tasks integer := 0;
  v_next_day integer;
  v_new_run_id uuid;
  v_days_survived integer;
  v_failure_reason text;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(v_user_id::text));

  IF p_timezone IS NOT NULL AND EXISTS (
    SELECT 1 FROM pg_timezone_names WHERE name = p_timezone
  ) THEN
    v_tz := p_timezone;
  END IF;

  SELECT * INTO v_profile
  FROM public.survival_profiles
  WHERE user_id = v_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    v_today := (now() AT TIME ZONE v_tz)::date;
    v_name := COALESCE(NULLIF(left(trim(p_survivor_name), 40), ''), 'Wanderer');
    v_new_run_id := gen_random_uuid();

    INSERT INTO public.survival_profiles (
      user_id, survivor_name, timezone, current_run_id,
      current_day, level, points, best_day, best_points, active_date
    )
    VALUES (
      v_user_id, v_name, v_tz, v_new_run_id,
      1, 1, 0, 1, 0, v_today
    )
    RETURNING * INTO v_profile;

    INSERT INTO public.daily_days (
      user_id, run_id, day_number, date_key, status
    )
    VALUES (
      v_user_id, v_new_run_id, 1, v_today, 'active'
    );

    RETURN public._build_survival_payload(v_user_id);
  END IF;

  v_today := (now() AT TIME ZONE v_profile.timezone)::date;

  IF v_profile.active_date < v_today THEN
    SELECT * INTO v_day
    FROM public.daily_days
    WHERE user_id = v_user_id
      AND run_id = v_profile.current_run_id
      AND date_key = v_profile.active_date
    FOR UPDATE;

    IF FOUND THEN
      SELECT
        COUNT(*)::integer,
        COUNT(*) FILTER (WHERE completed)::integer
      INTO v_total_tasks, v_completed_tasks
      FROM public.daily_tasks
      WHERE day_id = v_day.id;
    END IF;

    IF v_profile.current_day = 1 AND v_total_tasks = 0 THEN
      IF FOUND THEN
        UPDATE public.daily_days
        SET date_key = v_today
        WHERE id = v_day.id;
      ELSE
        INSERT INTO public.daily_days (user_id, run_id, day_number, date_key, status)
        VALUES (v_user_id, v_profile.current_run_id, 1, v_today, 'active');
      END IF;

      UPDATE public.survival_profiles
      SET active_date = v_today,
          updated_at = now()
      WHERE user_id = v_user_id;

    ELSIF FOUND AND v_day.status = 'survived' AND (v_profile.active_date + 1) = v_today THEN
      v_next_day := v_profile.current_day + 1;

      UPDATE public.survival_profiles
      SET current_day = v_next_day,
          active_date = v_today,
          best_day = GREATEST(best_day, v_next_day),
          updated_at = now()
      WHERE user_id = v_user_id;

      INSERT INTO public.daily_days (user_id, run_id, day_number, date_key, status)
      VALUES (v_user_id, v_profile.current_run_id, v_next_day, v_today, 'active')
      ON CONFLICT (user_id, run_id, date_key) DO NOTHING;

    ELSE
      IF FOUND AND v_day.status <> 'survived' THEN
        UPDATE public.daily_days
        SET status = 'failed'
        WHERE id = v_day.id;

        v_days_survived := GREATEST(0, v_profile.current_day - 1);
        IF v_total_tasks = 0 THEN
          v_failure_reason := format(
            'Added 0 tasks on Day %s (%s) — failed to defend camp before midnight.',
            v_profile.current_day, v_profile.active_date
          );
        ELSE
          v_failure_reason := format(
            'Left %s of %s task(s) unfinished on Day %s (%s) before midnight.',
            (v_total_tasks - v_completed_tasks), v_total_tasks, v_profile.current_day, v_profile.active_date
          );
        END IF;
      ELSE
        v_days_survived := v_profile.current_day;
        v_failure_reason := format(
          'Abandoned camp on %s after surviving Day %s — missed a full 24h cycle.',
          (v_profile.active_date + 1), v_profile.current_day
        );
      END IF;

      INSERT INTO public.run_history (
        user_id, run_id, days_survived, peak_level,
        points_lost, failure_reason, failed_date, acknowledged
      )
      VALUES (
        v_user_id, v_profile.current_run_id, v_days_survived, v_profile.level,
        v_profile.points, v_failure_reason, v_profile.active_date, false
      );

      v_new_run_id := gen_random_uuid();

      UPDATE public.survival_profiles
      SET current_run_id = v_new_run_id,
          current_day = 1,
          level = 1,
          points = 0,
          active_date = v_today,
          updated_at = now()
      WHERE user_id = v_user_id;

      INSERT INTO public.daily_days (user_id, run_id, day_number, date_key, status)
      VALUES (v_user_id, v_new_run_id, 1, v_today, 'active');
    END IF;
  END IF;

  SELECT * INTO v_profile
  FROM public.survival_profiles
  WHERE user_id = v_user_id;

  INSERT INTO public.daily_days (user_id, run_id, day_number, date_key, status)
  VALUES (v_user_id, v_profile.current_run_id, v_profile.current_day, v_profile.active_date, 'active')
  ON CONFLICT (user_id, run_id, date_key) DO NOTHING;

  RETURN public._build_survival_payload(v_user_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.add_daily_task(
  p_title text,
  p_difficulty text DEFAULT 'medium'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_clean_title text;
  v_points integer;
  v_profile public.survival_profiles%ROWTYPE;
  v_day public.daily_days%ROWTYPE;
  v_task_id uuid;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(v_user_id::text));

  v_clean_title := trim(COALESCE(p_title, ''));
  IF char_length(v_clean_title) < 1 OR char_length(v_clean_title) > 160 THEN
    RAISE EXCEPTION 'Task title must be between 1 and 160 characters';
  END IF;

  IF p_difficulty = 'easy' THEN
    v_points := 15;
  ELSIF p_difficulty = 'medium' THEN
    v_points := 30;
  ELSIF p_difficulty = 'hard' THEN
    v_points := 50;
  ELSE
    RAISE EXCEPTION 'Invalid difficulty: %', p_difficulty;
  END IF;

  PERFORM public.init_or_sync_survival('UTC', NULL);

  IF EXISTS (
    SELECT 1 FROM public.run_history
    WHERE user_id = v_user_id AND acknowledged = false
  ) THEN
    RETURN jsonb_build_object(
      'expired', true,
      'task_id', NULL,
      'state', public._build_survival_payload(v_user_id)
    );
  END IF;

  SELECT * INTO v_profile
  FROM public.survival_profiles
  WHERE user_id = v_user_id
  FOR UPDATE;

  SELECT * INTO v_day
  FROM public.daily_days
  WHERE user_id = v_user_id
    AND run_id = v_profile.current_run_id
    AND date_key = v_profile.active_date
  FOR UPDATE;

  INSERT INTO public.daily_tasks (
    user_id, day_id, run_id, title, difficulty, points, completed
  )
  VALUES (
    v_user_id, v_day.id, v_profile.current_run_id, v_clean_title, p_difficulty, v_points, false
  )
  RETURNING id INTO v_task_id;

  IF v_day.status = 'survived' THEN
    UPDATE public.daily_days
    SET status = 'active'
    WHERE id = v_day.id;
  END IF;

  RETURN jsonb_build_object(
    'expired', false,
    'task_id', v_task_id,
    'state', public._build_survival_payload(v_user_id)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.complete_daily_task(p_task_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_profile public.survival_profiles%ROWTYPE;
  v_day public.daily_days%ROWTYPE;
  v_task public.daily_tasks%ROWTYPE;
  v_remaining integer := 0;
  v_total integer := 0;
  v_bonus integer := 0;
  v_leveled_up boolean := false;
  v_day_survived_now boolean := false;
  v_new_points integer;
  v_new_level integer;
  v_prev_points integer;
  v_prev_day_status text;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(v_user_id::text));

  PERFORM public.init_or_sync_survival('UTC', NULL);

  IF EXISTS (
    SELECT 1 FROM public.run_history
    WHERE user_id = v_user_id AND acknowledged = false
  ) THEN
    RETURN jsonb_build_object(
      'expired', true,
      'task_id', NULL,
      'state', public._build_survival_payload(v_user_id)
    );
  END IF;

  SELECT * INTO v_profile
  FROM public.survival_profiles
  WHERE user_id = v_user_id
  FOR UPDATE;

  v_prev_points := v_profile.points;

  SELECT * INTO v_day
  FROM public.daily_days
  WHERE user_id = v_user_id
    AND run_id = v_profile.current_run_id
    AND date_key = v_profile.active_date
  FOR UPDATE;

  v_prev_day_status := v_day.status;

  SELECT * INTO v_task
  FROM public.daily_tasks
  WHERE id = p_task_id
    AND user_id = v_user_id
    AND day_id = v_day.id
    AND run_id = v_profile.current_run_id
  FOR UPDATE;

  IF NOT FOUND THEN
    IF EXISTS (
      SELECT 1 FROM public.daily_tasks
      WHERE id = p_task_id AND user_id = v_user_id
    ) THEN
      RETURN jsonb_build_object(
        'expired', true,
        'points_earned', 0,
        'bonus_earned', 0,
        'day_survived_now', false,
        'leveled_up', false,
        'state', public._build_survival_payload(v_user_id)
      );
    END IF;
    RAISE EXCEPTION 'Task not found';
  END IF;

  IF v_task.completed THEN
    RETURN jsonb_build_object(
      'expired', false,
      'points_earned', 0,
      'bonus_earned', 0,
      'day_survived_now', false,
      'leveled_up', false,
      'state', public._build_survival_payload(v_user_id)
    );
  END IF;

  UPDATE public.daily_tasks
  SET completed = true,
      completed_at = now()
  WHERE id = v_task.id;

  v_new_points := v_profile.points + v_task.points;
  v_new_level := v_profile.level;

  SELECT
    COUNT(*)::integer,
    COUNT(*) FILTER (WHERE NOT completed)::integer
  INTO v_total, v_remaining
  FROM public.daily_tasks
  WHERE day_id = v_day.id;

  IF v_total >= 1 AND v_remaining = 0 THEN
    v_day_survived_now := (v_prev_day_status <> 'survived');

    IF v_day.bonus_awarded = 0 THEN
      v_bonus := 25 * v_day.day_number;
      v_new_points := v_new_points + v_bonus;
      IF v_day.day_number + 1 > v_profile.level THEN
        v_new_level := v_day.day_number + 1;
        v_leveled_up := true;
      END IF;

      UPDATE public.daily_days
      SET status = 'survived',
          bonus_awarded = v_bonus,
          survived_at = COALESCE(survived_at, now())
      WHERE id = v_day.id;
    ELSE
      UPDATE public.daily_days
      SET status = 'survived',
          survived_at = COALESCE(survived_at, now())
      WHERE id = v_day.id;
    END IF;
  END IF;

  UPDATE public.survival_profiles
  SET points = v_new_points,
      level = v_new_level,
      best_points = GREATEST(best_points, v_new_points),
      best_day = GREATEST(best_day, CASE WHEN v_remaining = 0 AND v_total >= 1 THEN v_day.day_number ELSE best_day END),
      updated_at = now()
  WHERE user_id = v_user_id;

  RETURN jsonb_build_object(
    'expired', false,
    'points_earned', v_task.points,
    'bonus_earned', v_bonus,
    'day_survived_now', v_day_survived_now,
    'leveled_up', v_leveled_up,
    'previous_points', v_prev_points,
    'new_level', v_new_level,
    'state', public._build_survival_payload(v_user_id)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.acknowledge_run_failure(p_history_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id uuid := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(v_user_id::text));

  UPDATE public.run_history
  SET acknowledged = true
  WHERE id = p_history_id
    AND user_id = v_user_id;

  RETURN public._build_survival_payload(v_user_id);
END;
$$;

REVOKE ALL ON FUNCTION public._build_survival_payload(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.init_or_sync_survival(text, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.add_daily_task(text, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.complete_daily_task(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.acknowledge_run_failure(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.init_or_sync_survival(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_daily_task(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_daily_task(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.acknowledge_run_failure(uuid) TO authenticated;

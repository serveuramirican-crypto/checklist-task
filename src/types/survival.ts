export type TaskDifficulty = 'easy' | 'medium' | 'hard';

export type DayStatus = 'active' | 'survived' | 'failed';

export interface SurvivalProfile {
  user_id: string;
  survivor_name: string;
  timezone: string;
  current_run_id: string;
  current_day: number;
  level: number;
  points: number;
  best_day: number;
  best_points: number;
  active_date: string;
  created_at: string;
  updated_at: string;
}

export interface DailyDayRecord {
  id: string;
  user_id: string;
  run_id: string;
  day_number: number;
  date_key: string;
  status: DayStatus;
  bonus_awarded: number;
  survived_at: string | null;
  created_at: string;
}

export interface DailyTask {
  id: string;
  user_id: string;
  day_id: string;
  run_id: string;
  title: string;
  difficulty: TaskDifficulty;
  points: 15 | 30 | 50;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface RunHistoryRecord {
  id: string;
  user_id: string;
  run_id: string;
  days_survived: number;
  peak_level: number;
  points_lost: number;
  failure_reason: string;
  failed_date: string;
  acknowledged: boolean;
  created_at: string;
}

export interface SurvivalStatePayload {
  profile: SurvivalProfile;
  current_day_record: DailyDayRecord;
  tasks: DailyTask[];
  unacknowledged_death: RunHistoryRecord | null;
  graveyard: RunHistoryRecord[];
  server_now: string;
}

export interface AddTaskRpcResult {
  expired?: boolean;
  task_id: string | null;
  state: SurvivalStatePayload;
}

export interface CompleteTaskRpcResult {
  expired: boolean;
  points_earned: number;
  bonus_earned: number;
  day_survived_now: boolean;
  leveled_up: boolean;
  previous_points?: number;
  new_level?: number;
  state: SurvivalStatePayload;
}

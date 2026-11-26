import { useState, type FormEvent } from 'react';
import {
  AlertTriangle,
  Check,
  Lock,
  Plus,
  ShieldCheck,
  Swords,
} from 'lucide-react';
import { DIFFICULTY_CONFIG } from '../game/progression';
import { useI18n } from '../i18n/I18nContext';
import type { TranslationKey } from '../i18n/translations';
import type { DailyDayRecord, DailyTask, TaskDifficulty } from '../types/survival';

interface QuestBoardProps {
  dayRecord: DailyDayRecord;
  tasks: DailyTask[];
  busyTaskId: string | null;
  addingTask: boolean;
  onAddTask: (title: string, difficulty: TaskDifficulty) => Promise<void>;
  onCompleteTask: (task: DailyTask) => Promise<void>;
}

export function QuestBoard({
  dayRecord,
  tasks,
  busyTaskId,
  addingTask,
  onAddTask,
  onCompleteTask,
}: QuestBoardProps) {
  const { t } = useI18n();
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('medium');
  const [confirmReopen, setConfirmReopen] = useState(false);

  const completedCount = tasks.filter((item) => item.completed).length;
  const totalCount = tasks.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const dailyBonus = 25 * dayRecord.day_number;

  const submitTask = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    await onAddTask(trimmed, difficulty);
    setTitle('');
    setConfirmReopen(false);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (dayRecord.status === 'survived' && !confirmReopen) {
      setConfirmReopen(true);
      return;
    }
    await submitTask();
  };

  return (
    <section className="pixel-panel flex h-full flex-col p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 font-pixel text-xs text-amber-300">
            <Swords className="h-4 w-4 shrink-0 text-orange-400" />
            {t('quest.title', { day: dayRecord.day_number })}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {t('quest.subtitle', { time: '00:00', bonus: dailyBonus })}
          </p>
        </div>

        <div className="shrink-0 text-end">
          <span className="font-pixel text-xs text-slate-200" dir="ltr">
            {completedCount}/{totalCount}
          </span>
          <div className="text-[10px] text-slate-400">
            {t('quest.clearedPct', { pct: progressPct })}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 h-3 w-full overflow-hidden border border-slate-700 bg-slate-950 p-0.5">
        <div
          className={`h-full transition-all duration-300 ${
            dayRecord.status === 'survived'
              ? 'bg-emerald-400'
              : 'bg-gradient-to-r from-orange-500 to-amber-400'
          }`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Survival Banner when Day is Cleared */}
      {dayRecord.status === 'survived' && (
        <div className="mt-3 flex items-center gap-2.5 border border-emerald-500/50 bg-emerald-950/40 px-3 py-2.5 text-xs text-emerald-200">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>
            {t('quest.daySurvivedBanner', {
              day: dayRecord.day_number,
              nextDay: dayRecord.day_number + 1,
            })}
          </span>
        </div>
      )}

      {/* Add Task Form */}
      <form
        onSubmit={handleFormSubmit}
        className="mt-4 space-y-3 border border-slate-800 bg-slate-900/60 p-3"
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            maxLength={160}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (confirmReopen) setConfirmReopen(false);
            }}
            placeholder={t('quest.inputPlaceholder')}
            className="flex-1 border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            disabled={addingTask || !title.trim()}
            className="pixel-btn inline-flex items-center justify-center gap-1.5 border-amber-400 bg-amber-500/20 px-4 py-2 font-pixel text-[10px] text-amber-200 disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5 shrink-0" />
            {addingTask ? t('quest.locking') : t('quest.lockTask')}
          </button>
        </div>

        {/* Difficulty Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {(['easy', 'medium', 'hard'] as TaskDifficulty[]).map((diff) => {
              const cfg = DIFFICULTY_CONFIG[diff];
              const active = difficulty === diff;
              const diffLabel = t(`diff.${diff}.label` as TranslationKey);
              return (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`border px-2.5 py-1 text-[11px] font-bold transition ${
                    active
                      ? cfg.colorClass
                      : 'border-slate-700 bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {diffLabel} (+{cfg.points} SP)
                </button>
              );
            })}
          </div>

          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            <Lock className="h-3 w-3 shrink-0 text-amber-400" />
            {t('quest.lockedHint')}
          </span>
        </div>

        {confirmReopen && (
          <div className="border border-orange-500/60 bg-orange-950/50 p-3 text-xs text-orange-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
              <div className="flex-1">
                <p className="font-bold">
                  {t('quest.reopenTitle', { day: dayRecord.day_number })}
                </p>
                <p className="mt-0.5 text-orange-200/80">
                  {t('quest.reopenDesc')}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={submitTask}
                    disabled={addingTask}
                    className="border border-orange-400 bg-orange-500/20 px-3 py-1 font-bold text-orange-100 hover:bg-orange-500/30"
                  >
                    {t('quest.reopenConfirm')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReopen(false)}
                    className="border border-slate-700 bg-slate-900 px-3 py-1 text-slate-300"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Task List */}
      <div className="mt-4 flex-1 space-y-2 overflow-y-auto pe-1">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-slate-700 bg-slate-950/50 px-4 py-10 text-center">
            <p className="font-pixel text-[11px] text-slate-300">
              {t('quest.emptyTitle')}
            </p>
            <p className="mt-2 max-w-sm text-xs text-slate-400">
              {dayRecord.day_number === 1
                ? t('quest.emptyDay1')
                : t('quest.emptyDayN', { day: dayRecord.day_number })}
            </p>
          </div>
        ) : (
          tasks.map((task) => {
            const cfg = DIFFICULTY_CONFIG[task.difficulty];
            const isBusy = busyTaskId === task.id;
            const diffTag = t(`diff.${task.difficulty}.tag` as TranslationKey);
            return (
              <div
                key={task.id}
                className={`flex items-center justify-between gap-3 border px-3 py-2.5 transition ${
                  task.completed
                    ? 'border-emerald-900/60 bg-emerald-950/20 opacity-85'
                    : 'border-slate-700/80 bg-slate-900/80 hover:border-amber-500/50'
                }`}
              >
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <button
                    type="button"
                    disabled={task.completed || busyTaskId !== null}
                    onClick={() => onCompleteTask(task)}
                    aria-label={
                      task.completed
                        ? t('quest.completedAria', { title: task.title })
                        : t('quest.completeAria', { title: task.title })
                    }
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border-2 transition ${
                      task.completed
                        ? 'border-emerald-400 bg-emerald-500/25 text-emerald-300'
                        : isBusy
                          ? 'animate-pulse border-amber-300 bg-amber-500/20 text-transparent'
                          : 'border-amber-400/70 bg-slate-950 text-transparent hover:border-emerald-400 hover:bg-emerald-500/15'
                    } disabled:cursor-default`}
                  >
                    <Check className="h-4 w-4" />
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      dir="auto"
                      className={`break-words text-sm ${
                        task.completed
                          ? 'text-slate-400 line-through'
                          : 'font-medium text-slate-100'
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px]">
                      <span className={`border px-1.5 py-0.5 font-bold ${cfg.colorClass}`}>
                        {diffTag}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Lock className="h-2.5 w-2.5" /> {t('quest.lockedBadge')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-end">
                  <span
                    dir="ltr"
                    className={`font-pixel text-[10px] ${
                      task.completed ? 'text-emerald-400' : 'text-amber-300'
                    }`}
                  >
                    +{task.points} SP
                  </span>
                  {task.completed && (
                    <div className="mt-0.5 text-[10px] font-bold text-emerald-500">
                      {t('quest.claimedBadge')}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

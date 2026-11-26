import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Shield, Sparkles, Swords, Tent } from 'lucide-react';
import { supabase } from './lib/supabase';
import { soundEngine } from './game/audio';
import {
  getCharacterLoadout,
  getNewlyUnlockedGearEntries,
} from './game/progression';
import { getBrowserTimeZone, getMidnightCountdown } from './game/time';
import {
  SurvivalCanvas,
  type CanvasEventBurst,
} from './canvas/SurvivalCanvas';
import { AuthScreen } from './components/AuthScreen';
import { TopHud } from './components/TopHud';
import { QuestBoard } from './components/QuestBoard';
import { NextDayPreview } from './components/NextDayPreview';
import { GearCodexModal } from './components/GearCodexModal';
import { GraveyardModal } from './components/GraveyardModal';
import { DeathModal } from './components/DeathModal';
import {
  LevelUpBanner,
  type LevelUpNotification,
} from './components/LevelUpBanner';
import { useI18n } from './i18n/I18nContext';
import { getGearDescriptionKey } from './i18n/dynamic';
import type {
  AddTaskRpcResult,
  CompleteTaskRpcResult,
  DailyTask,
  SurvivalStatePayload,
  TaskDifficulty,
} from './types/survival';

export function App() {
  const { t } = useI18n();

  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const [state, setState] = useState<SurvivalStatePayload | null>(null);
  const [loadingState, setLoadingState] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [addingTask, setAddingTask] = useState(false);
  const [busyTaskId, setBusyTaskId] = useState<string | null>(null);
  const [acknowledgingDeath, setAcknowledgingDeath] = useState(false);

  const [now, setNow] = useState(() => new Date());
  const [serverOffsetMs, setServerOffsetMs] = useState(0);
  const [muted, setMuted] = useState(() => soundEngine.isMuted());

  const [codexOpen, setCodexOpen] = useState(false);
  const [graveyardOpen, setGraveyardOpen] = useState(false);
  const [levelUpNotice, setLevelUpNotice] = useState<LevelUpNotification | null>(null);
  const [burst, setBurst] = useState<CanvasEventBurst | null>(null);

  const burstCounterRef = useRef(0);
  const syncInFlightRef = useRef(false);
  const lastRolloverCheckRef = useRef<string | null>(null);

  const triggerBurst = useCallback(
    (kind: CanvasEventBurst['kind'], label: string) => {
      burstCounterRef.current += 1;
      setBurst({ id: burstCounterRef.current, kind, label });
    },
    []
  );

  const applyServerState = useCallback((payload: SurvivalStatePayload) => {
    setState(payload);
    const parsedServerNow = Date.parse(payload.server_now);
    if (!Number.isNaN(parsedServerNow)) {
      setServerOffsetMs(parsedServerNow - Date.now());
    }
  }, []);

  const syncSurvivalState = useCallback(
    async (activeSession: Session | null) => {
      if (!activeSession) {
        setState(null);
        return;
      }
      if (syncInFlightRef.current) return;
      syncInFlightRef.current = true;

      setLoadingState(true);
      setErrorMsg(null);
      try {
        const meta = activeSession.user.user_metadata ?? {};
        const tz =
          typeof meta.timezone === 'string' && meta.timezone
            ? meta.timezone
            : getBrowserTimeZone();
        const name =
          typeof meta.survivor_name === 'string' && meta.survivor_name
            ? meta.survivor_name
            : null;

        const { data, error } = await supabase.rpc('init_or_sync_survival', {
          p_timezone: tz,
          p_survivor_name: name,
        });

        if (error) throw error;
        const payload = data as SurvivalStatePayload;
        applyServerState(payload);
        lastRolloverCheckRef.current = payload.profile.active_date;

        if (payload.unacknowledged_death) {
          soundEngine.playPerished();
          triggerBurst('death', t('canvas.burstPerished'));
        }
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : t('app.syncError'));
      } finally {
        syncInFlightRef.current = false;
        setLoadingState(false);
      }
    },
    [applyServerState, t, triggerBurst]
  );

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);
      if (nextSession) {
        void syncSurvivalState(nextSession);
      } else {
        setState(null);
        setLevelUpNotice(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [syncSurvivalState]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const syncedNow = useMemo(
    () => new Date(now.getTime() + serverOffsetMs),
    [now, serverOffsetMs]
  );

  const countdown = useMemo(() => {
    const tz = state?.profile.timezone ?? getBrowserTimeZone();
    const status = state?.current_day_record.status ?? 'active';
    return getMidnightCountdown(syncedNow, tz, status);
  }, [syncedNow, state?.profile.timezone, state?.current_day_record.status]);

  useEffect(() => {
    if (!session || !state || loadingState || syncInFlightRef.current) return;
    if (
      countdown.localDateKey !== state.profile.active_date &&
      lastRolloverCheckRef.current !== countdown.localDateKey
    ) {
      lastRolloverCheckRef.current = countdown.localDateKey;
      void syncSurvivalState(session);
    }
  }, [countdown.localDateKey, loadingState, session, state, syncSurvivalState]);

  const loadout = useMemo(() => {
    if (!state) return getCharacterLoadout(1, 0);
    return getCharacterLoadout(state.profile.level, state.profile.points);
  }, [state]);

  const handleAddTask = async (title: string, difficulty: TaskDifficulty) => {
    setAddingTask(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase.rpc('add_daily_task', {
        p_title: title,
        p_difficulty: difficulty,
      });
      if (error) throw error;
      const result = data as AddTaskRpcResult;
      applyServerState(result.state);
      lastRolloverCheckRef.current = result.state.profile.active_date;

      if (result.expired || result.state.unacknowledged_death) {
        soundEngine.playPerished();
        triggerBurst('death', t('canvas.burstExpired'));
        return;
      }
      soundEngine.playLockTask();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : t('app.addTaskError'));
    } finally {
      setAddingTask(false);
    }
  };

  const handleCompleteTask = async (task: DailyTask) => {
    if (!state || busyTaskId !== null) return;
    const prevLevel = state.profile.level;
    const prevPoints = state.profile.points;

    setBusyTaskId(task.id);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase.rpc('complete_daily_task', {
        p_task_id: task.id,
      });
      if (error) throw error;
      const result = data as CompleteTaskRpcResult;
      applyServerState(result.state);
      lastRolloverCheckRef.current = result.state.profile.active_date;

      if (result.expired || result.state.unacknowledged_death) {
        soundEngine.playPerished();
        triggerBurst('death', t('canvas.burstExpired'));
        return;
      }

      if (result.leveled_up || result.bonus_earned > 0) {
        const nextLevel = result.state.profile.level;
        const nextPoints = result.state.profile.points;
        const unlockedEntries = getNewlyUnlockedGearEntries(
          prevLevel,
          prevPoints,
          nextLevel,
          nextPoints
        );
        soundEngine.playDaySurvived();
        triggerBurst(
          'level_up',
          t('canvas.burstLevelUp', {
            level: nextLevel,
            points: result.points_earned + result.bonus_earned,
          })
        );
        setLevelUpNotice({
          daySurvived: result.state.current_day_record.day_number,
          newLevel: nextLevel,
          bonusPoints: result.bonus_earned,
          unlockedEntries,
        });
      } else if (result.day_survived_now) {
        soundEngine.playDaySurvived();
        triggerBurst(
          'level_up',
          t('canvas.burstReSecured', { points: result.points_earned })
        );
      } else if (result.points_earned > 0) {
        const unlockedEntries = getNewlyUnlockedGearEntries(
          prevLevel,
          prevPoints,
          result.state.profile.level,
          result.state.profile.points
        );
        soundEngine.playTaskComplete();
        triggerBurst(
          unlockedEntries.length > 0 ? 'level_up' : 'task',
          unlockedEntries.length > 0
            ? `${unlockedEntries[0].name}!`
            : t('canvas.burstPoints', { points: result.points_earned })
        );
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : t('app.completeTaskError'));
    } finally {
      setBusyTaskId(null);
    }
  };

  const handleAcknowledgeDeath = async (historyId: string) => {
    setAcknowledgingDeath(true);
    try {
      const { data, error } = await supabase.rpc('acknowledge_run_failure', {
        p_history_id: historyId,
      });
      if (error) throw error;
      const nextState = data as SurvivalStatePayload;
      applyServerState(nextState);
      lastRolloverCheckRef.current = nextState.profile.active_date;
      setLevelUpNotice(null);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : t('app.resetRunError'));
    } finally {
      setAcknowledgingDeath(false);
    }
  };

  const handleToggleMute = () => {
    const next = !muted;
    soundEngine.setMuted(next);
    setMuted(next);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setState(null);
    setLevelUpNotice(null);
    setCodexOpen(false);
    setGraveyardOpen(false);
    setBurst(null);
    setErrorMsg(null);
    lastRolloverCheckRef.current = null;
  };

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center font-pixel text-xs text-amber-300">
        {t('app.loadingLink')}
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  if (!state) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="font-pixel text-xs text-amber-300">
          {loadingState ? t('app.initializingCamp') : t('app.unableToLoad')}
        </p>
        {errorMsg && (
          <p className="max-w-md border border-red-500/50 bg-red-950/50 p-3 text-xs text-red-200">
            {errorMsg}
          </p>
        )}
        {!loadingState && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => void syncSurvivalState(session)}
              className="pixel-btn border-amber-400 bg-amber-500/20 px-4 py-2 font-pixel text-[10px] text-amber-200"
            >
              {t('app.retry')}
            </button>
            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="border border-slate-700 bg-slate-900 px-4 py-2 text-xs text-slate-300"
            >
              {t('app.signOut')}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-4 px-3 py-4 sm:px-6 sm:py-5">
      <TopHud
        profile={state.profile}
        countdown={countdown}
        graveyardCount={state.graveyard.length}
        muted={muted}
        onToggleMute={handleToggleMute}
        onOpenCodex={() => setCodexOpen(true)}
        onOpenGraveyard={() => setGraveyardOpen(true)}
        onSignOut={() => void handleSignOut()}
      />

      {errorMsg && (
        <div className="border border-red-500/60 bg-red-950/60 px-4 py-2.5 text-xs text-red-200">
          {errorMsg}
        </div>
      )}

      <LevelUpBanner
        notification={levelUpNotice}
        onDismiss={() => setLevelUpNotice(null)}
      />

      <main className="grid flex-1 gap-4 lg:grid-cols-12">
        {/* Pixel Canvas + Current Equipment Loadout */}
        <div className="flex flex-col gap-4 lg:col-span-7">
          <SurvivalCanvas
            loadout={loadout}
            urgencyPhase={countdown.phase}
            hasTasksToday={state.tasks.length > 0}
            isDead={Boolean(state.unacknowledged_death)}
            dayNumber={state.profile.current_day}
            level={state.profile.level}
            points={state.profile.points}
            burst={burst}
          />

          {/* Equipment Summary Cards */}
          <div className="pixel-panel grid gap-3 p-4 sm:grid-cols-2">
            <div className="border border-slate-800 bg-slate-900/70 p-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Shield className="h-4 w-4 shrink-0" />
                <span dir="ltr">{loadout.armor.name}</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                {t(getGearDescriptionKey('armor', loadout.armor.id))}
              </p>
            </div>

            <div className="border border-slate-800 bg-slate-900/70 p-3">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
                <Swords className="h-4 w-4 shrink-0" />
                <span dir="ltr">{loadout.weapon.name}</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                {t(getGearDescriptionKey('weapon', loadout.weapon.id))}
              </p>
            </div>

            <div className="border border-slate-800 bg-slate-900/70 p-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <Tent className="h-4 w-4 shrink-0" />
                <span dir="ltr">{loadout.camp.name}</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                {t(getGearDescriptionKey('camp', loadout.camp.id))}
              </p>
            </div>

            <div className="border border-slate-800 bg-slate-900/70 p-3">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                <Sparkles className="h-4 w-4 shrink-0" />
                {t('equip.companionsTitle', { count: loadout.companions.length })}
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                {loadout.companions.length > 0 ? (
                  <span dir="ltr">
                    {loadout.companions.map((c) => c.name).join(' · ')}
                  </span>
                ) : (
                  t('equip.companionsEmpty')
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Daily Quest Board */}
        <div className="lg:col-span-5">
          <QuestBoard
            dayRecord={state.current_day_record}
            tasks={state.tasks}
            busyTaskId={busyTaskId}
            addingTask={addingTask}
            onAddTask={handleAddTask}
            onCompleteTask={handleCompleteTask}
          />
        </div>
      </main>

      {/* Feature 1: Next Day Preview & Upcoming Rewards */}
      <NextDayPreview
        profile={state.profile}
        dayRecord={state.current_day_record}
        hasUnacknowledgedDeath={Boolean(state.unacknowledged_death)}
      />

      <GearCodexModal
        open={codexOpen}
        currentLevel={state.profile.level}
        currentPoints={state.profile.points}
        onClose={() => setCodexOpen(false)}
      />

      <GraveyardModal
        open={graveyardOpen}
        runs={state.graveyard}
        onClose={() => setGraveyardOpen(false)}
      />

      <DeathModal
        death={state.unacknowledged_death}
        busy={acknowledgingDeath}
        onAcknowledge={handleAcknowledgeDeath}
      />
    </div>
  );
}

export default App;

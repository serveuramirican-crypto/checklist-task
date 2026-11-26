import {
  BookOpen,
  Clock,
  Flame,
  LogOut,
  Skull,
  Trophy,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { SurvivalProfile } from '../types/survival';
import type { MidnightCountdown } from '../game/time';
import { useI18n } from '../i18n/I18nContext';
import { LanguageSwitch } from './LanguageSwitch';

interface TopHudProps {
  profile: SurvivalProfile;
  countdown: MidnightCountdown;
  graveyardCount: number;
  muted: boolean;
  onToggleMute: () => void;
  onOpenCodex: () => void;
  onOpenGraveyard: () => void;
  onSignOut: () => void;
}

export function TopHud({
  profile,
  countdown,
  graveyardCount,
  muted,
  onToggleMute,
  onOpenCodex,
  onOpenGraveyard,
  onSignOut,
}: TopHudProps) {
  const { t } = useI18n();

  const timerColor =
    countdown.phase === 'survived'
      ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300'
      : countdown.phase === 'critical'
        ? 'animate-pulse border-red-500/70 bg-red-950/60 text-red-300'
        : countdown.phase === 'dusk'
          ? 'border-orange-500/50 bg-orange-950/40 text-orange-300'
          : 'border-slate-700 bg-slate-900/90 text-slate-200';

  return (
    <header className="pixel-panel px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Title & Survivor */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-amber-400/60 bg-amber-500/15">
            <Flame className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-pixel text-xs text-amber-300 sm:text-sm" dir="ltr">
                LAST NIGHTFALL
              </h1>
              <span
                className="border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-300"
                dir="auto"
              >
                {profile.survivor_name}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-slate-400">
              {t('hud.timezoneActive', {
                tz: profile.timezone,
                date: profile.active_date,
              })}
            </p>
          </div>
        </div>

        {/* Core Stats Strip */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <div className="border border-amber-500/40 bg-slate-900/90 px-3 py-1.5 text-center">
            <div className="text-[10px] uppercase tracking-wider text-slate-400">
              {t('hud.day')}
            </div>
            <div className="font-pixel text-xs text-amber-300">
              {profile.current_day}
            </div>
          </div>

          <div className="border border-sky-500/40 bg-slate-900/90 px-3 py-1.5 text-center">
            <div className="text-[10px] uppercase tracking-wider text-slate-400">
              {t('hud.level')}
            </div>
            <div className="font-pixel text-xs text-sky-300">
              {profile.level}
            </div>
          </div>

          <div className="border border-emerald-500/40 bg-slate-900/90 px-3 py-1.5 text-center">
            <div className="text-[10px] uppercase tracking-wider text-slate-400">
              {t('hud.points')}
            </div>
            <div className="font-pixel text-xs text-emerald-300">
              {profile.points}
            </div>
          </div>

          <div className="hidden border border-slate-700 bg-slate-900/90 px-3 py-1.5 text-center sm:block">
            <div className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider text-slate-400">
              <Trophy className="h-3 w-3 text-amber-400" /> {t('hud.best')}
            </div>
            <div className="text-xs font-bold text-slate-200" dir="ltr">
              {t('hud.bestValue', {
                day: profile.best_day,
                points: profile.best_points,
              })}
            </div>
          </div>

          {/* Midnight Countdown */}
          <div className={`border px-3 py-1.5 ${timerColor}`}>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider opacity-85">
              <Clock className="h-3 w-3 shrink-0" />
              {countdown.phase === 'survived'
                ? t('hud.nextDayIn')
                : t('hud.deadline')}
            </div>
            <div className="font-pixel text-xs tracking-wider" dir="ltr">
              {countdown.formatted}
            </div>
          </div>
        </div>

        {/* Action Buttons + Language Switch */}
        <div className="flex flex-wrap items-center gap-2">
          <LanguageSwitch />

          <button
            type="button"
            onClick={onOpenCodex}
            className="flex items-center gap-1.5 border border-slate-700 bg-slate-900 px-2.5 py-2 text-xs font-medium text-slate-200 transition hover:border-amber-400/60 hover:text-amber-200"
            title={t('hud.codexTooltip')}
          >
            <BookOpen className="h-4 w-4 shrink-0 text-amber-400" />
            <span className="hidden md:inline">{t('hud.codex')}</span>
          </button>

          <button
            type="button"
            onClick={onOpenGraveyard}
            className="flex items-center gap-1.5 border border-slate-700 bg-slate-900 px-2.5 py-2 text-xs font-medium text-slate-200 transition hover:border-red-400/60 hover:text-red-200"
            title={t('hud.graveyardTooltip')}
          >
            <Skull className="h-4 w-4 shrink-0 text-red-400" />
            <span className="hidden md:inline">{t('hud.graveyard')}</span>
            {graveyardCount > 0 && (
              <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-bold text-red-300">
                {graveyardCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            className="border border-slate-700 bg-slate-900 p-2 text-slate-300 transition hover:border-slate-500 hover:text-white"
            title={muted ? t('hud.unmuteTooltip') : t('hud.muteTooltip')}
            aria-label={muted ? t('hud.unmuteAria') : t('hud.muteAria')}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={onSignOut}
            className="border border-slate-700 bg-slate-900 p-2 text-slate-300 transition hover:border-red-500/60 hover:text-red-300"
            title={t('hud.signOutTooltip')}
            aria-label={t('hud.signOutAria')}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

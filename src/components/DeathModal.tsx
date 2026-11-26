import { RotateCcw, Skull } from 'lucide-react';
import type { RunHistoryRecord } from '../types/survival';
import { useI18n } from '../i18n/I18nContext';
import { formatFailureReason } from '../i18n/dynamic';

interface DeathModalProps {
  death: RunHistoryRecord | null;
  busy: boolean;
  onAcknowledge: (historyId: string) => Promise<void>;
}

export function DeathModal({ death, busy, onAcknowledge }: DeathModalProps) {
  const { t } = useI18n();

  if (!death) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="death-title"
    >
      <div className="pixel-panel-danger w-full max-w-lg p-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border-2 border-red-500/70 bg-red-950/60">
          <Skull className="h-8 w-8 text-red-400" />
        </div>

        <h2
          id="death-title"
          className="font-pixel text-base text-red-400 sm:text-lg"
        >
          {t('death.title')}
        </h2>
        <p className="mt-2 text-xs text-red-200/80">
          {formatFailureReason(death.failure_reason, t)}
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2 border border-red-900/60 bg-black/50 p-3 text-center">
          <div>
            <div className="text-[10px] uppercase text-slate-400">
              {t('death.daysSurvived')}
            </div>
            <div className="mt-1 font-pixel text-xs text-slate-100">
              {death.days_survived}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-slate-400">
              {t('death.peakLevel')}
            </div>
            <div className="mt-1 font-pixel text-xs text-slate-100">
              {death.peak_level}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-slate-400">
              {t('death.pointsLost')}
            </div>
            <div className="mt-1 font-pixel text-xs text-red-400" dir="ltr">
              -{death.points_lost}
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-300">{t('death.resetSummary')}</p>

        <button
          type="button"
          disabled={busy}
          onClick={() => onAcknowledge(death.id)}
          className="pixel-btn mt-5 inline-flex w-full items-center justify-center gap-2 border-red-400 bg-red-600/25 px-4 py-3 font-pixel text-xs text-red-100 disabled:opacity-50"
        >
          <RotateCcw className="h-4 w-4 shrink-0" />
          {busy ? t('death.respawning') : t('death.respawn')}
        </button>
      </div>
    </div>
  );
}

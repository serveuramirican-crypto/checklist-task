import { Skull, X } from 'lucide-react';
import type { RunHistoryRecord } from '../types/survival';
import { useI18n } from '../i18n/I18nContext';
import { formatFailureReason } from '../i18n/dynamic';

interface GraveyardModalProps {
  open: boolean;
  runs: RunHistoryRecord[];
  onClose: () => void;
}

export function GraveyardModal({ open, runs, onClose }: GraveyardModalProps) {
  const { t } = useI18n();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label={t('graveyard.ariaLabel')}
    >
      <div className="pixel-panel flex max-h-[85vh] w-full max-w-2xl flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <Skull className="h-5 w-5 shrink-0 text-red-400" />
            <div>
              <h2 className="font-pixel text-xs text-red-300">
                {t('graveyard.title')}
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                {t('graveyard.subtitle')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 border border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:text-white"
            aria-label={t('graveyard.closeAria')}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 overflow-y-auto p-5">
          {runs.length === 0 ? (
            <div className="border border-dashed border-slate-700 p-8 text-center text-xs text-slate-400">
              {t('graveyard.empty')}
            </div>
          ) : (
            runs.map((run) => {
              const dayWord =
                run.days_survived === 1
                  ? t('graveyard.daySingular')
                  : t('graveyard.dayPlural');
              return (
                <div
                  key={run.id}
                  className="border border-red-900/50 bg-red-950/15 p-3.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-pixel text-[10px] text-red-300">
                      {t('graveyard.survivedMeta', {
                        days: run.days_survived,
                        dayWord,
                        level: run.peak_level,
                      })}
                    </span>
                    <span className="text-xs font-bold text-red-400">
                      {t('graveyard.pointsLost', { points: run.points_lost })}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-300">
                    {formatFailureReason(run.failure_reason, t)}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    {t('graveyard.failedDate', { date: run.failed_date })}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

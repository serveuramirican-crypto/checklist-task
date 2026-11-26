import { Sparkles, X } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import type { UnlockedGearEntry } from '../game/progression';
import type { TranslationKey } from '../i18n/translations';

export interface LevelUpNotification {
  daySurvived: number;
  newLevel: number;
  bonusPoints: number;
  unlockedEntries: UnlockedGearEntry[];
}

interface LevelUpBannerProps {
  notification: LevelUpNotification | null;
  onDismiss: () => void;
}

const SLOT_KEY_MAP: Record<UnlockedGearEntry['slot'], TranslationKey> = {
  armor: 'preview.slotArmor',
  weapon: 'preview.slotWeapon',
  camp: 'preview.slotCamp',
  companion: 'preview.slotCompanion',
};

export function LevelUpBanner({ notification, onDismiss }: LevelUpBannerProps) {
  const { t } = useI18n();

  if (!notification) return null;

  return (
    <div className="pixel-panel border-amber-400/70 bg-gradient-to-r from-amber-950/70 via-slate-900 to-emerald-950/60 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-amber-400/70 bg-amber-500/20">
            <Sparkles className="h-5 w-5 text-amber-300" />
          </div>
          <div>
            <h3 className="font-pixel text-xs text-amber-300">
              {t('levelup.title', {
                day: notification.daySurvived,
                level: notification.newLevel,
              })}
            </h3>
            <p className="mt-1 text-xs text-slate-200">
              {t('levelup.bonusEarned', { bonus: notification.bonusPoints })}
            </p>
            {notification.unlockedEntries.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {notification.unlockedEntries.map((entry) => (
                  <span
                    key={`${entry.slot}-${entry.name}`}
                    className="border border-amber-400/50 bg-amber-500/15 px-2 py-0.5 text-[11px] font-bold text-amber-200"
                  >
                    {t('levelup.newPrefix')} {t(SLOT_KEY_MAP[entry.slot])}:{' '}
                    <span dir="ltr">{entry.name}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 border border-slate-700 bg-slate-900 p-1 text-slate-400 hover:text-white"
          aria-label={t('levelup.dismissAria')}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

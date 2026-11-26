import { CheckCircle2, Lock, X } from 'lucide-react';
import {
  ARMOR_TIERS,
  CAMP_TIERS,
  COMPANION_TIERS,
  WEAPON_TIERS,
  type ArmorId,
  type CampId,
  type CompanionId,
  type GearTier,
  type WeaponId,
} from '../game/progression';
import { useI18n } from '../i18n/I18nContext';
import { getGearDescriptionKey } from '../i18n/dynamic';

interface GearCodexModalProps {
  open: boolean;
  currentLevel: number;
  currentPoints: number;
  onClose: () => void;
}

const RARITY_STYLES: Record<GearTier['rarity'], string> = {
  common: 'text-slate-300 border-slate-600',
  uncommon: 'text-emerald-300 border-emerald-600/60',
  rare: 'text-sky-300 border-sky-500/60',
  epic: 'text-purple-300 border-purple-500/60',
  legendary: 'text-orange-300 border-orange-500/70',
  mythic: 'text-amber-300 border-amber-400/80',
};

function TierSection({
  title,
  slot,
  tiers,
  currentLevel,
  currentPoints,
  pointBased = false,
}: {
  title: string;
  slot: 'armor' | 'weapon' | 'camp' | 'companion';
  tiers: GearTier[];
  currentLevel: number;
  currentPoints: number;
  pointBased?: boolean;
}) {
  const { t } = useI18n();

  return (
    <div>
      <h3 className="mb-2 font-pixel text-[10px] uppercase tracking-wider text-amber-300">
        {title}
      </h3>
      <div className="grid gap-2 sm:grid-cols-2">
        {tiers.map((tier) => {
          const unlocked = pointBased
            ? currentPoints >= (tier.requiredPoints ?? 0)
            : currentLevel >= tier.requiredLevel;
          const desc = t(
            getGearDescriptionKey(
              slot,
              tier.id as ArmorId | WeaponId | CampId | CompanionId
            )
          );
          return (
            <div
              key={tier.id}
              className={`border p-3 transition ${
                unlocked
                  ? `${RARITY_STYLES[tier.rarity]} bg-slate-900/90`
                  : 'border-slate-800 bg-slate-950/70 opacity-65'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    {unlocked ? (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    ) : (
                      <Lock className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                    )}
                    <span dir="ltr">{tier.name}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">{desc}</p>
                </div>
                <span className="shrink-0 border border-slate-700 bg-slate-950 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">
                  {pointBased
                    ? t('codex.spBadge', { points: tier.requiredPoints ?? 0 })
                    : t('codex.lvlBadge', { level: tier.requiredLevel })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function GearCodexModal({
  open,
  currentLevel,
  currentPoints,
  onClose,
}: GearCodexModalProps) {
  const { t } = useI18n();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label={t('codex.ariaLabel')}
    >
      <div className="pixel-panel flex max-h-[88vh] w-full max-w-3xl flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
          <div>
            <h2 className="font-pixel text-xs text-amber-300">
              {t('codex.title')}
            </h2>
            <p className="mt-1 text-xs text-slate-400">{t('codex.subtitle')}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 border border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:text-white"
            aria-label={t('codex.closeAria')}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto p-5">
          <TierSection
            title={t('codex.armorSection')}
            slot="armor"
            tiers={ARMOR_TIERS}
            currentLevel={currentLevel}
            currentPoints={currentPoints}
          />
          <TierSection
            title={t('codex.weaponSection')}
            slot="weapon"
            tiers={WEAPON_TIERS}
            currentLevel={currentLevel}
            currentPoints={currentPoints}
          />
          <TierSection
            title={t('codex.campSection')}
            slot="camp"
            tiers={CAMP_TIERS}
            currentLevel={currentLevel}
            currentPoints={currentPoints}
          />
          <TierSection
            title={t('codex.companionSection')}
            slot="companion"
            tiers={COMPANION_TIERS}
            currentLevel={currentLevel}
            currentPoints={currentPoints}
            pointBased
          />
        </div>
      </div>
    </div>
  );
}

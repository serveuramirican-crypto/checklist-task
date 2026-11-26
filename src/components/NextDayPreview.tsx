import {
  CheckCircle2,
  Compass,
  Flag,
  Lock,
  ShieldAlert,
  Sparkles,
  Swords,
  Tent,
} from 'lucide-react';
import {
  buildNextDayPreview,
  type PreviewEquipmentCard,
  type RewardSlot,
} from '../game/preview';
import { useI18n } from '../i18n/I18nContext';
import type { TranslationKey } from '../i18n/translations';
import type { DailyDayRecord, SurvivalProfile } from '../types/survival';
import { PixelItemIcon } from './PixelItemIcon';

interface NextDayPreviewProps {
  profile: SurvivalProfile;
  dayRecord: DailyDayRecord;
  hasUnacknowledgedDeath: boolean;
}

const SLOT_LABEL_KEY: Record<RewardSlot, TranslationKey> = {
  armor: 'preview.slotArmor',
  weapon: 'preview.slotWeapon',
  camp: 'preview.slotCamp',
};

const RARITY_BADGE_CLASSES: Record<string, string> = {
  common: 'border-slate-600/80 text-slate-300',
  uncommon: 'border-emerald-500/50 text-emerald-300',
  rare: 'border-sky-500/50 text-sky-300',
  epic: 'border-purple-500/50 text-purple-300',
  legendary: 'border-orange-500/60 text-orange-300',
  mythic: 'border-amber-400/70 text-amber-300',
};

function renderEquipmentStatus(
  card: PreviewEquipmentCard,
  upcomingDay: number,
  t: ReturnType<typeof useI18n>['t']
) {
  if (card.status === 'unlocked') {
    return (
      <span className="inline-flex items-center gap-1 border border-emerald-500/50 bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
        <CheckCircle2 className="h-3 w-3" />
        {t('preview.statusUnlocked')}
      </span>
    );
  }
  if (card.status === 'available_next_day') {
    return (
      <span className="inline-flex items-center gap-1 border border-amber-400/60 bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-200">
        <Sparkles className="h-3 w-3" />
        {t('preview.statusAvailableNextDay', { day: upcomingDay })}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 border border-slate-600 bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-slate-300">
      <Lock className="h-3 w-3" />
      {t('preview.statusRequiresLevel', { level: card.item.requiredLevel })}
    </span>
  );
}

export function NextDayPreview({
  profile,
  dayRecord,
  hasUnacknowledgedDeath,
}: NextDayPreviewProps) {
  const { t } = useI18n();

  const preview = buildNextDayPreview({
    currentDay: profile.current_day,
    level: profile.level,
    points: profile.points,
    dayStatus: dayRecord.status,
    hasUnacknowledgedDeath,
  });

  return (
    <section
      className="pixel-panel p-4 sm:p-5"
      aria-labelledby="next-day-preview-title"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Swords className="h-4 w-4 shrink-0 text-amber-400" />
            <h2
              id="next-day-preview-title"
              className="font-pixel text-xs text-amber-300 sm:text-sm"
            >
              {t('preview.title')}
            </h2>
          </div>
          <p className="mt-1.5 text-xs text-slate-300">{t('preview.subtitle')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="border-2 border-amber-400/70 bg-amber-500/15 px-3 py-1.5 font-pixel text-[10px] text-amber-200">
            {t('preview.upcomingBadge', { day: preview.upcomingDay })}
          </span>
          <span className="border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-[11px] text-slate-300">
            {t('preview.syncHint', {
              day: preview.currentDay,
              level: preview.currentLevel,
              points: preview.currentPoints,
            })}
          </span>
        </div>
      </div>

      {preview.hasUnacknowledgedDeath && (
        <div className="mt-4 flex items-center gap-2 border border-red-500/50 bg-red-950/40 px-3 py-2 text-xs text-red-200">
          <ShieldAlert className="h-4 w-4 shrink-0 text-red-400" />
          <span>{t('preview.permadeathPaused')}</span>
        </div>
      )}

      {/* A. Equipment Upgrades */}
      <div className="mt-5">
        <h3 className="mb-3 flex items-center gap-2 font-pixel text-[10px] text-sky-300">
          <Compass className="h-3.5 w-3.5 shrink-0" />
          {t('preview.catEquipment')}
        </h3>

        {preview.equipmentCards.length === 0 ? (
          <div className="border border-emerald-500/40 bg-emerald-950/20 p-4 text-xs text-emerald-200">
            <strong>{t('preview.allMaxedSlot')}</strong> — {t('preview.allMaxedDesc')}
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-3">
            {preview.equipmentCards.map((card) => (
              <div
                key={`${card.slot}-${card.item.id}`}
                className={`flex flex-col justify-between border bg-slate-900/75 p-3.5 ${
                  RARITY_BADGE_CLASSES[card.item.rarity] ?? 'border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <PixelItemIcon itemId={card.item.id} className="h-9 w-9" />
                      <div>
                        <div className="text-[10px] font-bold uppercase text-slate-400">
                          {t(SLOT_LABEL_KEY[card.slot])}
                        </div>
                        <div className="text-xs font-bold text-slate-100" dir="ltr">
                          {card.item.name}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="mt-2.5 text-xs text-slate-300">
                    {t(card.descKey)}
                  </p>
                  <p className="mt-1.5 text-[11px] text-sky-300/90">
                    {t(card.benefitKey)}
                  </p>
                </div>

                <div className="mt-3 space-y-2 border-t border-slate-800 pt-2.5">
                  <div className="text-[11px] text-slate-400">
                    {card.item.requiredLevel === preview.upcomingDay
                      ? t('preview.conditionTodayClear', {
                          day: preview.currentDay,
                          level: card.item.requiredLevel,
                        })
                      : t('preview.conditionLevel', {
                          level: card.item.requiredLevel,
                          day: card.item.requiredLevel - 1,
                        })}
                  </div>
                  <div>{renderEquipmentStatus(card, preview.upcomingDay, t)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* B. Companions & C. Camp Evolution */}
      <div className="mt-6 grid gap-4 lg:grid-cols-12">
        {/* B. Companions */}
        <div className="lg:col-span-7">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 font-pixel text-[10px] text-purple-300">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              {t('preview.catCompanions')}
            </h3>
            <span className="text-[11px] text-slate-400">
              {t('preview.companionRuleNote')}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {preview.companions.map((comp) => (
              <div
                key={comp.item.id}
                className={`flex flex-col justify-between border p-3 ${
                  comp.unlocked
                    ? 'border-emerald-500/50 bg-emerald-950/20'
                    : 'border-slate-700/80 bg-slate-900/75'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <PixelItemIcon itemId={comp.item.id} className="h-8 w-8" />
                    <div className="min-w-0">
                      <div className="truncate text-xs font-bold text-slate-100" dir="ltr">
                        {comp.item.name}
                      </div>
                      <div className="text-[10px] font-bold text-purple-300">
                        {comp.requiredPoints} SP
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-300">
                    {t(comp.descKey)}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    {t(comp.benefitKey)}
                  </p>
                </div>

                <div className="mt-3 border-t border-slate-800 pt-2">
                  <div className="h-2 w-full overflow-hidden border border-slate-700 bg-slate-950">
                    <div
                      className={`h-full transition-all ${
                        comp.unlocked ? 'bg-emerald-400' : 'bg-purple-400'
                      }`}
                      style={{ width: `${comp.progressPct}%` }}
                    />
                  </div>
                  <div className="mt-1.5 text-[10px] text-slate-300">
                    {comp.unlocked
                      ? t('preview.companionUnlockedNote', {
                          target: comp.requiredPoints,
                        })
                      : t('preview.companionProgress', {
                          current: comp.currentPoints,
                          target: comp.requiredPoints,
                          remaining: comp.remainingPoints,
                        })}
                  </div>
                  <div className="mt-1.5">
                    {comp.unlocked ? (
                      <span className="inline-flex items-center gap-1 border border-emerald-500/50 bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" />
                        {t('preview.statusUnlocked')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 border border-slate-600 bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                        <Lock className="h-3 w-3" />
                        {t('preview.statusRequiresSp', {
                          points: comp.requiredPoints,
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* C. Camp & Environment Evolution */}
        <div className="lg:col-span-5">
          <h3 className="mb-3 flex items-center gap-2 font-pixel text-[10px] text-emerald-300">
            <Tent className="h-3.5 w-3.5 shrink-0" />
            {t('preview.catCamp')}
          </h3>

          <div className="flex flex-col justify-between gap-3 border border-slate-700/80 bg-slate-900/75 p-3.5">
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5 border border-slate-800 bg-slate-950/60 p-2.5">
                <PixelItemIcon itemId={preview.currentCamp.id} className="h-8 w-8" />
                <div>
                  <div className="text-[10px] font-bold text-slate-400">
                    {t('preview.currentStageLabel')}{' '}
                    <span className="text-emerald-300" dir="ltr">
                      {preview.currentCamp.name}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-300">
                    {t(`env.${preview.currentCamp.id}` as TranslationKey)}
                  </p>
                </div>
              </div>

              {preview.nextCamp ? (
                <div className="flex items-start gap-2.5 border border-amber-500/35 bg-amber-950/15 p-2.5">
                  <PixelItemIcon itemId={preview.nextCamp.id} className="h-8 w-8" />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="text-[10px] font-bold text-amber-200">
                        {t('preview.nextStageLabel')}{' '}
                        <span dir="ltr">{preview.nextCamp.name}</span>
                      </span>
                      <span className="border border-slate-700 bg-slate-950 px-1.5 py-0.5 text-[10px] text-slate-300">
                        {t('codex.lvlBadge', { level: preview.nextCamp.requiredLevel })}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-300">
                      {t(`env.${preview.nextCamp.id}` as TranslationKey)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border border-emerald-500/40 bg-emerald-950/20 p-2.5 text-xs text-emerald-200">
                  {t('preview.allMaxedDesc')}
                </div>
              )}
            </div>

            <div className="border-t border-slate-800 pt-2.5 text-xs">
              <div className="text-[10px] font-bold uppercase text-amber-300">
                {t('preview.todayBonusTitle', { day: preview.currentDay })}
              </div>
              <div className="mt-0.5 font-bold text-slate-100">
                {t('preview.todayBonusValue', {
                  nextLevel: preview.projectedNextLevel,
                  bonus: preview.todaySurvivalBonus,
                })}
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                {t('preview.tomorrowBonusNote', {
                  upcomingDay: preview.upcomingDay,
                  tomorrowBonus: preview.tomorrowSurvivalBonus,
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* D. Upcoming Milestones */}
      <div className="mt-6">
        <h3 className="mb-3 flex items-center gap-2 font-pixel text-[10px] text-amber-300">
          <Flag className="h-3.5 w-3.5 shrink-0" />
          {t('preview.catMilestones')}
        </h3>

        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
          {preview.milestones.map((m) => (
            <div
              key={m.id}
              className={`border p-3 ${
                m.unlocked
                  ? 'border-emerald-500/40 bg-emerald-950/20'
                  : m.isGuaranteedBySurvivingToday
                    ? 'border-amber-500/50 bg-amber-950/15'
                    : 'border-slate-700/80 bg-slate-900/70'
              }`}
            >
              <div className="text-[10px] font-bold uppercase text-slate-400">
                {m.kind === 'level'
                  ? t('preview.slotLevel')
                  : m.kind === 'weapon'
                    ? t('preview.slotWeapon')
                    : m.kind === 'armor'
                      ? t('preview.slotArmor')
                      : m.kind === 'camp'
                        ? t('preview.slotCamp')
                        : t('preview.slotCompanion')}
              </div>

              <div className="mt-1 text-xs font-bold text-slate-100" dir="ltr">
                {m.title}
              </div>

              <div className="mt-2 text-[11px] text-slate-300">
                {m.requiredPoints !== undefined
                  ? t('hint.collectSp', { points: m.requiredPoints })
                  : t('hint.reachLevel', { level: m.requiredLevel ?? 1 })}
              </div>

              <div className="mt-2">
                {m.unlocked ? (
                  <span className="inline-block border border-emerald-500/50 bg-emerald-950/60 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
                    {t('preview.statusUnlocked')}
                  </span>
                ) : m.isGuaranteedBySurvivingToday ? (
                  <span className="inline-block border border-amber-400/50 bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-200">
                    {t('preview.dayRewardTag', { day: preview.currentDay })}
                  </span>
                ) : (
                  <span className="inline-block border border-slate-600 bg-slate-950 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">
                    {t('preview.milestoneTag')}
                    {m.remainingPoints !== undefined
                      ? ` · ${t('hint.spRemaining', { points: m.remainingPoints })}`
                      : ''}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

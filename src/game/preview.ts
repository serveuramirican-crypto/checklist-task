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
} from './progression';
import type { DayStatus } from '../types/survival';
import type { TranslationKey } from '../i18n/translations';

export type RewardSlot = 'armor' | 'weapon' | 'camp';
export type RewardStatus = 'available_next_day' | 'unlocked' | 'requires_level';

export interface PreviewEquipmentCard {
  slot: RewardSlot;
  item: GearTier<ArmorId | WeaponId | CampId>;
  descKey: TranslationKey;
  benefitKey: TranslationKey;
  status: RewardStatus;
  isDayReward: boolean;
}

export interface PreviewCompanionCard {
  item: GearTier<CompanionId>;
  descKey: TranslationKey;
  benefitKey: TranslationKey;
  requiredPoints: number;
  currentPoints: number;
  remainingPoints: number;
  progressPct: number;
  unlocked: boolean;
}

export interface PreviewMilestone {
  id: string;
  kind: 'level' | 'armor' | 'weapon' | 'camp' | 'companion';
  title: string;
  requiredLevel?: number;
  requiredPoints?: number;
  remainingPoints?: number;
  isGuaranteedBySurvivingToday: boolean;
  unlocked: boolean;
}

export interface NextDayPreviewData {
  currentDay: number;
  upcomingDay: number;
  currentLevel: number;
  currentPoints: number;
  dayStatus: DayStatus;
  hasUnacknowledgedDeath: boolean;
  projectedNextLevel: number;
  todaySurvivalBonus: number;
  tomorrowSurvivalBonus: number;
  equipmentCards: PreviewEquipmentCard[];
  companions: PreviewCompanionCard[];
  currentCamp: GearTier<CampId>;
  nextCamp: GearTier<CampId> | null;
  nextCampStatus: RewardStatus | null;
  milestones: PreviewMilestone[];
}

export interface BuildPreviewParams {
  currentDay: number;
  level: number;
  points: number;
  dayStatus: DayStatus;
  hasUnacknowledgedDeath?: boolean;
}

function selectSlotPreviewTier<T extends string>(
  tiers: GearTier<T>[],
  currentLevel: number,
  upcomingDay: number
): { tier: GearTier<T> | null; status: RewardStatus } {
  // If an item unlocks exactly at upcomingDay (the level reached after surviving currentDay),
  // keep it highlighted on the current survival day even if already earned earlier today.
  const exactDayTier = tiers.find((t) => t.requiredLevel === upcomingDay);
  if (exactDayTier) {
    return {
      tier: exactDayTier,
      status: currentLevel >= exactDayTier.requiredLevel ? 'unlocked' : 'available_next_day',
    };
  }

  const nextLocked = tiers.find((t) => t.requiredLevel > currentLevel);
  if (!nextLocked) {
    return { tier: null, status: 'unlocked' };
  }

  return {
    tier: nextLocked,
    status: nextLocked.requiredLevel <= upcomingDay ? 'available_next_day' : 'requires_level',
  };
}

function getSlotNextLocked<T extends string>(
  tiers: GearTier<T>[],
  currentLevel: number
): GearTier<T> | null {
  return tiers.find((t) => t.requiredLevel > currentLevel) ?? null;
}

export function buildNextDayPreview({
  currentDay,
  level,
  points,
  dayStatus,
  hasUnacknowledgedDeath = false,
}: BuildPreviewParams): NextDayPreviewData {
  const safeDay = hasUnacknowledgedDeath ? 1 : Math.max(1, currentDay);
  const safeLevel = hasUnacknowledgedDeath ? 1 : Math.max(1, level);
  const safePoints = hasUnacknowledgedDeath ? 0 : Math.max(0, points);
  const upcomingDay = safeDay + 1;

  const armorPick = selectSlotPreviewTier(ARMOR_TIERS, safeLevel, upcomingDay);
  const weaponPick = selectSlotPreviewTier(WEAPON_TIERS, safeLevel, upcomingDay);
  const campPick = selectSlotPreviewTier(CAMP_TIERS, safeLevel, upcomingDay);

  const equipmentCards: PreviewEquipmentCard[] = [];

  if (weaponPick.tier) {
    equipmentCards.push({
      slot: 'weapon',
      item: weaponPick.tier,
      descKey: `gear.weapon.${weaponPick.tier.id}.desc` as TranslationKey,
      benefitKey: 'benefit.weapon',
      status: weaponPick.status,
      isDayReward: weaponPick.tier.requiredLevel <= upcomingDay,
    });
  }

  if (armorPick.tier) {
    equipmentCards.push({
      slot: 'armor',
      item: armorPick.tier,
      descKey: `gear.armor.${armorPick.tier.id}.desc` as TranslationKey,
      benefitKey: 'benefit.armor',
      status: armorPick.status,
      isDayReward: armorPick.tier.requiredLevel <= upcomingDay,
    });
  }

  if (campPick.tier) {
    equipmentCards.push({
      slot: 'camp',
      item: campPick.tier,
      descKey: `gear.camp.${campPick.tier.id}.desc` as TranslationKey,
      benefitKey: 'benefit.camp',
      status: campPick.status,
      isDayReward: campPick.tier.requiredLevel <= upcomingDay,
    });
  }

  const companions: PreviewCompanionCard[] = COMPANION_TIERS.map((comp) => {
    const req = comp.requiredPoints ?? 0;
    const unlocked = safePoints >= req;
    const remainingPoints = Math.max(0, req - safePoints);
    const progressPct = req > 0 ? Math.min(100, Math.round((safePoints / req) * 100)) : 100;
    return {
      item: comp,
      descKey: `gear.comp.${comp.id}.desc` as TranslationKey,
      benefitKey: `benefit.${comp.id}` as TranslationKey,
      requiredPoints: req,
      currentPoints: safePoints,
      remainingPoints,
      progressPct,
      unlocked,
    };
  });

  let currentCamp = CAMP_TIERS[0];
  for (const camp of CAMP_TIERS) {
    if (safeLevel >= camp.requiredLevel) {
      currentCamp = camp;
    }
  }

  const nextCampTier =
    campPick.tier && campPick.tier.id !== currentCamp.id
      ? campPick.tier
      : getSlotNextLocked(CAMP_TIERS, safeLevel);

  const milestones: PreviewMilestone[] = [
    {
      id: `level-${upcomingDay}`,
      kind: 'level',
      title: `Level ${upcomingDay}`,
      requiredLevel: upcomingDay,
      isGuaranteedBySurvivingToday: true,
      unlocked: safeLevel >= upcomingDay,
    },
  ];

  const nextWeapon = getSlotNextLocked(WEAPON_TIERS, safeLevel) ?? weaponPick.tier;
  if (nextWeapon) {
    milestones.push({
      id: `weapon-${nextWeapon.id}`,
      kind: 'weapon',
      title: nextWeapon.name,
      requiredLevel: nextWeapon.requiredLevel,
      isGuaranteedBySurvivingToday: nextWeapon.requiredLevel <= upcomingDay,
      unlocked: safeLevel >= nextWeapon.requiredLevel,
    });
  }

  const nextArmor = getSlotNextLocked(ARMOR_TIERS, safeLevel) ?? armorPick.tier;
  if (nextArmor) {
    milestones.push({
      id: `armor-${nextArmor.id}`,
      kind: 'armor',
      title: nextArmor.name,
      requiredLevel: nextArmor.requiredLevel,
      isGuaranteedBySurvivingToday: nextArmor.requiredLevel <= upcomingDay,
      unlocked: safeLevel >= nextArmor.requiredLevel,
    });
  }

  const nextCampMilestone = getSlotNextLocked(CAMP_TIERS, safeLevel) ?? campPick.tier;
  if (nextCampMilestone) {
    milestones.push({
      id: `camp-${nextCampMilestone.id}`,
      kind: 'camp',
      title: nextCampMilestone.name,
      requiredLevel: nextCampMilestone.requiredLevel,
      isGuaranteedBySurvivingToday: nextCampMilestone.requiredLevel <= upcomingDay,
      unlocked: safeLevel >= nextCampMilestone.requiredLevel,
    });
  }

  const nextCompanion = companions.find((c) => !c.unlocked);
  if (nextCompanion) {
    milestones.push({
      id: `comp-${nextCompanion.item.id}`,
      kind: 'companion',
      title: nextCompanion.item.name,
      requiredPoints: nextCompanion.requiredPoints,
      remainingPoints: nextCompanion.remainingPoints,
      isGuaranteedBySurvivingToday: false,
      unlocked: false,
    });
  }

  return {
    currentDay: safeDay,
    upcomingDay,
    currentLevel: safeLevel,
    currentPoints: safePoints,
    dayStatus,
    hasUnacknowledgedDeath,
    projectedNextLevel: upcomingDay,
    todaySurvivalBonus: 25 * safeDay,
    tomorrowSurvivalBonus: 25 * upcomingDay,
    equipmentCards,
    companions,
    currentCamp,
    nextCamp: nextCampTier,
    nextCampStatus: nextCampTier ? campPick.status : null,
    milestones,
  };
}

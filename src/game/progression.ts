import type { TaskDifficulty } from '../types/survival';

export interface GearTier<T extends string = string> {
  id: T;
  name: string;
  description: string;
  requiredLevel: number;
  requiredPoints?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
}

export type ArmorId =
  | 'rags'
  | 'scavenger'
  | 'ranger'
  | 'vanguard'
  | 'warden'
  | 'apex';

export type WeaponId =
  | 'stick'
  | 'spear'
  | 'machete'
  | 'bow'
  | 'greatsword'
  | 'halberd';

export type CampId =
  | 'embers'
  | 'campfire'
  | 'tent'
  | 'outpost'
  | 'bunker'
  | 'citadel';

export type CompanionId = 'cooking_pot' | 'wolf' | 'drone';

export const DIFFICULTY_CONFIG: Record<
  TaskDifficulty,
  { label: string; tag: string; points: 15 | 30 | 50; colorClass: string }
> = {
  easy: {
    label: 'Supply Run',
    tag: 'EASY',
    points: 15,
    colorClass: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10',
  },
  medium: {
    label: 'Camp Defense',
    tag: 'MEDIUM',
    points: 30,
    colorClass: 'text-amber-300 border-amber-500/40 bg-amber-500/10',
  },
  hard: {
    label: 'Apex Hunt',
    tag: 'HARD',
    points: 50,
    colorClass: 'text-rose-300 border-rose-500/40 bg-rose-500/10',
  },
};

export const ARMOR_TIERS: GearTier<ArmorId>[] = [
  {
    id: 'rags',
    name: 'Castaway Rags',
    description: 'Tattered cloth scraps from Day 1. Offers zero protection in the wild.',
    requiredLevel: 1,
    rarity: 'common',
  },
  {
    id: 'scavenger',
    name: 'Scavenger Leather',
    description: 'Stitched hide vest, field boots, and cloth headband.',
    requiredLevel: 2,
    rarity: 'uncommon',
  },
  {
    id: 'ranger',
    name: 'Ranger Cloak',
    description: 'Forest hood, reinforced bracers, and utility survival belt.',
    requiredLevel: 4,
    rarity: 'rare',
  },
  {
    id: 'vanguard',
    name: 'Ironclad Vanguard',
    description: 'Riveted steel chestplate, heavy pauldrons, and crimson cape.',
    requiredLevel: 7,
    rarity: 'epic',
  },
  {
    id: 'warden',
    name: 'Wasteland Warden',
    description: 'Rune-etched tactical exo-plate with illuminated visor helm.',
    requiredLevel: 14,
    rarity: 'legendary',
  },
  {
    id: 'apex',
    name: 'Apex Obsidian Armor',
    description: 'Mythic obsidian-gold battleplate radiating blazing survival embers.',
    requiredLevel: 21,
    rarity: 'mythic',
  },
];

export const WEAPON_TIERS: GearTier<WeaponId>[] = [
  {
    id: 'stick',
    name: 'Splintered Stick',
    description: 'A fragile branch picked off the forest floor.',
    requiredLevel: 1,
    rarity: 'common',
  },
  {
    id: 'spear',
    name: 'Flint Survival Spear',
    description: 'Sharpened stone lash-mounted onto ash wood.',
    requiredLevel: 2,
    rarity: 'uncommon',
  },
  {
    id: 'machete',
    name: 'Iron Machete',
    description: 'Heavy tempered blade forged for bushcraft and defense.',
    requiredLevel: 3,
    rarity: 'rare',
  },
  {
    id: 'bow',
    name: 'Hunter Recurve Bow',
    description: 'Laminated survival bow paired with a full fletched quiver.',
    requiredLevel: 5,
    rarity: 'epic',
  },
  {
    id: 'greatsword',
    name: 'Flame Greatsword',
    description: 'Ember-forged steel broadsword burning with camp heat.',
    requiredLevel: 10,
    rarity: 'legendary',
  },
  {
    id: 'halberd',
    name: 'Plasma Relic Halberd',
    description: 'Arc-charged survival polearm humming with golden energy.',
    requiredLevel: 18,
    rarity: 'mythic',
  },
];

export const CAMP_TIERS: GearTier<CampId>[] = [
  {
    id: 'embers',
    name: 'Dying Embers',
    description: 'Exposed dirt ground with a weak spark keeping the dark away.',
    requiredLevel: 1,
    rarity: 'common',
  },
  {
    id: 'campfire',
    name: 'Stone Campfire',
    description: 'Ringed hearth fire with log seating and crackling flames.',
    requiredLevel: 2,
    rarity: 'uncommon',
  },
  {
    id: 'tent',
    name: 'Canvas Lean-To',
    description: 'Sturdy survival tarp shelter and strapped supply crate.',
    requiredLevel: 4,
    rarity: 'rare',
  },
  {
    id: 'outpost',
    name: 'Timber Outpost',
    description: 'Reinforced wooden watch cabin with hanging oil lantern.',
    requiredLevel: 7,
    rarity: 'epic',
  },
  {
    id: 'bunker',
    name: 'Fortified Bunker',
    description: 'Armored stone-and-steel refuge flying your survival banner.',
    requiredLevel: 14,
    rarity: 'legendary',
  },
  {
    id: 'citadel',
    name: 'Beacon Citadel',
    description: 'Towering stronghold lit by an eternal golden signal beacon.',
    requiredLevel: 21,
    rarity: 'mythic',
  },
];

export const COMPANION_TIERS: GearTier<CompanionId>[] = [
  {
    id: 'cooking_pot',
    name: 'Iron Camp Kettle',
    description: 'Steaming broth kettle hanging above the fire for stamina recovery.',
    requiredLevel: 1,
    requiredPoints: 150,
    rarity: 'uncommon',
  },
  {
    id: 'wolf',
    name: 'Timber Wolf Scout',
    description: 'A loyal wild wolf guarding your perimeter at night.',
    requiredLevel: 1,
    requiredPoints: 400,
    rarity: 'epic',
  },
  {
    id: 'drone',
    name: 'Solar Recon Drone',
    description: 'Autonomous hovering sentinel scanning the dark horizon.',
    requiredLevel: 1,
    requiredPoints: 900,
    rarity: 'mythic',
  },
];

export interface CharacterLoadout {
  armor: GearTier<ArmorId>;
  weapon: GearTier<WeaponId>;
  camp: GearTier<CampId>;
  companions: GearTier<CompanionId>[];
  nextUnlock: { category: string; item: GearTier; hint: string } | null;
}

function highestUnlocked<T extends string>(tiers: GearTier<T>[], level: number): GearTier<T> {
  let active = tiers[0];
  for (const tier of tiers) {
    if (level >= tier.requiredLevel) {
      active = tier;
    }
  }
  return active;
}

export function getCharacterLoadout(level: number, points: number): CharacterLoadout {
  const safeLevel = Math.max(1, level);
  const safePoints = Math.max(0, points);

  const armor = highestUnlocked(ARMOR_TIERS, safeLevel);
  const weapon = highestUnlocked(WEAPON_TIERS, safeLevel);
  const camp = highestUnlocked(CAMP_TIERS, safeLevel);
  const companions = COMPANION_TIERS.filter(
    (comp) => safePoints >= (comp.requiredPoints ?? 0)
  );

  const candidates: { category: string; item: GearTier; sortWeight: number; hint: string }[] = [];

  const nextArmor = ARMOR_TIERS.find((t) => t.requiredLevel > safeLevel);
  if (nextArmor) {
    candidates.push({
      category: 'Armor',
      item: nextArmor,
      sortWeight: (nextArmor.requiredLevel - safeLevel) * 100,
      hint: `Reach Level ${nextArmor.requiredLevel}`,
    });
  }

  const nextWeapon = WEAPON_TIERS.find((t) => t.requiredLevel > safeLevel);
  if (nextWeapon) {
    candidates.push({
      category: 'Weapon',
      item: nextWeapon,
      sortWeight: (nextWeapon.requiredLevel - safeLevel) * 100 - 1,
      hint: `Reach Level ${nextWeapon.requiredLevel}`,
    });
  }

  const nextCamp = CAMP_TIERS.find((t) => t.requiredLevel > safeLevel);
  if (nextCamp) {
    candidates.push({
      category: 'Shelter',
      item: nextCamp,
      sortWeight: (nextCamp.requiredLevel - safeLevel) * 100 + 1,
      hint: `Reach Level ${nextCamp.requiredLevel}`,
    });
  }

  const nextComp = COMPANION_TIERS.find((t) => (t.requiredPoints ?? 0) > safePoints);
  if (nextComp && nextComp.requiredPoints) {
    candidates.push({
      category: 'Companion',
      item: nextComp,
      sortWeight: Math.max(50, nextComp.requiredPoints - safePoints),
      hint: `Collect ${nextComp.requiredPoints} SP`,
    });
  }

  candidates.sort((a, b) => a.sortWeight - b.sortWeight);
  const bestNext = candidates[0]
    ? { category: candidates[0].category, item: candidates[0].item, hint: candidates[0].hint }
    : null;

  return {
    armor,
    weapon,
    camp,
    companions,
    nextUnlock: bestNext,
  };
}

export interface UnlockedGearEntry {
  slot: 'armor' | 'weapon' | 'camp' | 'companion';
  name: string;
}

export function getNewlyUnlockedGearEntries(
  prevLevel: number,
  prevPoints: number,
  nextLevel: number,
  nextPoints: number
): UnlockedGearEntry[] {
  const unlocked: UnlockedGearEntry[] = [];

  const prevLoadout = getCharacterLoadout(prevLevel, prevPoints);
  const nextLoadout = getCharacterLoadout(nextLevel, nextPoints);

  if (nextLoadout.armor.id !== prevLoadout.armor.id) {
    unlocked.push({ slot: 'armor', name: nextLoadout.armor.name });
  }
  if (nextLoadout.weapon.id !== prevLoadout.weapon.id) {
    unlocked.push({ slot: 'weapon', name: nextLoadout.weapon.name });
  }
  if (nextLoadout.camp.id !== prevLoadout.camp.id) {
    unlocked.push({ slot: 'camp', name: nextLoadout.camp.name });
  }

  const prevCompIds = new Set(prevLoadout.companions.map((c) => c.id));
  for (const comp of nextLoadout.companions) {
    if (!prevCompIds.has(comp.id)) {
      unlocked.push({ slot: 'companion', name: comp.name });
    }
  }

  return unlocked;
}

export function getNewlyUnlockedGear(
  prevLevel: number,
  prevPoints: number,
  nextLevel: number,
  nextPoints: number
): string[] {
  const labelMap: Record<UnlockedGearEntry['slot'], string> = {
    armor: 'Armor',
    weapon: 'Weapon',
    camp: 'Shelter',
    companion: 'Companion',
  };
  return getNewlyUnlockedGearEntries(
    prevLevel,
    prevPoints,
    nextLevel,
    nextPoints
  ).map((entry) => `${labelMap[entry.slot]}: ${entry.name}`);
}

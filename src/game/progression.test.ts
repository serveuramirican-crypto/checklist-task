import { describe, expect, it } from 'vitest';
import { getCharacterLoadout, getNewlyUnlockedGear } from './progression';

describe('getCharacterLoadout', () => {
  it('returns Tier 0 starter gear on Day 1 / Level 1 with 0 points', () => {
    const loadout = getCharacterLoadout(1, 0);
    expect(loadout.armor.id).toBe('rags');
    expect(loadout.weapon.id).toBe('stick');
    expect(loadout.camp.id).toBe('embers');
    expect(loadout.companions).toHaveLength(0);
    expect(loadout.nextUnlock?.item.id).toBe('spear');
  });

  it('upgrades armor, weapon, and camp across survival levels', () => {
    const lvl2 = getCharacterLoadout(2, 60);
    expect(lvl2.armor.id).toBe('scavenger');
    expect(lvl2.weapon.id).toBe('spear');
    expect(lvl2.camp.id).toBe('campfire');

    const lvl7 = getCharacterLoadout(7, 300);
    expect(lvl7.armor.id).toBe('vanguard');
    expect(lvl7.weapon.id).toBe('bow');
    expect(lvl7.camp.id).toBe('outpost');
    expect(lvl7.companions.map((c) => c.id)).toEqual(['cooking_pot']);

    const lvl21 = getCharacterLoadout(21, 1200);
    expect(lvl21.armor.id).toBe('apex');
    expect(lvl21.weapon.id).toBe('halberd');
    expect(lvl21.camp.id).toBe('citadel');
    expect(lvl21.companions.map((c) => c.id)).toEqual([
      'cooking_pot',
      'wolf',
      'drone',
    ]);
    expect(lvl21.nextUnlock).toBeNull();
  });

  it('detects newly unlocked gear across a level/point transition', () => {
    const unlocks = getNewlyUnlockedGear(1, 40, 2, 160);
    expect(unlocks).toEqual([
      'Armor: Scavenger Leather',
      'Weapon: Flint Survival Spear',
      'Shelter: Stone Campfire',
      'Companion: Iron Camp Kettle',
    ]);
  });
});

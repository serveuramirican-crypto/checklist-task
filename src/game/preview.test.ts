import { describe, expect, it } from 'vitest';
import { buildNextDayPreview } from './preview';

describe('buildNextDayPreview', () => {
  it('shows Day 2 equipment upgrades and SP companion gaps on fresh Day 1', () => {
    const preview = buildNextDayPreview({
      currentDay: 1,
      level: 1,
      points: 0,
      dayStatus: 'active',
    });

    expect(preview.upcomingDay).toBe(2);
    expect(preview.todaySurvivalBonus).toBe(25);
    expect(preview.tomorrowSurvivalBonus).toBe(50);

    const armor = preview.equipmentCards.find((c) => c.slot === 'armor');
    const weapon = preview.equipmentCards.find((c) => c.slot === 'weapon');
    const camp = preview.equipmentCards.find((c) => c.slot === 'camp');

    expect(armor?.item.id).toBe('scavenger');
    expect(armor?.status).toBe('available_next_day');
    expect(weapon?.item.id).toBe('spear');
    expect(weapon?.status).toBe('available_next_day');
    expect(camp?.item.id).toBe('campfire');
    expect(camp?.status).toBe('available_next_day');

    expect(preview.companions.map((c) => [c.item.id, c.remainingPoints, c.unlocked])).toEqual([
      ['cooking_pot', 150, false],
      ['wolf', 400, false],
      ['drone', 900, false],
    ]);
  });

  it('keeps preview on Day 2 even when Day 1 is already survived or reopened by bonus task', () => {
    const survivedDay1 = buildNextDayPreview({
      currentDay: 1,
      level: 2,
      points: 90,
      dayStatus: 'survived',
    });
    expect(survivedDay1.upcomingDay).toBe(2);
    expect(survivedDay1.equipmentCards.every((c) => c.status === 'unlocked')).toBe(true);
    expect(survivedDay1.currentCamp.id).toBe('campfire');
    expect(survivedDay1.nextCamp?.id).toBe('tent');

    const reopenedDay1 = buildNextDayPreview({
      currentDay: 1,
      level: 2,
      points: 90,
      dayStatus: 'active',
    });
    expect(reopenedDay1.upcomingDay).toBe(2);
  });

  it('distinguishes Day 3 weapon unlock from Level 4 milestones on Day 2', () => {
    const preview = buildNextDayPreview({
      currentDay: 2,
      level: 2,
      points: 160,
      dayStatus: 'active',
    });

    expect(preview.upcomingDay).toBe(3);
    expect(preview.todaySurvivalBonus).toBe(50);

    const weapon = preview.equipmentCards.find((c) => c.slot === 'weapon');
    const armor = preview.equipmentCards.find((c) => c.slot === 'armor');
    const camp = preview.equipmentCards.find((c) => c.slot === 'camp');

    expect(weapon?.item.id).toBe('machete');
    expect(weapon?.status).toBe('available_next_day');
    expect(weapon?.isDayReward).toBe(true);

    expect(armor?.item.id).toBe('ranger');
    expect(armor?.status).toBe('requires_level');
    expect(armor?.isDayReward).toBe(false);

    expect(camp?.item.id).toBe('tent');
    expect(camp?.status).toBe('requires_level');
    expect(camp?.isDayReward).toBe(false);

    const kettle = preview.companions.find((c) => c.item.id === 'cooking_pot');
    const wolf = preview.companions.find((c) => c.item.id === 'wolf');
    expect(kettle?.unlocked).toBe(true);
    expect(kettle?.remainingPoints).toBe(0);
    expect(wolf?.unlocked).toBe(false);
    expect(wolf?.remainingPoints).toBe(240);
  });

  it('resets preview safely during unacknowledged permadeath', () => {
    const preview = buildNextDayPreview({
      currentDay: 5,
      level: 5,
      points: 500,
      dayStatus: 'failed',
      hasUnacknowledgedDeath: true,
    });

    expect(preview.currentDay).toBe(1);
    expect(preview.upcomingDay).toBe(2);
    expect(preview.currentLevel).toBe(1);
    expect(preview.currentPoints).toBe(0);
  });
});

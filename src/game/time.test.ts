import { describe, expect, it } from 'vitest';
import { getLocalDateKey, getMidnightCountdown } from './time';

describe('survival midnight time calculations', () => {
  it('computes UTC local date key accurately', () => {
    const d = new Date('2026-11-26T22:30:00Z');
    expect(getLocalDateKey(d, 'UTC')).toBe('2026-11-26');
  });

  it('formats countdown to midnight and classifies urgency phases', () => {
    const morning = new Date('2026-11-26T10:00:00Z');
    const safeRes = getMidnightCountdown(morning, 'UTC', 'active');
    expect(safeRes.formatted).toBe('14:00:00');
    expect(safeRes.phase).toBe('safe');

    const evening = new Date('2026-11-26T18:30:00Z');
    const duskRes = getMidnightCountdown(evening, 'UTC', 'active');
    expect(duskRes.formatted).toBe('05:30:00');
    expect(duskRes.phase).toBe('dusk');

    const lateNight = new Date('2026-11-26T22:15:30Z');
    const critRes = getMidnightCountdown(lateNight, 'UTC', 'active');
    expect(critRes.formatted).toBe('01:44:30');
    expect(critRes.phase).toBe('critical');

    const survivedRes = getMidnightCountdown(lateNight, 'UTC', 'survived');
    expect(survivedRes.phase).toBe('survived');
  });
});

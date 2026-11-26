import { describe, expect, it } from 'vitest';
import { ar, en, type TranslationKey } from './translations';
import { interpolate } from './I18nContext';
import { formatFailureReason } from './dynamic';

function extractPlaceholders(str: string): string[] {
  return [...str.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
}

describe('i18n EN / AR dictionary integrity', () => {
  it('has identical key sets and matching interpolation placeholders across EN and AR', () => {
    const enKeys = Object.keys(en).sort() as TranslationKey[];
    const arKeys = Object.keys(ar).sort() as TranslationKey[];

    expect(arKeys).toEqual(enKeys);

    for (const key of enKeys) {
      expect(en[key].trim().length, `Empty EN key: ${key}`).toBeGreaterThan(0);
      expect(ar[key].trim().length, `Empty AR key: ${key}`).toBeGreaterThan(0);
      expect(
        extractPlaceholders(ar[key]),
        `Placeholder mismatch for key: ${key}`
      ).toEqual(extractPlaceholders(en[key]));
    }
  });

  it('formats dynamic Postgres failure reasons in Arabic and English', () => {
    const tAr = (key: TranslationKey, vars?: Record<string, string | number>) =>
      interpolate(ar[key], vars);
    const tEn = (key: TranslationKey, vars?: Record<string, string | number>) =>
      interpolate(en[key], vars);

    const sample = 'Left 1 of 3 task(s) unfinished on Day 2 (2026-11-26) before midnight.';
    expect(formatFailureReason(sample, tEn)).toBe(sample);
    expect(formatFailureReason(sample, tAr)).toBe(
      'تركت 1 من أصل 3 مهمة غير مكتملة في اليوم 2 (2026-11-26) قبل منتصف الليل.'
    );
  });
});

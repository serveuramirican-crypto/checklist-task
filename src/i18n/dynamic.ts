import type { TranslateFn } from './I18nContext';
import type { TranslationKey } from './translations';
import type { ArmorId, CampId, CompanionId, WeaponId } from '../game/progression';

export function getGearDescriptionKey(
  slot: 'armor' | 'weapon' | 'camp' | 'companion',
  id: ArmorId | WeaponId | CampId | CompanionId
): TranslationKey {
  if (slot === 'companion') {
    return `gear.comp.${id}.desc` as TranslationKey;
  }
  return `gear.${slot}.${id}.desc` as TranslationKey;
}

export function formatFailureReason(reason: string, t: TranslateFn): string {
  const zeroMatch = reason.match(
    /^Added 0 tasks on Day (\d+) \((\d{4}-\d{2}-\d{2})\)/
  );
  if (zeroMatch) {
    return t('fail.zeroTasks', {
      day: zeroMatch[1],
      date: zeroMatch[2],
    });
  }

  const unfinishedMatch = reason.match(
    /^Left (\d+) of (\d+) task\(s\) unfinished on Day (\d+) \((\d{4}-\d{2}-\d{2})\)/
  );
  if (unfinishedMatch) {
    return t('fail.unfinishedTasks', {
      unfinished: unfinishedMatch[1],
      total: unfinishedMatch[2],
      day: unfinishedMatch[3],
      date: unfinishedMatch[4],
    });
  }

  const abandonedMatch = reason.match(
    /^Abandoned camp on (\d{4}-\d{2}-\d{2}) after surviving Day (\d+)/
  );
  if (abandonedMatch) {
    return t('fail.abandonedCamp', {
      missedDate: abandonedMatch[1],
      day: abandonedMatch[2],
    });
  }

  return reason;
}

export function formatAuthErrorMessage(raw: string, t: TranslateFn): string {
  const lower = raw.toLowerCase();
  if (lower.includes('rate limit')) {
    return t('auth.rateLimitError');
  }
  if (lower.includes('invalid login credentials')) {
    return t('auth.invalidCredentials');
  }
  if (lower.includes('email not confirmed')) {
    return t('auth.emailNotConfirmed');
  }
  return raw || t('auth.genericAuthError');
}

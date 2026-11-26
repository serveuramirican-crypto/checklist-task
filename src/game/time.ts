import type { DayStatus } from '../types/survival';

export type UrgencyPhase = 'survived' | 'safe' | 'dusk' | 'critical';

export interface MidnightCountdown {
  hours: number;
  minutes: number;
  seconds: number;
  totalSecondsLeft: number;
  formatted: string;
  phase: UrgencyPhase;
  localDateKey: string;
}

export function getLocalDateKey(now: Date, timeZone: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(now);

    const year = parts.find((p) => p.type === 'year')?.value ?? '1970';
    const month = parts.find((p) => p.type === 'month')?.value ?? '01';
    const day = parts.find((p) => p.type === 'day')?.value ?? '01';
    return `${year}-${month}-${day}`;
  } catch {
    return now.toISOString().slice(0, 10);
  }
}

export function getTimePartsInZone(
  now: Date,
  timeZone: string
): { hour: number; minute: number; second: number; dateKey: string } {
  try {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    });
    const parts = formatter.formatToParts(now);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00';
    const hour = Number(get('hour')) % 24;
    const minute = Number(get('minute'));
    const second = Number(get('second'));
    const dateKey = `${get('year')}-${get('month')}-${get('day')}`;
    return { hour, minute, second, dateKey };
  } catch {
    const hour = now.getUTCHours();
    const minute = now.getUTCMinutes();
    const second = now.getUTCSeconds();
    const dateKey = now.toISOString().slice(0, 10);
    return { hour, minute, second, dateKey };
  }
}

export function getMidnightCountdown(
  now: Date,
  timeZone: string,
  dayStatus: DayStatus
): MidnightCountdown {
  const { hour, minute, second, dateKey } = getTimePartsInZone(now, timeZone);
  const secondsElapsedToday = hour * 3600 + minute * 60 + second;
  const totalSecondsLeft = Math.max(0, 86400 - secondsElapsedToday);

  const hours = Math.floor(totalSecondsLeft / 3600);
  const minutes = Math.floor((totalSecondsLeft % 3600) / 60);
  const seconds = totalSecondsLeft % 60;

  const pad = (n: number) => String(n).padStart(2, '0');
  const formatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  let phase: UrgencyPhase = 'safe';
  if (dayStatus === 'survived') {
    phase = 'survived';
  } else if (totalSecondsLeft <= 3 * 3600) {
    phase = 'critical';
  } else if (totalSecondsLeft <= 8 * 3600) {
    phase = 'dusk';
  }

  return {
    hours,
    minutes,
    seconds,
    totalSecondsLeft,
    formatted,
    phase,
    localDateKey: dateKey,
  };
}

export function getBrowserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

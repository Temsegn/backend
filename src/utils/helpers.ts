import { v4 as uuidv4 } from 'uuid';

export function generateUUID(): string {
  return uuidv4();
}

/**
 * Get start of day in GMT for a given date.
 * Used for analytics aggregation (DailyAnalytics.Date).
 */
export function getStartOfDayGMT(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/**
 * Format date as YYYY-MM-DD in GMT for storage/comparison.
 */
export function toGMTDateString(date: Date): string {
  const d = new Date(date);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

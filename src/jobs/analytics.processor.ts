import cron from 'node-cron';
import { processDailyAnalytics } from '../services/analytics.service';
import { getStartOfDayGMT } from '../utils/helpers';
import { logger } from '../utils/logger';

/**
 * Runs daily at 00:05 GMT to aggregate the previous day's ReadLog into DailyAnalytics.
 * Uses GMT timezone for aggregation as per spec.
 */
export function startAnalyticsCron(): void {
  cron.schedule(
    '5 0 * * *',
    async () => {
      const yesterday = new Date();
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      const startOfYesterday = getStartOfDayGMT(yesterday);
      try {
        await processDailyAnalytics(startOfYesterday);
      } catch (err) {
        logger.error('Daily analytics job failed:', err);
      }
    },
    { timezone: 'GMT' }
  );
  logger.info('Analytics cron scheduled (daily at 00:05 GMT)');
}

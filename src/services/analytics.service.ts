import { readLogRepository } from '../repositories/readLog.repository';
import { analyticsRepository } from '../repositories/analytics.repository';
import { articleRepository } from '../repositories/article.repository';
import { getStartOfDayGMT } from '../utils/helpers';
import { logger } from '../utils/logger';

/**
 * Process ReadLog entries for a given day (GMT) and upsert into DailyAnalytics.
 * Called by the daily cron job.
 */
export async function processDailyAnalytics(forDate: Date): Promise<void> {
  const startOfDay = getStartOfDayGMT(forDate);
  const endOfDay = new Date(startOfDay);
  endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

  const counts = await readLogRepository.getReadCountsByArticleAndDay(startOfDay, endOfDay);
  for (const { ArticleId, Date: date, count } of counts) {
    await analyticsRepository.upsertViewCount(ArticleId, date, count);
  }
  logger.info(`Analytics processed for ${startOfDay.toISOString()}: ${counts.length} article-day(s)`);
}

export interface DashboardItem {
  Title: string;
  CreatedAt: Date;
  TotalViews: number;
}

export async function getAuthorDashboard(
  authorId: string,
  page: number,
  size: number
): Promise<{ list: DashboardItem[]; total: number }> {
  const { list, total } = await articleRepository.listForDashboard(authorId, page, size);
  const articleIds = list.map((a) => a.Id);
  const viewMap = await analyticsRepository.getTotalViewsByArticleIds(articleIds);
  const listWithViews: DashboardItem[] = list.map((a) => ({
    Title: a.Title,
    CreatedAt: a.CreatedAt,
    TotalViews: viewMap.get(a.Id) ?? 0,
  }));
  return { list: listWithViews, total };
}

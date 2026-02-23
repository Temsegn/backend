import { readLogRepository } from '../repositories/readLog.repository';
import { env } from '../config/environment';

const DEDUP_WINDOW_MS = env.READ_DEDUP_WINDOW_MINUTES * 60 * 1000;

/**
 * Record a read event. Deduplicates: same reader (or guest) + same article within READ_DEDUP_WINDOW_MINUTES = one log.
 * Runs asynchronously so it does not block the article response.
 */
export function recordReadAsync(articleId: string, readerId: string | null): void {
  setImmediate(async () => {
    try {
      const since = new Date(Date.now() - DEDUP_WINDOW_MS);
      const recent = await readLogRepository.findRecentRead(articleId, readerId, since);
      if (recent) return;
      await readLogRepository.create({ ArticleId: articleId, ReaderId: readerId });
    } catch (err) {
      // log but do not fail the request
      const { logger } = await import('../utils/logger');
      logger.error('Read tracking failed:', err);
    }
  });
}

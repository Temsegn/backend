import { ReadLog, IReadLog } from '../entities/ReadLog';

export const readLogRepository = {
  async create(data: { ArticleId: string; ReaderId: string | null }): Promise<IReadLog> {
    const log = new ReadLog(data);
    return log.save();
  },

  async findRecentRead(articleId: string, readerId: string | null, since: Date): Promise<IReadLog | null> {
    const query: Record<string, unknown> = { ArticleId: articleId, ReadAt: { $gte: since } };
    if (readerId) query.ReaderId = readerId;
    else query.ReaderId = null;
    return ReadLog.findOne(query).sort({ ReadAt: -1 }).lean().exec().then((doc) => (doc ? (doc as IReadLog) : null));
  },

  /**
   * Get read counts grouped by article and day (GMT) for aggregation job.
   */
  async getReadCountsByArticleAndDay(startDate: Date, endDate: Date): Promise<{ ArticleId: string; Date: Date; count: number }[]> {
    const result = await ReadLog.aggregate([
      { $match: { ReadAt: { $gte: startDate, $lt: endDate } } },
      {
        $group: {
          _id: {
            ArticleId: '$ArticleId',
            year: { $year: { date: '$ReadAt', timezone: 'GMT' } },
            month: { $month: { date: '$ReadAt', timezone: 'GMT' } },
            day: { $dayOfMonth: { date: '$ReadAt', timezone: 'GMT' } },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          ArticleId: '$_id.ArticleId',
          Date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day',
              timezone: 'GMT',
            },
          },
          count: 1,
          _id: 0,
        },
      },
    ]).exec();
    return result as { ArticleId: string; Date: Date; count: number }[];
  },
};

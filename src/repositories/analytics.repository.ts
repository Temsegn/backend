import { DailyAnalytics, IDailyAnalytics } from '../entities/DailyAnalytics';

export const analyticsRepository = {
  async upsertViewCount(articleId: string, date: Date, viewCount: number): Promise<IDailyAnalytics> {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const doc = await DailyAnalytics.findOneAndUpdate(
      { ArticleId: articleId, Date: startOfDay },
      { $set: { ViewCount: viewCount } },
      { new: true, upsert: true }
    ).exec();
    return doc!.toObject() as IDailyAnalytics;
  },

  async getTotalViewsByArticleIds(articleIds: string[]): Promise<Map<string, number>> {
    const result = await DailyAnalytics.aggregate([
      { $match: { ArticleId: { $in: articleIds } } },
      { $group: { _id: '$ArticleId', total: { $sum: '$ViewCount' } } },
    ]).exec();
    const map = new Map<string, number>();
    for (const r of result) map.set(r._id, r.total);
    return map;
  },
};

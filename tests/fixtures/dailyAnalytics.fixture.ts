import { IDailyAnalytics } from '../../src/entities/DailyAnalytics';
import { ARTICLE_IDS } from './articles.fixture';

const baseDate = new Date('2024-02-01T00:00:00.000Z');

export const DAILY_ANALYTICS_FIXTURE: IDailyAnalytics[] = [
  { _id: 'd1', Id: 'd1', ArticleId: ARTICLE_IDS[0], ViewCount: 42, Date: baseDate, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'd2', Id: 'd2', ArticleId: ARTICLE_IDS[1], ViewCount: 31, Date: baseDate, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'd3', Id: 'd3', ArticleId: ARTICLE_IDS[2], ViewCount: 28, Date: baseDate, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'd4', Id: 'd4', ArticleId: ARTICLE_IDS[3], ViewCount: 55, Date: baseDate, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'd5', Id: 'd5', ArticleId: ARTICLE_IDS[4], ViewCount: 12, Date: baseDate, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'd6', Id: 'd6', ArticleId: ARTICLE_IDS[5], ViewCount: 99, Date: baseDate, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'd7', Id: 'd7', ArticleId: ARTICLE_IDS[6], ViewCount: 7, Date: baseDate, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'd8', Id: 'd8', ArticleId: ARTICLE_IDS[7], ViewCount: 33, Date: baseDate, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'd9', Id: 'd9', ArticleId: ARTICLE_IDS[8], ViewCount: 18, Date: baseDate, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'd10', Id: 'd10', ArticleId: ARTICLE_IDS[9], ViewCount: 64, Date: baseDate, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'd11', Id: 'd11', ArticleId: ARTICLE_IDS[10], ViewCount: 22, Date: baseDate, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'd12', Id: 'd12', ArticleId: ARTICLE_IDS[11], ViewCount: 41, Date: baseDate, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'd13', Id: 'd13', ArticleId: ARTICLE_IDS[12], ViewCount: 3, Date: baseDate, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'd14', Id: 'd14', ArticleId: ARTICLE_IDS[13], ViewCount: 77, Date: baseDate, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'd15', Id: 'd15', ArticleId: ARTICLE_IDS[14], ViewCount: 15, Date: baseDate, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'd16', Id: 'd16', ArticleId: ARTICLE_IDS[15], ViewCount: 88, Date: baseDate, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'd17', Id: 'd17', ArticleId: ARTICLE_IDS[16], ViewCount: 29, Date: baseDate, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'd18', Id: 'd18', ArticleId: ARTICLE_IDS[17], ViewCount: 51, Date: baseDate, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'd19', Id: 'd19', ArticleId: ARTICLE_IDS[18], ViewCount: 6, Date: baseDate, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'd20', Id: 'd20', ArticleId: ARTICLE_IDS[19], ViewCount: 44, Date: baseDate, createdAt: baseDate, updatedAt: baseDate },
];

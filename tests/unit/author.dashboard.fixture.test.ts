/**
 * Author dashboard API tests using fixture data (20 articles, 20 daily analytics).
 */
import request from 'supertest';
import { app } from '../../src/app';
import { ARTICLES_FIXTURE, DAILY_ANALYTICS_FIXTURE, AUTHOR_IDS } from '../fixtures';
import { assertPaginatedResponse, assertErrorResponse } from '../helpers/responseAssertions';

jest.mock('../../src/repositories/article.repository');
jest.mock('../../src/repositories/analytics.repository');
jest.mock('jsonwebtoken', () => ({ verify: jest.fn((_t: string) => ({ sub: AUTHOR_IDS[0], role: 'author' })) }));

const articleRepo = require('../../src/repositories/article.repository').articleRepository;
const analyticsRepo = require('../../src/repositories/analytics.repository').analyticsRepository;

describe('Author dashboard API with fixture data', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns paginated dashboard with 20 items and TotalViews from 20 analytics', async () => {
    const list = ARTICLES_FIXTURE.map((a) => ({ Id: a.Id, Title: a.Title, CreatedAt: a.CreatedAt }));
    const viewMap = new Map(DAILY_ANALYTICS_FIXTURE.map((d) => [d.ArticleId, d.ViewCount]));
    articleRepo.listForDashboard.mockResolvedValue({ list, total: 20 });
    analyticsRepo.getTotalViewsByArticleIds.mockResolvedValue(viewMap);

    const res = await request(app)
      .get('/api/author/dashboard')
      .set('Authorization', 'Bearer token')
      .query({ page: 1, size: 20 });

    expect(res.status).toBe(200);
    assertPaginatedResponse(res.body);
    expect(res.body.Object).toHaveLength(20);
    expect(res.body.PageNumber).toBe(1);
    expect(res.body.PageSize).toBe(20);
    expect(res.body.TotalSize).toBe(20);
    res.body.Object.forEach((item: any, i: number) => {
      expect(item).toHaveProperty('Title');
      expect(item).toHaveProperty('CreatedAt');
      expect(item).toHaveProperty('TotalViews');
      expect(typeof item.TotalViews).toBe('number');
    });
  });

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/author/dashboard');
    expect(res.status).toBe(401);
    assertErrorResponse(res.body);
  });
});

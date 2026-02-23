import request from 'supertest';
import { app } from '../../src/app';

jest.mock('../../src/repositories/article.repository', () => ({
  articleRepository: {
    listForDashboard: jest.fn(),
  },
}));
jest.mock('../../src/repositories/analytics.repository', () => ({
  analyticsRepository: {
    getTotalViewsByArticleIds: jest.fn(),
  },
}));
jest.mock('jsonwebtoken', () => ({ verify: jest.fn((_t: string, _s: string) => ({ sub: 'author-1', role: 'author' })) }));

const { articleRepository } = require('../../src/repositories/article.repository');
const { analyticsRepository } = require('../../src/repositories/analytics.repository');

describe('GET /api/author/dashboard', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns paginated dashboard with TotalViews', async () => {
    articleRepository.listForDashboard.mockResolvedValue({
      list: [
        { Id: 'a1', Title: 'Post 1', CreatedAt: new Date() },
        { Id: 'a2', Title: 'Post 2', CreatedAt: new Date() },
      ],
      total: 2,
    });
    analyticsRepository.getTotalViewsByArticleIds.mockResolvedValue(new Map([['a1', 10], ['a2', 5]]));

    const res = await request(app)
      .get('/api/author/dashboard')
      .set('Authorization', 'Bearer fake-token')
      .query({ page: 1, size: 10 });

    expect(res.status).toBe(200);
    expect(res.body.Success).toBe(true);
    expect(res.body.Object).toHaveLength(2);
    expect(res.body.Object[0]).toMatchObject({ Title: 'Post 1', TotalViews: 10 });
    expect(res.body.Object[1]).toMatchObject({ Title: 'Post 2', TotalViews: 5 });
  });

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/author/dashboard');
    expect(res.status).toBe(401);
  });
});

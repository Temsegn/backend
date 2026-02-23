/**
 * API tests using fixture data (20 per model). Asserts all endpoints and response shape per spec.
 */
import request from 'supertest';
import { app } from '../../src/app';
import {
  USERS_FIXTURE,
  ARTICLES_FIXTURE,
  PUBLISHED_ARTICLES,
  AUTHOR_IDS,
  ARTICLE_IDS,
  READ_LOGS_FIXTURE,
  DAILY_ANALYTICS_FIXTURE,
} from '../fixtures';
import { assertBaseResponse, assertPaginatedResponse, assertErrorResponse } from '../helpers/responseAssertions';

jest.mock('../../src/repositories/user.repository');
jest.mock('../../src/repositories/article.repository');
jest.mock('../../src/repositories/readLog.repository');
jest.mock('../../src/repositories/analytics.repository');
jest.mock('../../src/services/readTracking.service', () => ({ recordReadAsync: jest.fn() }));
jest.mock('bcryptjs', () => ({ hash: jest.fn(() => Promise.resolve('hashed')), compare: jest.fn(() => Promise.resolve(true)) }));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mock-jwt'),
  verify: jest.fn((_t: string) => ({ sub: AUTHOR_IDS[0], role: 'author' })),
}));

const userRepo = require('../../src/repositories/user.repository').userRepository;
const articleRepo = require('../../src/repositories/article.repository').articleRepository;
const readLogRepo = require('../../src/repositories/readLog.repository').readLogRepository;
const analyticsRepo = require('../../src/repositories/analytics.repository').analyticsRepository;

describe('API response shape and fixture data', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('Base response (Success, Message, Object, Errors)', () => {
    it('POST /api/auth/signup returns base response with 20th fixture user', async () => {
      const user = USERS_FIXTURE[19];
      userRepo.existsByEmail.mockResolvedValue(false);
      userRepo.create.mockResolvedValue({ ...user, Password: 'hashed' });

      const res = await request(app)
        .post('/api/auth/signup')
        .send({ Name: user.Name, Email: user.Email, Password: 'Pass@1234', Role: user.Role });

      expect(res.status).toBe(201);
      assertBaseResponse(res.body);
      expect(res.body.Success).toBe(true);
      expect(res.body.Message).toBeDefined();
      expect(res.body.Object).toMatchObject({ Name: user.Name, Email: user.Email, Role: user.Role });
      expect(res.body.Errors).toBeNull();
    });

    it('POST /api/auth/login returns base response with token and user', async () => {
      const user = USERS_FIXTURE[0];
      userRepo.findByEmail.mockResolvedValue({ ...user, Password: 'hashed' });

      const res = await request(app).post('/api/auth/login').send({ Email: user.Email, Password: 'Pass@1234' });

      expect(res.status).toBe(200);
      assertBaseResponse(res.body);
      expect(res.body.Success).toBe(true);
      expect(res.body.Object).toHaveProperty('token');
      expect(res.body.Object).toHaveProperty('user');
      expect(res.body.Errors).toBeNull();
    });

    it('GET /api/articles/:id returns base response with single article', async () => {
      const article = ARTICLES_FIXTURE[0];
      articleRepo.findById.mockResolvedValue(article);
      readLogRepo.findRecentRead.mockResolvedValue(null);
      readLogRepo.create.mockResolvedValue({});

      const res = await request(app).get(`/api/articles/${article.Id}`);

      expect(res.status).toBe(200);
      assertBaseResponse(res.body);
      expect(res.body.Success).toBe(true);
      expect(res.body.Object).toMatchObject({ Id: article.Id, Title: article.Title });
      expect(res.body.Errors).toBeNull();
    });
  });

  describe('Paginated response (Object array, PageNumber, PageSize, TotalSize)', () => {
    it('GET /api/articles returns paginated response with 20 published articles', async () => {
      articleRepo.listPublic.mockResolvedValue({ list: PUBLISHED_ARTICLES, total: PUBLISHED_ARTICLES.length });

      const res = await request(app).get('/api/articles').query({ page: 1, size: 20 });

      expect(res.status).toBe(200);
      assertPaginatedResponse(res.body);
      expect(res.body.Success).toBe(true);
      expect(res.body.Object).toHaveLength(PUBLISHED_ARTICLES.length);
      expect(res.body.PageNumber).toBe(1);
      expect(res.body.PageSize).toBe(20);
      expect(res.body.TotalSize).toBe(PUBLISHED_ARTICLES.length);
      expect(res.body.Errors).toBeNull();
    });

    it('GET /api/articles/me returns paginated response with 20 articles for author', async () => {
      const authorArticles = ARTICLES_FIXTURE.filter((a) => a.AuthorId === AUTHOR_IDS[0]);
      articleRepo.findByAuthorId.mockResolvedValue({ list: authorArticles, total: authorArticles.length });

      const res = await request(app)
        .get('/api/articles/me')
        .set('Authorization', 'Bearer token')
        .query({ page: 1, size: 20 });

      expect(res.status).toBe(200);
      assertPaginatedResponse(res.body);
      expect(res.body.Success).toBe(true);
      expect(Array.isArray(res.body.Object)).toBe(true);
      expect(res.body.PageNumber).toBe(1);
      expect(res.body.PageSize).toBe(20);
      expect(res.body.Errors).toBeNull();
    });

    it('GET /api/author/dashboard returns paginated response with TotalViews from 20 analytics', async () => {
      const list = ARTICLES_FIXTURE.slice(0, 20).map((a) => ({ Id: a.Id, Title: a.Title, CreatedAt: a.CreatedAt }));
      const viewMap = new Map(DAILY_ANALYTICS_FIXTURE.map((d) => [d.ArticleId, d.ViewCount]));
      articleRepo.listForDashboard.mockResolvedValue({ list, total: 20 });
      analyticsRepo.getTotalViewsByArticleIds.mockResolvedValue(viewMap);

      const res = await request(app)
        .get('/api/author/dashboard')
        .set('Authorization', 'Bearer token')
        .query({ page: 1, size: 20 });

      expect(res.status).toBe(200);
      assertPaginatedResponse(res.body);
      expect(res.body.Success).toBe(true);
      expect(res.body.Object).toHaveLength(20);
      expect(res.body.Object[0]).toHaveProperty('Title');
      expect(res.body.Object[0]).toHaveProperty('CreatedAt');
      expect(res.body.Object[0]).toHaveProperty('TotalViews');
      expect(res.body.PageNumber).toBe(1);
      expect(res.body.PageSize).toBe(20);
      expect(res.body.TotalSize).toBe(20);
      expect(res.body.Errors).toBeNull();
    });
  });

  describe('Error response (Success: false, Errors array)', () => {
    it('POST /api/auth/signup returns 409 with Errors when email exists', async () => {
      userRepo.existsByEmail.mockResolvedValue(true);

      const res = await request(app)
        .post('/api/auth/signup')
        .send({ Name: 'Alice', Email: 'alice@test.com', Password: 'Pass@1234', Role: 'author' });

      expect(res.status).toBe(409);
      assertErrorResponse(res.body);
      expect(res.body.Success).toBe(false);
      expect(res.body.Errors).toBeDefined();
      expect(res.body.Errors.length).toBeGreaterThan(0);
    });

    it('GET /api/articles/:id returns 404 with message when article deleted', async () => {
      articleRepo.findById.mockResolvedValue(null);

      const res = await request(app).get(`/api/articles/${ARTICLE_IDS[0]}`);

      expect(res.status).toBe(404);
      assertErrorResponse(res.body);
      expect(res.body.Success).toBe(false);
      expect(res.body.Message).toBeDefined();
      expect(res.body.Errors).toContainEqual(expect.stringMatching(/no longer available/));
    });

    it('Protected routes return 401 without token', async () => {
      const res = await request(app).get('/api/articles/me');
      expect(res.status).toBe(401);
      assertErrorResponse(res.body);
      expect(res.body.Success).toBe(false);
    });
  });

  describe('Fixture data integrity (20 per model)', () => {
    it('users fixture has 20 records', () => {
      expect(USERS_FIXTURE).toHaveLength(20);
      expect(USERS_FIXTURE.every((u) => u.Id && u.Email && u.Role)).toBe(true);
    });
    it('articles fixture has 20 records', () => {
      expect(ARTICLES_FIXTURE).toHaveLength(20);
      expect(ARTICLES_FIXTURE.every((a) => a.Id && a.AuthorId && a.Title.length >= 1 && a.Content.length >= 50)).toBe(true);
    });
    it('readLogs fixture has 20 records', () => {
      expect(READ_LOGS_FIXTURE).toHaveLength(20);
      expect(READ_LOGS_FIXTURE.every((r) => r.Id && r.ArticleId && r.ReadAt)).toBe(true);
    });
    it('dailyAnalytics fixture has 20 records', () => {
      expect(DAILY_ANALYTICS_FIXTURE).toHaveLength(20);
      expect(DAILY_ANALYTICS_FIXTURE.every((d) => d.Id && d.ArticleId && typeof d.ViewCount === 'number')).toBe(true);
    });
  });
});

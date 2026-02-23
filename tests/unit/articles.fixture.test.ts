/**
 * Articles API tests using fixture data (20 articles, readLogs).
 */
import request from 'supertest';
import { app } from '../../src/app';
import { ARTICLES_FIXTURE, PUBLISHED_ARTICLES, ARTICLE_IDS, AUTHOR_IDS } from '../fixtures';
import { assertBaseResponse, assertPaginatedResponse, assertErrorResponse } from '../helpers/responseAssertions';

jest.mock('../../src/repositories/article.repository');
jest.mock('../../src/repositories/readLog.repository');
jest.mock('../../src/services/readTracking.service', () => ({ recordReadAsync: jest.fn() }));
jest.mock('jsonwebtoken', () => ({ verify: jest.fn((_t: string) => ({ sub: AUTHOR_IDS[0], role: 'author' })) }));

const articleRepo = require('../../src/repositories/article.repository').articleRepository;
const readLogRepo = require('../../src/repositories/readLog.repository').readLogRepository;

describe('Articles API with fixture data', () => {
  beforeEach(() => jest.clearAllMocks());

  it('fixture has 20 articles', () => {
    expect(ARTICLES_FIXTURE).toHaveLength(20);
  });

  describe('GET /api/articles', () => {
    it('returns paginated response with all 20 published articles when size=20', async () => {
      articleRepo.listPublic.mockResolvedValue({ list: PUBLISHED_ARTICLES, total: PUBLISHED_ARTICLES.length });

      const res = await request(app).get('/api/articles').query({ page: 1, size: 20 });

      expect(res.status).toBe(200);
      assertPaginatedResponse(res.body);
      expect(res.body.Object).toHaveLength(PUBLISHED_ARTICLES.length);
      expect(res.body.TotalSize).toBe(PUBLISHED_ARTICLES.length);
    });

    it('returns paginated response with category filter', async () => {
      const techArticles = PUBLISHED_ARTICLES.filter((a) => a.Category === 'Tech');
      articleRepo.listPublic.mockResolvedValue({ list: techArticles, total: techArticles.length });

      const res = await request(app).get('/api/articles').query({ category: 'Tech', page: 1, size: 10 });
      expect(res.status).toBe(200);
      assertPaginatedResponse(res.body);
    });
  });

  describe('GET /api/articles/:id', () => {
    it('returns base response with article for each of first 5 fixture articles', async () => {
      articleRepo.findById.mockImplementation((id: string) => {
        const art = ARTICLES_FIXTURE.find((a) => a.Id === id);
        return Promise.resolve(art ?? null);
      });
      readLogRepo.findRecentRead.mockResolvedValue(null);
      readLogRepo.create.mockResolvedValue({});

      for (let i = 0; i < 5; i++) {
        const article = ARTICLES_FIXTURE[i];
        const res = await request(app).get(`/api/articles/${article.Id}`);
        expect(res.status).toBe(200);
        assertBaseResponse(res.body);
        expect(res.body.Object).toMatchObject({ Id: article.Id, Title: article.Title });
      }
    });

    it('returns 404 with Errors when article not found', async () => {
      articleRepo.findById.mockResolvedValue(null);
      const res = await request(app).get('/api/articles/nonexistent-id');
      expect(res.status).toBe(404);
      assertErrorResponse(res.body);
      expect(res.body.Errors?.[0]).toMatch(/no longer available/);
    });
  });

  describe('POST /api/articles', () => {
    it('returns 201 and base response when author creates article (fixture-like data)', async () => {
      const newArticle = { ...ARTICLES_FIXTURE[0], Id: 'new-1', Title: 'New Title' };
      articleRepo.create.mockResolvedValue(newArticle);

      const res = await request(app)
        .post('/api/articles')
        .set('Authorization', 'Bearer token')
        .send({
          Title: newArticle.Title,
          Content: newArticle.Content,
          Category: newArticle.Category,
          Status: 'Draft',
        });
      expect(res.status).toBe(201);
      assertBaseResponse(res.body);
      expect(res.body.Object).toMatchObject({ Title: newArticle.Title });
    });

    it('returns 401 without token', async () => {
      const res = await request(app)
        .post('/api/articles')
        .send({ Title: 'T', Content: 'A'.repeat(50), Category: 'Tech' });
      expect(res.status).toBe(401);
      assertErrorResponse(res.body);
    });
  });

  describe('GET /api/articles/me', () => {
    it('returns paginated list of author articles (20 items)', async () => {
      const myArticles = ARTICLES_FIXTURE.filter((a) => a.AuthorId === AUTHOR_IDS[0]);
      articleRepo.findByAuthorId.mockResolvedValue({ list: myArticles, total: myArticles.length });

      const res = await request(app).get('/api/articles/me').set('Authorization', 'Bearer token').query({ page: 1, size: 20 });
      expect(res.status).toBe(200);
      assertPaginatedResponse(res.body);
      expect(Array.isArray(res.body.Object)).toBe(true);
    });
  });

  describe('PUT /api/articles/:id', () => {
    it('returns 403 when article belongs to another author', async () => {
      const article = ARTICLES_FIXTURE.find((a) => a.AuthorId !== AUTHOR_IDS[0])!;
      articleRepo.findById.mockResolvedValue(article);
      articleRepo.updateById.mockResolvedValue(null);

      const res = await request(app)
        .put(`/api/articles/${article.Id}`)
        .set('Authorization', 'Bearer token')
        .send({ Title: 'Updated' });
      expect(res.status).toBe(403);
      assertErrorResponse(res.body);
      expect(res.body.Message).toBe('Forbidden');
    });
  });

  describe('DELETE /api/articles/:id', () => {
    it('returns 200 when author soft-deletes own article', async () => {
      const article = ARTICLES_FIXTURE.find((a) => a.AuthorId === AUTHOR_IDS[0])!;
      articleRepo.findById.mockResolvedValue(article);
      articleRepo.softDelete.mockResolvedValue(true);

      const res = await request(app).delete(`/api/articles/${article.Id}`).set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      assertBaseResponse(res.body);
      expect(res.body.Success).toBe(true);
    });
  });
});

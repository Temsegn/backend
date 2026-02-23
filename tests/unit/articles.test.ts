import request from 'supertest';
import { app } from '../../src/app';
import { articleRepository } from '../../src/repositories/article.repository';
import { readLogRepository } from '../../src/repositories/readLog.repository';

jest.mock('../../src/repositories/article.repository');
jest.mock('../../src/repositories/readLog.repository');
jest.mock('../../src/services/readTracking.service', () => ({ recordReadAsync: jest.fn() }));
jest.mock('jsonwebtoken', () => ({ verify: jest.fn((_t: string, _s: string) => ({ sub: 'author-1', role: 'author' })) });

const mockArticleRepo = articleRepository as jest.Mocked<typeof articleRepository>;
const mockReadLogRepo = readLogRepository as jest.Mocked<typeof readLogRepository>;

const validArticle = {
  Id: 'art-1',
  Title: 'Test Article',
  Content: 'This is the content of the article that is at least fifty characters long for validation.',
  Category: 'Tech',
  Status: 'Published' as const,
  AuthorId: 'author-1',
  CreatedAt: new Date(),
  DeletedAt: null,
  _id: 'art-1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Articles API', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('GET /api/articles', () => {
    it('returns paginated published articles', async () => {
      mockArticleRepo.listPublic.mockResolvedValue({ list: [validArticle], total: 1 });

      const res = await request(app).get('/api/articles').query({ page: 1, size: 10 });

      expect(res.status).toBe(200);
      expect(res.body.Success).toBe(true);
      expect(res.body.Object).toHaveLength(1);
      expect(res.body.PageNumber).toBe(1);
      expect(res.body.PageSize).toBe(10);
      expect(res.body.TotalSize).toBe(1);
    });
  });

  describe('GET /api/articles/:id', () => {
    it('returns article and records read when found', async () => {
      mockArticleRepo.findById.mockResolvedValue(validArticle as any);
      mockReadLogRepo.findRecentRead.mockResolvedValue(null);
      mockReadLogRepo.create.mockResolvedValue({} as any);

      const res = await request(app).get('/api/articles/art-1');

      expect(res.status).toBe(200);
      expect(res.body.Object.Title).toBe('Test Article');
    });

    it('returns 404 when article not found or deleted', async () => {
      mockArticleRepo.findById.mockResolvedValue(null);

      const res = await request(app).get('/api/articles/nonexistent');

      expect(res.status).toBe(404);
      expect(res.body.Success).toBe(false);
      expect(res.body.Errors).toBeDefined();
expect(res.body.Errors?.[0]).toMatch(/no longer available/);
    });
  });

  describe('POST /api/articles (author)', () => {
    it('returns 401 without token', async () => {
      const res = await request(app)
        .post('/api/articles')
        .send({
          Title: 'New',
          Content: 'A'.repeat(50),
          Category: 'Tech',
        });
      expect(res.status).toBe(401);
    });

    it('returns 201 when author creates article', async () => {
      mockArticleRepo.create.mockResolvedValue(validArticle as any);

      const res = await request(app)
        .post('/api/articles')
        .set('Authorization', 'Bearer fake-token')
        .send({
          Title: 'New Article',
          Content: 'A'.repeat(50),
          Category: 'Tech',
          Status: 'Draft',
        });

      expect(res.status).toBe(201);
      expect(res.body.Success).toBe(true);
      expect(res.body.Object).toMatchObject({ Title: 'New Article', Status: 'Draft' });
    });
  });

  describe('PUT /api/articles/:id', () => {
    it('returns 403 when article belongs to another author', async () => {
      mockArticleRepo.findById.mockResolvedValue({ ...validArticle, AuthorId: 'other-author' } as any);
      mockArticleRepo.updateById.mockResolvedValue(null);

      const res = await request(app)
        .put('/api/articles/art-1')
        .set('Authorization', 'Bearer fake-token')
        .send({ Title: 'Updated' });

      expect(res.status).toBe(403);
      expect(res.body.Message).toBe('Forbidden');
    });
  });

  describe('DELETE /api/articles/:id', () => {
    it('soft-deletes and returns 200 when author owns article', async () => {
      mockArticleRepo.findById.mockResolvedValue(validArticle as any);
      mockArticleRepo.softDelete.mockResolvedValue(true);

      const res = await request(app)
        .delete('/api/articles/art-1')
        .set('Authorization', 'Bearer fake-token');

      expect(res.status).toBe(200);
      expect(mockArticleRepo.softDelete).toHaveBeenCalledWith('art-1', 'author-1');
    });
  });
});

import { articleRepository } from '../repositories/article.repository';
import { IArticle } from '../entities/Article';
import { ListPublicFilters } from '../repositories/article.repository';

export const articleService = {
  async create(authorId: string, data: { Title: string; Content: string; Category: string; Status?: 'Draft' | 'Published' }): Promise<IArticle> {
    return articleRepository.create({
      Title: data.Title.trim(),
      Content: data.Content.trim(),
      Category: data.Category.trim(),
      Status: data.Status || 'Draft',
      AuthorId: authorId,
    });
  },

  async listPublic(filters: ListPublicFilters) {
    return articleRepository.listPublic(filters);
  },

  async getById(id: string, excludeDeleted = true): Promise<IArticle | null> {
    return articleRepository.findById(id, excludeDeleted);
  },

  async getByIdForAuthor(id: string, authorId: string): Promise<IArticle | null> {
    const article = await articleRepository.findById(id, false);
    if (!article || article.AuthorId !== authorId) return null;
    return article;
  },

  async listByAuthor(authorId: string, page: number, size: number, includeDeleted = false) {
    return articleRepository.findByAuthorId(authorId, { page, size, includeDeleted });
  },

  async update(id: string, authorId: string, data: Partial<Pick<IArticle, 'Title' | 'Content' | 'Category' | 'Status'>>): Promise<IArticle | null> {
    return articleRepository.updateById(id, authorId, data);
  },

  async softDelete(id: string, authorId: string): Promise<boolean> {
    return articleRepository.softDelete(id, authorId);
  },

  async listForDashboard(authorId: string, page: number, size: number) {
    return articleRepository.listForDashboard(authorId, page, size);
  },
};

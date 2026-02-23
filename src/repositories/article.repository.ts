import { Article, IArticle } from '../entities/Article';
import { User } from '../entities/User';
import mongoose from 'mongoose';

export interface ListPublicFilters {
  category?: string;
  author?: string;
  q?: string;
  page: number;
  size: number;
}

export interface ListPublicResult {
  list: IArticle[];
  total: number;
}

export const articleRepository = {
  async create(data: Partial<IArticle>): Promise<IArticle> {
    const article = new Article(data);
    return article.save();
  },

  async findById(id: string, excludeDeleted = true): Promise<IArticle | null> {
    const query: Record<string, unknown> = { Id: id };
    if (excludeDeleted) query.DeletedAt = null;
    return Article.findOne(query).lean().exec().then((doc) => (doc ? (doc as IArticle) : null));
  },

  async findByAuthorId(authorId: string, options: { page: number; size: number; includeDeleted?: boolean }): Promise<ListPublicResult> {
    const { page, size, includeDeleted = false } = options;
    const query: Record<string, unknown> = { AuthorId: authorId };
    if (!includeDeleted) query.DeletedAt = null;
    const skip = (page - 1) * size;
    const [list, total] = await Promise.all([
      Article.find(query).sort({ CreatedAt: -1 }).skip(skip).limit(size).lean().exec(),
      Article.countDocuments(query).exec(),
    ]);
    return { list: list as IArticle[], total };
  },

  async listPublic(filters: ListPublicFilters): Promise<ListPublicResult> {
    const { category, author, q, page, size } = filters;
    const query: Record<string, unknown> = { Status: 'Published', DeletedAt: null };
    if (category) query.Category = category;
    if (q && q.trim()) query.Title = { $regex: q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    const skip = (page - 1) * size;
    const aggregate = Article.aggregate([
      { $match: query },
      ...(author
        ? [
            {
              $lookup: { from: 'users', localField: 'AuthorId', foreignField: 'Id', as: 'authorDoc' },
            },
            { $unwind: '$authorDoc' },
            { $match: { 'authorDoc.Name': { $regex: author, $options: 'i' } } },
            { $project: { authorDoc: 0 } },
          ]
        : []),
      { $facet: { list: [{ $sort: { CreatedAt: -1 } }, { $skip: skip }, { $limit: size }], total: [{ $count: 'count' }] } },
      { $unwind: '$total' },
      { $project: { list: 1, total: '$total.count' } },
    ]);
    const result = await aggregate.exec();
    if (!result.length) return { list: [], total: 0 };
    const [{ list, total }] = result;
    return { list: list as IArticle[], total: total as number };
  },

  async updateById(id: string, authorId: string, data: Partial<IArticle>): Promise<IArticle | null> {
    const updated = await Article.findOneAndUpdate(
      { Id: id, AuthorId: authorId, DeletedAt: null },
      { $set: data },
      { new: true }
    )
      .lean()
      .exec();
    return updated ? (updated as IArticle) : null;
  },

  async softDelete(id: string, authorId: string): Promise<boolean> {
    const result = await Article.updateOne(
      { Id: id, AuthorId: authorId, DeletedAt: null },
      { $set: { DeletedAt: new Date() } }
    ).exec();
    return result.modifiedCount > 0;
  },

  async listForDashboard(authorId: string, page: number, size: number): Promise<{ list: IArticle[]; total: number }> {
    const query = { AuthorId: authorId, DeletedAt: null };
    const skip = (page - 1) * size;
    const [list, total] = await Promise.all([
      Article.find(query).sort({ CreatedAt: -1 }).skip(skip).limit(size).lean().exec(),
      Article.countDocuments(query).exec(),
    ]);
    return { list: list as IArticle[], total };
  },
};

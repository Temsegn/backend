import { Response } from 'express';
import { articleService } from '../services/article.service';
import { recordReadAsync } from '../services/readTracking.service';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthRequest } from '../types';
import { PAGINATION } from '../utils/constants';

export async function createArticle(req: AuthRequest, res: Response): Promise<void> {
  try {
    const authorId = req.user!.sub;
    const { Title, Content, Category, Status } = req.body;
    const article = await articleService.create(authorId, { Title, Content, Category, Status });
    sendSuccess(res, 'Article created', article, 201);
  } catch (err) {
    throw err;
  }
}

export async function listMyArticles(req: AuthRequest, res: Response): Promise<void> {
  try {
    const authorId = req.user!.sub;
    const page = Number(req.query.page) || PAGINATION.DEFAULT_PAGE;
    const size = Number(req.query.size) || PAGINATION.DEFAULT_PAGE_SIZE;
    const includeDeleted = req.query.includeDeleted === 'true';
    const { list, total } = await articleService.listByAuthor(authorId, page, size, includeDeleted);
    sendPaginated(res, 'Articles retrieved', list, page, size, total);
  } catch (err) {
    throw err;
  }
}

export async function updateArticle(req: AuthRequest, res: Response): Promise<void> {
  try {
    const authorId = req.user!.sub;
    const id = req.params.id as string;
    const article = await articleService.getByIdForAuthor(id, authorId);
    if (!article) {
      sendError(res, 'Forbidden', ['You can only edit your own articles'], 403);
      return;
    }
    const { Title, Content, Category, Status } = req.body;
    const updated = await articleService.update(id, authorId, {
      ...(Title !== undefined && { Title }),
      ...(Content !== undefined && { Content }),
      ...(Category !== undefined && { Category }),
      ...(Status !== undefined && { Status }),
    });
    if (!updated) {
      sendError(res, 'Forbidden', ['You can only edit your own articles'], 403);
      return;
    }
    sendSuccess(res, 'Article updated', updated);
  } catch (err) {
    throw err;
  }
}

export async function deleteArticle(req: AuthRequest, res: Response): Promise<void> {
  try {
    const authorId = req.user!.sub;
    const id = req.params.id as string;
    const article = await articleService.getByIdForAuthor(id, authorId);
    if (!article) {
      sendError(res, 'Forbidden', ['You can only delete your own articles'], 403);
      return;
    }
    const deleted = await articleService.softDelete(id, authorId);
    if (!deleted) {
      sendError(res, 'Forbidden', ['You can only delete your own articles'], 403);
      return;
    }
    sendSuccess(res, 'Article deleted');
  } catch (err) {
    throw err;
  }
}

export async function listPublicArticles(req: AuthRequest, res: Response): Promise<void> {
  try {
    const page = Number(req.query.page) || PAGINATION.DEFAULT_PAGE;
    const size = Number(req.query.size) || PAGINATION.DEFAULT_PAGE_SIZE;
    const category = req.query.category as string | undefined;
    const author = req.query.author as string | undefined;
    const q = req.query.q as string | undefined;
    const { list, total } = await articleService.listPublic({
      page,
      size,
      category,
      author,
      q,
    });
    sendPaginated(res, 'Articles retrieved', list, page, size, total);
  } catch (err) {
    throw err;
  }
}

export async function getArticleById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const article = await articleService.getById(id, true);
    if (!article) {
      sendError(res, 'Not found', ['News article no longer available'], 404);
      return;
    }
    const readerId = req.user ? req.user.sub : null;
    recordReadAsync(id, readerId);
    sendSuccess(res, 'Article retrieved', article);
  } catch (err) {
    throw err;
  }
}

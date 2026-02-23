import { Response } from 'express';
import { getAuthorDashboard } from '../services/analytics.service';
import { sendPaginated } from '../utils/response';
import { AuthRequest } from '../types';
import { PAGINATION } from '../utils/constants';

export async function dashboard(req: AuthRequest, res: Response): Promise<void> {
  try {
    const authorId = req.user!.sub;
    const page = Number(req.query.page) || PAGINATION.DEFAULT_PAGE;
    const size = Number(req.query.size) || PAGINATION.DEFAULT_PAGE_SIZE;
    const { list, total } = await getAuthorDashboard(authorId, page, size);
    sendPaginated(res, 'Dashboard retrieved', list, page, size, total);
  } catch (err) {
    throw err;
  }
}

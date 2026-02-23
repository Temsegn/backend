import { Request } from 'express';
import { Role } from '../utils/constants';

export interface JwtPayload {
  sub: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface PaginationQuery {
  page?: number;
  size?: number;
}

export interface ArticleListQuery extends PaginationQuery {
  category?: string;
  author?: string;
  q?: string;
}

export interface ArticlesMeQuery extends PaginationQuery {
  includeDeleted?: boolean;
}

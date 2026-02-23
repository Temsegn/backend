import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/environment';
import { sendError } from '../utils/response';
import { AuthRequest, JwtPayload } from '../types';
import { Role } from '../utils/constants';

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    sendError(res, 'Unauthorized', ['Token is required'], 401);
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = { sub: decoded.sub, role: decoded.role };
    next();
  } catch {
    sendError(res, 'Unauthorized', ['Invalid or expired token'], 401);
  }
}

export function requireRole(...allowedRoles: Role[]): (req: AuthRequest, res: Response, next: NextFunction) => void {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Unauthorized', ['Authentication required'], 401);
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      sendError(res, 'Forbidden', ['Insufficient permissions'], 403);
      return;
    }
    next();
  };
}

export const authorOnly = requireRole('author');
export const readerOnly = requireRole('reader');

/** Sets req.user if valid token present; does not fail if missing or invalid. Use for public read where ReaderId is optional. */
export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    next();
    return;
  }
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = { sub: decoded.sub, role: decoded.role };
  } catch {
    // ignore invalid token for optional auth
  }
  next();
}

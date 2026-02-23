import { Request, Response, NextFunction } from 'express';

/**
 * Security middleware: prevent leaking stack traces and set safe headers.
 */
export function security(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
}

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { sendError } from '../utils/response';

export interface AppError extends Error {
  statusCode?: number;
  errors?: string[];
}

export function errorHandler(err: AppError, _req: Request, res: Response, _next: NextFunction): void {
  logger.error('Error:', err.message, err.stack);

  const statusCode = err.statusCode ?? 500;
  const errors = Array.isArray(err.errors) ? err.errors : [err.message || 'Internal server error'];

  if (statusCode === 500) {
    sendError(res, 'Internal server error', ['An unexpected error occurred'], 500);
    return;
  }

  sendError(res, err.message || 'Error', errors, statusCode);
}

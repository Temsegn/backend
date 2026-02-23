import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { sendError } from '../utils/response';

export function validate(validations: ValidationChain[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await Promise.all(validations.map((v) => v.run(req)));
    const result = validationResult(req);
    if (result.isEmpty()) {
      next();
      return;
    }
    const errors = result.array().map((e) => (e.type === 'field' ? `${e.path}: ${e.msg}` : e.msg));
    sendError(res, 'Validation failed', errors, 400);
  };
}

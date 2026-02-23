import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { Success: false, Message: 'Too many requests', Object: null, Errors: ['Too many requests, try again later'] },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { Success: false, Message: 'Too many attempts', Object: null, Errors: ['Too many login/signup attempts'] },
  standardHeaders: true,
  legacyHeaders: false,
});

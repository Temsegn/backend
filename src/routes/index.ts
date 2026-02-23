import { Router } from 'express';
import { authenticate, optionalAuth, authorOnly } from '../middleware/auth';
import { validate } from '../middleware/validation';
import {
  signupValidation,
  loginValidation,
} from '../validators/auth.validator';
import {
  createArticleValidation,
  updateArticleValidation,
  articleIdParamValidation,
  listArticlesValidation,
  articlesMeValidation,
  dashboardValidation,
} from '../validators/article.validator';
import * as authController from '../controllers/auth.controller';
import * as articleController from '../controllers/article.controller';
import * as authorController from '../controllers/author.controller';

const router = Router();

// Auth (public, rate-limited separately in server)
router.post('/auth/signup', validate(signupValidation), authController.signup);
router.post('/auth/login', validate(loginValidation), authController.login);

// Public news feed – only published, not deleted; paginated; category, author, q
router.get('/articles', validate(listArticlesValidation), articleController.listPublicArticles);

// Author-only: list my articles (must be before /articles/:id so "me" is not captured as id)
router.get(
  '/articles/me',
  authenticate,
  authorOnly,
  validate(articlesMeValidation),
  articleController.listMyArticles
);

// Single article read – optional auth for ReaderId; records ReadLog; blocks deleted
router.get(
  '/articles/:id',
  optionalAuth,
  validate(articleIdParamValidation),
  articleController.getArticleById
);

// Author-only: CRUD my articles
router.post(
  '/articles',
  authenticate,
  authorOnly,
  validate(createArticleValidation),
  articleController.createArticle
);
router.put(
  '/articles/:id',
  authenticate,
  authorOnly,
  validate(updateArticleValidation),
  articleController.updateArticle
);
router.delete(
  '/articles/:id',
  authenticate,
  authorOnly,
  validate(articleIdParamValidation),
  articleController.deleteArticle
);

// Author dashboard – paginated articles with TotalViews
router.get(
  '/author/dashboard',
  authenticate,
  authorOnly,
  validate(dashboardValidation),
  authorController.dashboard
);

export default router;

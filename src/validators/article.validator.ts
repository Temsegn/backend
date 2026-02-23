import { body, param, query, ValidationChain } from 'express-validator';
import { ARTICLE, PAGINATION } from '../utils/constants';

export const createArticleValidation: ValidationChain[] = [
  body('Title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: ARTICLE.TITLE_MIN, max: ARTICLE.TITLE_MAX })
    .withMessage(`Title must be between ${ARTICLE.TITLE_MIN} and ${ARTICLE.TITLE_MAX} characters`),
  body('Content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: ARTICLE.CONTENT_MIN })
    .withMessage(`Content must be at least ${ARTICLE.CONTENT_MIN} characters`),
  body('Category').trim().notEmpty().withMessage('Category is required'),
  body('Status').optional().isIn(['Draft', 'Published']).withMessage('Status must be Draft or Published'),
];

export const updateArticleValidation: ValidationChain[] = [
  param('id').isString().trim().notEmpty().withMessage('Article ID is required'),
  body('Title')
    .optional()
    .trim()
    .isLength({ min: ARTICLE.TITLE_MIN, max: ARTICLE.TITLE_MAX })
    .withMessage(`Title must be between ${ARTICLE.TITLE_MIN} and ${ARTICLE.TITLE_MAX} characters`),
  body('Content')
    .optional()
    .trim()
    .isLength({ min: ARTICLE.CONTENT_MIN })
    .withMessage(`Content must be at least ${ARTICLE.CONTENT_MIN} characters`),
  body('Category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('Status').optional().isIn(['Draft', 'Published']).withMessage('Status must be Draft or Published'),
];

export const articleIdParamValidation: ValidationChain[] = [
  param('id').isString().trim().notEmpty().withMessage('Article ID is required'),
];

export const listArticlesValidation: ValidationChain[] = [
  query('page').optional().isInt({ min: 1 }).toInt().withMessage('Page must be a positive integer'),
  query('size').optional().isInt({ min: 1, max: PAGINATION.MAX_PAGE_SIZE }).toInt().withMessage('Invalid page size'),
  query('category').optional().trim(),
  query('author').optional().trim(),
  query('q').optional().trim(),
];

export const articlesMeValidation: ValidationChain[] = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('size').optional().isInt({ min: 1, max: PAGINATION.MAX_PAGE_SIZE }).toInt(),
  query('includeDeleted').optional().isBoolean().toBoolean(),
];

export const dashboardValidation: ValidationChain[] = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('size').optional().isInt({ min: 1, max: PAGINATION.MAX_PAGE_SIZE }).toInt(),
];

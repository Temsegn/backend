import { body, ValidationChain } from 'express-validator';
import { ROLES, NAME_REGEX, PASSWORD } from '../utils/constants';

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const signupValidation: ValidationChain[] = [
  body('Name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .matches(NAME_REGEX)
    .withMessage('Name must contain only alphabets and spaces'),
  body('Email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('Password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: PASSWORD.MIN_LENGTH })
    .withMessage(`Password must be at least ${PASSWORD.MIN_LENGTH} characters`)
    .matches(strongPasswordRegex)
    .withMessage(
      'Password must contain at least one uppercase, one lowercase, one number, and one special character'
    ),
  body('Role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(ROLES)
    .withMessage(`Role must be one of: ${ROLES.join(', ')}`),
];

export const loginValidation: ValidationChain[] = [
  body('Email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email').normalizeEmail(),
  body('Password').notEmpty().withMessage('Password is required'),
];

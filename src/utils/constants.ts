export const ROLES = ['author', 'reader'] as const;
export type Role = (typeof ROLES)[number];

export const ARTICLE_STATUS = ['Draft', 'Published'] as const;
export type ArticleStatus = (typeof ARTICLE_STATUS)[number];

export const CATEGORIES = ['Politics', 'Tech', 'Sports', 'Health', 'Science', 'Entertainment', 'Other'] as const;
export type Category = (typeof CATEGORIES)[number];

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

export const PASSWORD = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL: true,
} as const;

export const ARTICLE = {
  TITLE_MIN: 1,
  TITLE_MAX: 150,
  CONTENT_MIN: 50,
} as const;

export const NAME_REGEX = /^[a-zA-Z\s]+$/;

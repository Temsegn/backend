import { IArticle } from '../../src/entities/Article';
import { AUTHOR_IDS } from './users.fixture';

const baseDate = new Date('2024-01-15T12:00:00.000Z');
const minContent = 'This article has at least fifty characters of content for validation.';

export const ARTICLES_FIXTURE: IArticle[] = [
  { _id: 'a1', Id: 'a1', Title: 'Tech Trends 2024', Content: minContent + ' More.', Category: 'Tech', Status: 'Published', AuthorId: AUTHOR_IDS[0], CreatedAt: baseDate, DeletedAt: null, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'a2', Id: 'a2', Title: 'Politics Today', Content: minContent + ' Politics.', Category: 'Politics', Status: 'Published', AuthorId: AUTHOR_IDS[1], CreatedAt: baseDate, DeletedAt: null, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'a3', Id: 'a3', Title: 'Sports Roundup', Content: minContent + ' Sports.', Category: 'Sports', Status: 'Published', AuthorId: AUTHOR_IDS[2], CreatedAt: baseDate, DeletedAt: null, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'a4', Id: 'a4', Title: 'Health and Wellness', Content: minContent + ' Health.', Category: 'Health', Status: 'Published', AuthorId: AUTHOR_IDS[3], CreatedAt: baseDate, DeletedAt: null, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'a5', Id: 'a5', Title: 'Science Discovery', Content: minContent + ' Science.', Category: 'Science', Status: 'Draft', AuthorId: AUTHOR_IDS[0], CreatedAt: baseDate, DeletedAt: null, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'a6', Id: 'a6', Title: 'Entertainment News', Content: minContent + ' Entertainment.', Category: 'Entertainment', Status: 'Published', AuthorId: AUTHOR_IDS[4], CreatedAt: baseDate, DeletedAt: null, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'a7', Id: 'a7', Title: 'Other Topics', Content: minContent + ' Other.', Category: 'Other', Status: 'Published', AuthorId: AUTHOR_IDS[1], CreatedAt: baseDate, DeletedAt: null, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'a8', Id: 'a8', Title: 'Another Tech Article', Content: minContent + ' Tech again.', Category: 'Tech', Status: 'Published', AuthorId: AUTHOR_IDS[2], CreatedAt: baseDate, DeletedAt: null, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'a9', Id: 'a9', Title: 'Draft Article One', Content: minContent + ' Draft.', Category: 'Politics', Status: 'Draft', AuthorId: AUTHOR_IDS[3], CreatedAt: baseDate, DeletedAt: null, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'a10', Id: 'a10', Title: 'Published Health Guide', Content: minContent + ' Health.', Category: 'Health', Status: 'Published', AuthorId: AUTHOR_IDS[4], CreatedAt: baseDate, DeletedAt: null, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'a11', Id: 'a11', Title: 'Sports Championship', Content: minContent + ' Championship.', Category: 'Sports', Status: 'Published', AuthorId: AUTHOR_IDS[0], CreatedAt: baseDate, DeletedAt: null, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'a12', Id: 'a12', Title: 'Science Breakthrough', Content: minContent + ' Breakthrough.', Category: 'Science', Status: 'Published', AuthorId: AUTHOR_IDS[1], CreatedAt: baseDate, DeletedAt: null, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'a13', Id: 'a13', Title: 'Entertainment Review', Content: minContent + ' Review.', Category: 'Entertainment', Status: 'Draft', AuthorId: AUTHOR_IDS[2], CreatedAt: baseDate, DeletedAt: null, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'a14', Id: 'a14', Title: 'Tech Startup News', Content: minContent + ' Startup.', Category: 'Tech', Status: 'Published', AuthorId: AUTHOR_IDS[3], CreatedAt: baseDate, DeletedAt: null, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'a15', Id: 'a15', Title: 'Political Analysis', Content: minContent + ' Analysis.', Category: 'Politics', Status: 'Published', AuthorId: AUTHOR_IDS[4], CreatedAt: baseDate, DeletedAt: null, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'a16', Id: 'a16', Title: 'Health Tips Daily', Content: minContent + ' Tips.', Category: 'Health', Status: 'Published', AuthorId: AUTHOR_IDS[0], CreatedAt: baseDate, DeletedAt: null, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'a17', Id: 'a17', Title: 'Sports Training', Content: minContent + ' Training.', Category: 'Sports', Status: 'Published', AuthorId: AUTHOR_IDS[1], CreatedAt: baseDate, DeletedAt: null, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'a18', Id: 'a18', Title: 'Science Research', Content: minContent + ' Research.', Category: 'Science', Status: 'Published', AuthorId: AUTHOR_IDS[2], CreatedAt: baseDate, DeletedAt: null, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'a19', Id: 'a19', Title: 'Entertainment Buzz', Content: minContent + ' Buzz.', Category: 'Entertainment', Status: 'Published', AuthorId: AUTHOR_IDS[3], CreatedAt: baseDate, DeletedAt: null, createdAt: baseDate, updatedAt: baseDate },
  { _id: 'a20', Id: 'a20', Title: 'Other Category Post', Content: minContent + ' Other.', Category: 'Other', Status: 'Published', AuthorId: AUTHOR_IDS[4], CreatedAt: baseDate, DeletedAt: null, createdAt: baseDate, updatedAt: baseDate },
];

export const ARTICLE_IDS = ARTICLES_FIXTURE.map((a) => a.Id);
export const PUBLISHED_ARTICLES = ARTICLES_FIXTURE.filter((a) => a.Status === 'Published');

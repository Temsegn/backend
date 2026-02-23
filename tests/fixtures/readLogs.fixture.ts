import { IReadLog } from '../../src/entities/ReadLog';
import { ARTICLE_IDS } from './articles.fixture';
import { READER_IDS } from './users.fixture';

const baseDate = new Date('2024-02-01T10:00:00.000Z');

export const READ_LOGS_FIXTURE: IReadLog[] = [
  { _id: 'r1', Id: 'r1', ArticleId: ARTICLE_IDS[0], ReaderId: READER_IDS[0], ReadAt: new Date(baseDate.getTime() + 0), createdAt: baseDate, updatedAt: baseDate },
  { _id: 'r2', Id: 'r2', ArticleId: ARTICLE_IDS[0], ReaderId: null, ReadAt: new Date(baseDate.getTime() + 1000), createdAt: baseDate, updatedAt: baseDate },
  { _id: 'r3', Id: 'r3', ArticleId: ARTICLE_IDS[1], ReaderId: READER_IDS[1], ReadAt: new Date(baseDate.getTime() + 2000), createdAt: baseDate, updatedAt: baseDate },
  { _id: 'r4', Id: 'r4', ArticleId: ARTICLE_IDS[2], ReaderId: READER_IDS[2], ReadAt: new Date(baseDate.getTime() + 3000), createdAt: baseDate, updatedAt: baseDate },
  { _id: 'r5', Id: 'r5', ArticleId: ARTICLE_IDS[3], ReaderId: null, ReadAt: new Date(baseDate.getTime() + 4000), createdAt: baseDate, updatedAt: baseDate },
  { _id: 'r6', Id: 'r6', ArticleId: ARTICLE_IDS[4], ReaderId: READER_IDS[3], ReadAt: new Date(baseDate.getTime() + 5000), createdAt: baseDate, updatedAt: baseDate },
  { _id: 'r7', Id: 'r7', ArticleId: ARTICLE_IDS[5], ReaderId: READER_IDS[4], ReadAt: new Date(baseDate.getTime() + 6000), createdAt: baseDate, updatedAt: baseDate },
  { _id: 'r8', Id: 'r8', ArticleId: ARTICLE_IDS[6], ReaderId: null, ReadAt: new Date(baseDate.getTime() + 7000), createdAt: baseDate, updatedAt: baseDate },
  { _id: 'r9', Id: 'r9', ArticleId: ARTICLE_IDS[7], ReaderId: READER_IDS[5], ReadAt: new Date(baseDate.getTime() + 8000), createdAt: baseDate, updatedAt: baseDate },
  { _id: 'r10', Id: 'r10', ArticleId: ARTICLE_IDS[8], ReaderId: READER_IDS[6], ReadAt: new Date(baseDate.getTime() + 9000), createdAt: baseDate, updatedAt: baseDate },
  { _id: 'r11', Id: 'r11', ArticleId: ARTICLE_IDS[9], ReaderId: null, ReadAt: new Date(baseDate.getTime() + 10000), createdAt: baseDate, updatedAt: baseDate },
  { _id: 'r12', Id: 'r12', ArticleId: ARTICLE_IDS[10], ReaderId: READER_IDS[7], ReadAt: new Date(baseDate.getTime() + 11000), createdAt: baseDate, updatedAt: baseDate },
  { _id: 'r13', Id: 'r13', ArticleId: ARTICLE_IDS[11], ReaderId: READER_IDS[8], ReadAt: new Date(baseDate.getTime() + 12000), createdAt: baseDate, updatedAt: baseDate },
  { _id: 'r14', Id: 'r14', ArticleId: ARTICLE_IDS[12], ReaderId: null, ReadAt: new Date(baseDate.getTime() + 13000), createdAt: baseDate, updatedAt: baseDate },
  { _id: 'r15', Id: 'r15', ArticleId: ARTICLE_IDS[13], ReaderId: READER_IDS[9], ReadAt: new Date(baseDate.getTime() + 14000), createdAt: baseDate, updatedAt: baseDate },
  { _id: 'r16', Id: 'r16', ArticleId: ARTICLE_IDS[14], ReaderId: null, ReadAt: new Date(baseDate.getTime() + 15000), createdAt: baseDate, updatedAt: baseDate },
  { _id: 'r17', Id: 'r17', ArticleId: ARTICLE_IDS[15], ReaderId: READER_IDS[0], ReadAt: new Date(baseDate.getTime() + 16000), createdAt: baseDate, updatedAt: baseDate },
  { _id: 'r18', Id: 'r18', ArticleId: ARTICLE_IDS[16], ReaderId: READER_IDS[1], ReadAt: new Date(baseDate.getTime() + 17000), createdAt: baseDate, updatedAt: baseDate },
  { _id: 'r19', Id: 'r19', ArticleId: ARTICLE_IDS[17], ReaderId: null, ReadAt: new Date(baseDate.getTime() + 18000), createdAt: baseDate, updatedAt: baseDate },
  { _id: 'r20', Id: 'r20', ArticleId: ARTICLE_IDS[18], ReaderId: READER_IDS[2], ReadAt: new Date(baseDate.getTime() + 19000), createdAt: baseDate, updatedAt: baseDate },
];

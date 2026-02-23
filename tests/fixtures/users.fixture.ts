import { IUser } from '../../src/entities/User';

const baseDate = new Date('2024-01-01T00:00:00.000Z');

export const USERS_FIXTURE: (Omit<IUser, 'Password'> & { Password?: string })[] = [
  { _id: 'u1', Id: 'u1', Name: 'Alice Author', Email: 'alice@test.com', Password: 'hashed', Role: 'author', createdAt: baseDate, updatedAt: baseDate },
  { _id: 'u2', Id: 'u2', Name: 'Bob Writer', Email: 'bob@test.com', Password: 'hashed', Role: 'author', createdAt: baseDate, updatedAt: baseDate },
  { _id: 'u3', Id: 'u3', Name: 'Carol News', Email: 'carol@test.com', Password: 'hashed', Role: 'author', createdAt: baseDate, updatedAt: baseDate },
  { _id: 'u4', Id: 'u4', Name: 'David Post', Email: 'david@test.com', Password: 'hashed', Role: 'author', createdAt: baseDate, updatedAt: baseDate },
  { _id: 'u5', Id: 'u5', Name: 'Eve Editor', Email: 'eve@test.com', Password: 'hashed', Role: 'author', createdAt: baseDate, updatedAt: baseDate },
  { _id: 'u6', Id: 'u6', Name: 'Frank Reader', Email: 'frank@test.com', Password: 'hashed', Role: 'reader', createdAt: baseDate, updatedAt: baseDate },
  { _id: 'u7', Id: 'u7', Name: 'Grace User', Email: 'grace@test.com', Password: 'hashed', Role: 'reader', createdAt: baseDate, updatedAt: baseDate },
  { _id: 'u8', Id: 'u8', Name: 'Henry View', Email: 'henry@test.com', Password: 'hashed', Role: 'reader', createdAt: baseDate, updatedAt: baseDate },
  { _id: 'u9', Id: 'u9', Name: 'Ivy Subscriber', Email: 'ivy@test.com', Password: 'hashed', Role: 'reader', createdAt: baseDate, updatedAt: baseDate },
  { _id: 'u10', Id: 'u10', Name: 'Jack Consumer', Email: 'jack@test.com', Password: 'hashed', Role: 'reader', createdAt: baseDate, updatedAt: baseDate },
  { _id: 'u11', Id: 'u11', Name: 'Kate Reporter', Email: 'kate@test.com', Password: 'hashed', Role: 'author', createdAt: baseDate, updatedAt: baseDate },
  { _id: 'u12', Id: 'u12', Name: 'Leo Journalist', Email: 'leo@test.com', Password: 'hashed', Role: 'author', createdAt: baseDate, updatedAt: baseDate },
  { _id: 'u13', Id: 'u13', Name: 'Mia Blogger', Email: 'mia@test.com', Password: 'hashed', Role: 'author', createdAt: baseDate, updatedAt: baseDate },
  { _id: 'u14', Id: 'u14', Name: 'Noah Reader', Email: 'noah@test.com', Password: 'hashed', Role: 'reader', createdAt: baseDate, updatedAt: baseDate },
  { _id: 'u15', Id: 'u15', Name: 'Olivia Fan', Email: 'olivia@test.com', Password: 'hashed', Role: 'reader', createdAt: baseDate, updatedAt: baseDate },
  { _id: 'u16', Id: 'u16', Name: 'Paul Author', Email: 'paul@test.com', Password: 'hashed', Role: 'author', createdAt: baseDate, updatedAt: baseDate },
  { _id: 'u17', Id: 'u17', Name: 'Quinn Writer', Email: 'quinn@test.com', Password: 'hashed', Role: 'author', createdAt: baseDate, updatedAt: baseDate },
  { _id: 'u18', Id: 'u18', Name: 'Rachel Reader', Email: 'rachel@test.com', Password: 'hashed', Role: 'reader', createdAt: baseDate, updatedAt: baseDate },
  { _id: 'u19', Id: 'u19', Name: 'Sam Subscriber', Email: 'sam@test.com', Password: 'hashed', Role: 'reader', createdAt: baseDate, updatedAt: baseDate },
  { _id: 'u20', Id: 'u20', Name: 'Tina Viewer', Email: 'tina@test.com', Password: 'hashed', Role: 'reader', createdAt: baseDate, updatedAt: baseDate },
];

export const AUTHOR_IDS = ['u1', 'u2', 'u3', 'u4', 'u5', 'u11', 'u12', 'u13', 'u16', 'u17'];
export const READER_IDS = ['u6', 'u7', 'u8', 'u9', 'u10', 'u14', 'u15', 'u18', 'u19', 'u20'];

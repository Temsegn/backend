/**
 * Auth API tests using user fixture data (20 users).
 */
import request from 'supertest';
import { app } from '../../src/app';
import { USERS_FIXTURE, AUTHOR_IDS, READER_IDS } from '../fixtures';
import { assertBaseResponse, assertErrorResponse } from '../helpers/responseAssertions';

jest.mock('../../src/repositories/user.repository');
jest.mock('bcryptjs', () => ({ hash: jest.fn(() => Promise.resolve('hashed')), compare: jest.fn(() => Promise.resolve(true)) }));
jest.mock('jsonwebtoken', () => ({ sign: jest.fn(() => 'mock-jwt'), verify: jest.fn() }));

const userRepo = require('../../src/repositories/user.repository').userRepository;

describe('Auth API with fixture data', () => {
  beforeEach(() => jest.clearAllMocks());

  it('has 20 users in fixture', () => {
    expect(USERS_FIXTURE).toHaveLength(20);
  });

  it('signup returns 201 and base response for each role (author, reader)', async () => {
    const authorUser = USERS_FIXTURE.find((u) => u.Role === 'author')!;
    const readerUser = USERS_FIXTURE.find((u) => u.Role === 'reader')!;
    userRepo.existsByEmail.mockResolvedValue(false);
    userRepo.create.mockImplementation((data: any) => Promise.resolve({ ...data, _id: data.Id, createdAt: new Date(), updatedAt: new Date() }));

    const authorRes = await request(app)
      .post('/api/auth/signup')
      .send({ Name: authorUser.Name, Email: authorUser.Email, Password: 'Pass@1234', Role: 'author' });
    expect(authorRes.status).toBe(201);
    assertBaseResponse(authorRes.body);
    expect(authorRes.body.Success).toBe(true);
    expect(authorRes.body.Object).toMatchObject({ Role: 'author' });

    const readerRes = await request(app)
      .post('/api/auth/signup')
      .send({ Name: readerUser.Name, Email: readerUser.Email, Password: 'Pass@1234', Role: 'reader' });
    expect(readerRes.status).toBe(201);
    expect(readerRes.body.Object).toMatchObject({ Role: 'reader' });
  });

  it('login returns 200 with token for fixture user 1', async () => {
    const user = USERS_FIXTURE[0];
    userRepo.findByEmail.mockResolvedValue({ ...user, Password: 'hashed' });

    const res = await request(app).post('/api/auth/login').send({ Email: user.Email, Password: 'Pass@1234' });
    expect(res.status).toBe(200);
    assertBaseResponse(res.body);
    expect(res.body.Object).toHaveProperty('token');
    expect(res.body.Object.user).toMatchObject({ Email: user.Email });
  });

  it('login returns 401 for non-existent email', async () => {
    userRepo.findByEmail.mockResolvedValue(null);
    const res = await request(app).post('/api/auth/login').send({ Email: 'none@test.com', Password: 'Pass@1234' });
    expect(res.status).toBe(401);
    assertErrorResponse(res.body);
  });

  it('signup returns 409 when email already exists (duplicate)', async () => {
    userRepo.existsByEmail.mockResolvedValue(true);
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ Name: 'Alice', Email: USERS_FIXTURE[0].Email, Password: 'Pass@1234', Role: 'author' });
    expect(res.status).toBe(409);
    assertErrorResponse(res.body);
    expect(res.body.Errors).toBeDefined();
  });

  it('validation fails for invalid name, email, password, role', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ Name: 'Ab123', Email: 'bad', Password: 'short', Role: 'invalid' });
    expect(res.status).toBe(400);
    assertErrorResponse(res.body);
    expect(res.body.Errors).toBeDefined();
  });
});

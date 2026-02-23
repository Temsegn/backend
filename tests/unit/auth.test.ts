import request from 'supertest';
import { app } from '../../src/app';
import { userRepository } from '../../src/repositories/user.repository';

jest.mock('../../src/repositories/user.repository');
jest.mock('bcryptjs', () => ({ hash: jest.fn(() => Promise.resolve('hashed')), compare: jest.fn(() => Promise.resolve(true)) }));
jest.mock('jsonwebtoken', () => ({ sign: jest.fn(() => 'mock-jwt-token'), verify: jest.fn() }));

const mockUserRepo = userRepository as jest.Mocked<typeof userRepository>;

describe('Auth API', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('POST /api/auth/signup', () => {
    it('returns 201 and user when signup is valid', async () => {
      mockUserRepo.existsByEmail.mockResolvedValue(false);
      mockUserRepo.create.mockResolvedValue({
        Id: 'user-1',
        Name: 'John Doe',
        Email: 'john@example.com',
        Password: 'hashed',
        Role: 'author',
        _id: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const res = await request(app)
        .post('/api/auth/signup')
        .send({ Name: 'John Doe', Email: 'john@example.com', Password: 'Pass@1234', Role: 'author' });

      expect(res.status).toBe(201);
      expect(res.body.Success).toBe(true);
      expect(res.body.Object).toMatchObject({ Name: 'John Doe', Email: 'john@example.com', Role: 'author' });
      expect(res.body.Object.Password).toBeUndefined();
    });

    it('returns 409 when email already exists', async () => {
      mockUserRepo.existsByEmail.mockResolvedValue(true);

      const res = await request(app)
        .post('/api/auth/signup')
        .send({ Name: 'Jane', Email: 'jane@example.com', Password: 'Pass@1234', Role: 'reader' });

      expect(res.status).toBe(409);
      expect(res.body.Success).toBe(false);
      expect(res.body.Errors).toContainEqual(expect.stringContaining('registered'));
    });

    it('returns 400 when validation fails', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ Name: 'J', Email: 'invalid', Password: 'weak', Role: 'author' });

      expect(res.status).toBe(400);
      expect(res.body.Success).toBe(false);
      expect(res.body.Errors).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    it('returns 200 and token when credentials are valid', async () => {
      mockUserRepo.findByEmail.mockResolvedValue({
        Id: 'user-1',
        Name: 'John',
        Email: 'john@example.com',
        Password: 'hashed',
        Role: 'author',
        _id: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ Email: 'john@example.com', Password: 'Pass@1234' });

      expect(res.status).toBe(200);
      expect(res.body.Success).toBe(true);
      expect(res.body.Object.token).toBe('mock-jwt-token');
      expect(res.body.Object.user).toMatchObject({ Email: 'john@example.com', Role: 'author' });
    });

    it('returns 401 when user not found', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ Email: 'nobody@example.com', Password: 'Pass@1234' });

      expect(res.status).toBe(401);
      expect(res.body.Success).toBe(false);
    });
  });
});

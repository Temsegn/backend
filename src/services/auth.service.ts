import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository';
import { env } from '../config/environment';
import { IUser } from '../entities/User';
import { JwtPayload } from '../types';
import { Role } from '../utils/constants';
import { generateUUID } from '../utils/helpers';

const SALT_ROUNDS = 12;

export const authService = {
  async signup(data: { Name: string; Email: string; Password: string; Role: Role }): Promise<IUser> {
    const exists = await userRepository.existsByEmail(data.Email);
    if (exists) {
      const err = new Error('Conflict') as Error & { statusCode?: number; errors?: string[] };
      err.statusCode = 409;
      err.errors = ['Email already registered'];
      throw err;
    }
    const hashed = await bcrypt.hash(data.Password, SALT_ROUNDS);
    const user = await userRepository.create({
      Id: generateUUID(),
      Name: data.Name.trim(),
      Email: data.Email.toLowerCase().trim(),
      Password: hashed,
      Role: data.Role,
    });
    const { Password: _, ...safe } = user;
    return safe as IUser;
  },

  async login(email: string, password: string): Promise<{ token: string; user: IUser }> {
    const user = await userRepository.findByEmail(email, true);
    if (!user) {
      const err = new Error('Unauthorized') as Error & { statusCode?: number; errors?: string[] };
      err.statusCode = 401;
      err.errors = ['Invalid email or password'];
      throw err;
    }
    const match = await bcrypt.compare(password, user.Password);
    if (!match) {
      const err = new Error('Unauthorized') as Error & { statusCode?: number; errors?: string[] };
      err.statusCode = 401;
      err.errors = ['Invalid email or password'];
      throw err;
    }
    const payload: JwtPayload = { sub: user.Id, role: user.Role };
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
    const { Password: _, ...safe } = user;
    return { token, user: safe as IUser };
  },
};

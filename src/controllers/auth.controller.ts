import { Response } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../types';

export async function signup(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { Name, Email, Password, Role } = req.body;
    const user = await authService.signup({ Name, Email, Password, Role });
    sendSuccess(res, 'User registered successfully', user, 201);
  } catch (err: unknown) {
    const e = err as { statusCode?: number; errors?: string[]; message?: string };
    if (e.statusCode === 409) {
      sendError(res, 'Conflict', e.errors ?? ['Email already registered'], 409);
      return;
    }
    throw err;
  }
}

export async function login(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { Email, Password } = req.body;
    const { token, user } = await authService.login(Email, Password);
    sendSuccess(res, 'Login successful', { token, user });
  } catch (err: unknown) {
    const e = err as { statusCode?: number; errors?: string[] };
    if (e.statusCode === 401) {
      sendError(res, 'Unauthorized', e.errors ?? ['Invalid credentials'], 401);
      return;
    }
    throw err;
  }
}

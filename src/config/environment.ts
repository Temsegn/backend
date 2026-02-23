import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  DATABASE_URL: 'mongodb+srv://user:password@cluster.mongodb.net/a2sv?retryWrites=true&w=majority',
  JWT_SECRET: process.env.JWT_SECRET || 'change-me-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  READ_DEDUP_WINDOW_MINUTES: parseInt(process.env.READ_DEDUP_WINDOW_MINUTES || '15', 10),
} as const;

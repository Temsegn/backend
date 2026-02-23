import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import { security } from './middleware/security';
import { generalLimiter, authLimiter } from './middleware/rateLimiter';
import routes from './routes';

const app = express();

app.use(security);
app.use(cors());
app.use(express.json());

app.use('/auth', authLimiter);
app.use(generalLimiter);

app.use('/api', routes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export { app };

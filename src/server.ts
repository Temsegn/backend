import { app } from './app';
import { connectDatabase } from './config/database';
import { env } from './config/environment';
import { startAnalyticsCron } from './jobs/analytics.processor';
import { logger } from './utils/logger';

async function start(): Promise<void> {
  try {
    await connectDatabase();
    startAnalyticsCron();
    app.listen(env.PORT, () => {
      logger.info(`Server listening on port ${env.PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

import { app } from './app';
import { config } from './config';
import { getDb } from './db';

// Fail fast if the database cannot be opened.
getDb();

const server = app.listen(config.port, () => {
  console.log(`[krishiflow] server listening on http://localhost:${config.port}`);
  console.log(`[krishiflow] health check: http://localhost:${config.port}/api/health`);
  console.log(`[krishiflow] database: ${config.databasePath}`);
});

function shutdown(signal: string): void {
  console.log(`[krishiflow] ${signal} received, shutting down.`);
  server.close(() => process.exit(0));
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import { ApiError, makeMeta } from './http';
import { farmRouter } from './modules/farm/routes';
import { demoRouter } from './modules/demo/routes';

export const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'krishiflow',
    time: new Date().toISOString(),
    meta: makeMeta(),
  });
});

app.use('/api/farm', farmRouter);

// Explicitly-labelled demo data for dashboard/weather/market pages
// until the real weather/calendar/market modules land.
app.use('/api/demo', demoRouter);

app.use((_req, res) => {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: 'Route not found.' },
    meta: makeMeta(),
  });
});

// Central error handler — always returns { error, meta }, never HTML.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    res.status(err.status).json({
      error: { code: err.code, message: err.message, details: err.details },
      meta: makeMeta(),
    });
    return;
  }
  const message = err instanceof Error ? err.message : 'Unexpected server error.';
  // eslint-disable-next-line no-console
  console.error('[krishiflow] unhandled error:', err);
  res.status(500).json({
    error: { code: 'INTERNAL', message },
    meta: makeMeta(),
  });
});

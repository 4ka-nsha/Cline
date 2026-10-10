import 'dotenv/config';
import path from 'node:path';
import fs from 'node:fs';

const ROOT = path.resolve(process.cwd());

function str(name: string, fallback: string): string {
  const v = process.env[name];
  return v === undefined || v === '' ? fallback : v;
}

const dbPathRaw = str('DATABASE_PATH', './data/krishiflow.db');

export const config = {
  port: Number(str('PORT', '4000')),
  nodeEnv: str('NODE_ENV', 'development'),
  databasePath: path.isAbsolute(dbPathRaw)
    ? dbPathRaw
    : path.resolve(ROOT, dbPathRaw),
  dataGovInApiKey: process.env.DATA_GOV_IN_API_KEY ?? '',
  allowDemoFallback: str('ALLOW_DEMO_DATA_FALLBACK', 'false') === 'true',
};

export function ensureDatabaseDir(): void {
  fs.mkdirSync(path.dirname(config.databasePath), { recursive: true });
}

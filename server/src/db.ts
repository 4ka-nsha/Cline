import { createRequire } from 'node:module';
import { config, ensureDatabaseDir } from './config';

/**
 * Uses Node's built-in `node:sqlite` (Node >= 22.5) so there is no native
 * compilation step (no node-gyp / Python / VS Build Tools required).
 *
 * Loaded via createRequire because `node:sqlite` only exists with the `node:`
 * prefix — bundlers that strip that prefix (Vite/Vitest) cannot resolve the
 * bare `sqlite` specifier. A static `import` would break the test runner.
 */
const require = createRequire(import.meta.url);

interface Statement {
  run(...params: unknown[]): unknown;
  get(...params: unknown[]): unknown;
}

interface DatabaseLike {
  exec(sql: string): void;
  prepare(sql: string): Statement;
  close(): void;
}

type DatabaseCtor = new (path: string) => DatabaseLike;

const { DatabaseSync } = require('node:sqlite') as { DatabaseSync: DatabaseCtor };

let db: DatabaseLike | null = null;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS farm (
  id                       INTEGER PRIMARY KEY CHECK (id = 1),
  farm_name                TEXT,
  state                    TEXT    NOT NULL,
  district                 TEXT    NOT NULL,
  soil_type                TEXT,
  land_size                REAL    NOT NULL,
  land_size_unit           TEXT    NOT NULL,
  sowing_date              TEXT    NOT NULL,
  crop_preference          TEXT,
  crop_type                TEXT    NOT NULL,
  crop_history             TEXT    NOT NULL DEFAULT '[]',
  current_income           REAL,
  current_income_currency  TEXT    NOT NULL DEFAULT 'INR',
  growth_stage             TEXT,
  latitude                 REAL,
  longitude                REAL,
  created_at               TEXT    NOT NULL,
  updated_at               TEXT    NOT NULL
);
`;

export function getDb(): DatabaseLike {
  if (db) return db;
  ensureDatabaseDir();
  db = new DatabaseSync(config.databasePath);
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec(SCHEMA);
  return db;
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}


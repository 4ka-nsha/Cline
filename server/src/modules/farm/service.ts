import type {
  FarmInput,
  FarmOptionsResponse,
  FarmPatch,
  FarmProfile,
} from '../../../../shared/contracts/farm';
import { LAND_SIZE_UNITS } from '../../../../shared/contracts/farm';
import { ApiError } from '../../http';
import { getDb } from '../../db';
import {
  CROP_PREFERENCES,
  CROP_TYPES,
  GROWTH_STAGES,
  SOIL_TYPES,
  STATES,
} from './options';

/**
 * Farm service — the single source of truth for farmer-input persistence.
 * REST routes (and later the MCP `get_farm_summary` tool) must call these
 * functions rather than touching SQLite directly.
 */

type Row = Record<string, unknown>;

function parseJsonArray(value: unknown): string[] {
  if (typeof value !== 'string' || value.trim() === '') return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function numOrNull(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function strOrNull(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v);
  return s === '' ? null : s;
}

export function rowToProfile(row: Row): FarmProfile {
  return {
    id: Number(row.id),
    farmName: strOrNull(row.farm_name),
    state: String(row.state),
    district: String(row.district),
    soilType: strOrNull(row.soil_type),
    landSize: Number(row.land_size),
    landSizeUnit: String(row.land_size_unit) as FarmProfile['landSizeUnit'],
    sowingDate: String(row.sowing_date),
    cropPreference: strOrNull(row.crop_preference),
    cropType: String(row.crop_type),
    cropHistory: parseJsonArray(row.crop_history),
    currentIncome: numOrNull(row.current_income),
    currentIncomeCurrency: (strOrNull(row.current_income_currency) ?? 'INR') as FarmProfile['currentIncomeCurrency'],
    growthStage: strOrNull(row.growth_stage),
    latitude: numOrNull(row.latitude),
    longitude: numOrNull(row.longitude),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export function getFarm(): FarmProfile | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM farm WHERE id = 1').get() as Row | undefined;
  return row ? rowToProfile(row) : null;
}

export function getFarmOrThrow(): FarmProfile {
  const farm = getFarm();
  if (!farm) {
    throw new ApiError(404, 'FARM_NOT_FOUND', 'No farm has been set up yet.');
  }
  return farm;
}

/** POST — creates the single-user farm profile. */
export function createFarm(input: FarmInput): FarmProfile {
  const db = getDb();
  if (getFarm()) {
    throw new ApiError(409, 'FARM_EXISTS', 'Farm already exists. Use PATCH to update it.');
  }
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO farm (
      id, farm_name, state, district, soil_type, land_size, land_size_unit,
      sowing_date, crop_preference, crop_type, crop_history, current_income,
      current_income_currency, growth_stage, latitude, longitude,
      created_at, updated_at
    ) VALUES (
      1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )`,
  ).run(
    input.farmName ?? null,
    input.state,
    input.district,
    input.soilType ?? null,
    input.landSize,
    input.landSizeUnit,
    input.sowingDate,
    input.cropPreference ?? null,
    input.cropType,
    JSON.stringify(input.cropHistory ?? []),
    input.currentIncome ?? null,
    input.currentIncomeCurrency ?? 'INR',
    input.growthStage ?? null,
    input.latitude ?? null,
    input.longitude ?? null,
    now,
    now,
  );
  return getFarmOrThrow();
}

const COLUMN_BY_FIELD: Record<string, string> = {
  farmName: 'farm_name',
  state: 'state',
  district: 'district',
  soilType: 'soil_type',
  landSize: 'land_size',
  landSizeUnit: 'land_size_unit',
  sowingDate: 'sowing_date',
  cropPreference: 'crop_preference',
  cropType: 'crop_type',
  cropHistory: 'crop_history',
  currentIncome: 'current_income',
  currentIncomeCurrency: 'current_income_currency',
  growthStage: 'growth_stage',
  latitude: 'latitude',
  longitude: 'longitude',
};

/** PATCH — partial update of the single-user farm profile. */
export function updateFarm(patch: FarmPatch): FarmProfile {
  const db = getDb();
  if (!getFarm()) {
    throw new ApiError(404, 'FARM_NOT_FOUND', 'No farm has been set up yet. Use POST first.');
  }

  const sets: string[] = [];
  const values: unknown[] = [];
  for (const [field, column] of Object.entries(COLUMN_BY_FIELD)) {
    if (!Object.prototype.hasOwnProperty.call(patch, field)) continue;
    const value = (patch as Record<string, unknown>)[field];
    sets.push(`${column} = ?`);
    if (field === 'cropHistory') values.push(JSON.stringify(value ?? []));
    else values.push(value ?? null);
  }
  if (sets.length === 0) {
    throw new ApiError(400, 'EMPTY_PATCH', 'No updatable fields supplied.');
  }

  sets.push('updated_at = ?');
  values.push(new Date().toISOString());

  db.prepare(`UPDATE farm SET ${sets.join(', ')} WHERE id = 1`).run(
    ...(values as never[]),
  );
  return getFarmOrThrow();
}

export function getFarmOptions(): FarmOptionsResponse {
  const states = Object.keys(STATES);
  return {
    states,
    districtsByState: STATES,
    soilTypes: SOIL_TYPES,
    cropPreferences: CROP_PREFERENCES,
    cropTypes: CROP_TYPES,
    growthStages: GROWTH_STAGES,
    landSizeUnits: LAND_SIZE_UNITS.map((value) => ({
      value,
      label: value === 'acre' ? 'Acres' : value === 'hectare' ? 'Hectares' : 'Bigha',
    })),
    meta: { requestId: '', servedAt: new Date().toISOString(), source: 'user-input' },
  };
}


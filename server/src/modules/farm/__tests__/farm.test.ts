import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ApiError } from '../../../http';
import { closeDb } from '../../../db';
import { config } from '../../../config';
import { validateFarm, validatePatch } from '../validate';
import { createFarm, getFarm, updateFarm } from '../service';

const VALID = {
  farmName: 'Deshmukh Farm',
  state: 'Maharashtra',
  district: 'Nashik',
  soilType: 'Black (Regur)',
  landSize: 4.5,
  landSizeUnit: 'acre',
  sowingDate: '2026-06-15',
  cropPreference: 'Kharif (kharif season)',
  cropType: 'Soybean',
  cropHistory: ['Wheat', 'Gram'],
  currentIncome: 240000,
  growthStage: 'Flowering',
  latitude: 19.9975,
  longitude: 73.7898,
};

function expectFieldError(fn: () => unknown, field: string): void {
  let thrown: unknown;
  let didThrow = false;
  try {
    fn();
  } catch (err) {
    didThrow = true;
    thrown = err;
  }
  if (!didThrow) {
    throw new Error(`expected a validation error for field "${field}", but nothing was thrown`);
  }
  expect(thrown).toBeInstanceOf(ApiError);
  const api = thrown as ApiError;
  expect(api.status).toBe(422);
  expect(api.details?.some((d) => d.field === field)).toBe(true);
}

describe('validateFarm', () => {
  it('accepts a complete valid payload', () => {
    const out = validateFarm(VALID, { partial: false });
    expect(out.state).toBe('Maharashtra');
    expect(out.landSize).toBe(4.5);
    expect(out.cropHistory).toEqual(['Wheat', 'Gram']);
  });

  it('rejects a district that does not belong to the state', () => {
    expectFieldError(() => validateFarm({ ...VALID, district: 'Lucknow' }, { partial: false }), 'district');
  });

  it('rejects non-positive land size', () => {
    expectFieldError(() => validateFarm({ ...VALID, landSize: 0 }, { partial: false }), 'landSize');
  });

  it('rejects a malformed sowing date', () => {
    expectFieldError(() => validateFarm({ ...VALID, sowingDate: '15/06/2026' }, { partial: false }), 'sowingDate');
  });

  it('rejects a crop not in the curated list', () => {
    expectFieldError(() => validateFarm({ ...VALID, cropType: 'Unicorn' }, { partial: false }), 'cropType');
  });

  it('rejects a latitude without a longitude', () => {
    const { longitude: _drop, ...rest } = VALID;
    expectFieldError(() => validateFarm(rest, { partial: false }), 'longitude');
  });

  it('rejects out-of-range coordinates', () => {
    expectFieldError(() => validateFarm({ ...VALID, latitude: 999 }, { partial: false }), 'latitude');
  });

  it('allows all optional fields to be omitted', () => {
    const { farmName: _a, soilType: _b, cropPreference: _c, cropHistory: _d,
      currentIncome: _e, growthStage: _f, latitude: _g, longitude: _h, ...required } = VALID;
    const out = validateFarm(required, { partial: false });
    expect(out.state).toBe('Maharashtra');
    expect(out.cropType).toBe('Soybean');
  });

  it('rejects a non-object body', () => {
    expect(() => validateFarm('nope', { partial: false })).toThrow(ApiError);
  });
});

describe('validatePatch', () => {
  it('accepts a single-field patch', () => {
    expect(validatePatch({ growthStage: 'Maturity' })).toEqual({ growthStage: 'Maturity' });
  });

  it('validates only supplied fields', () => {
    expect(validatePatch({ farmName: 'Renamed farm' })).toEqual({ farmName: 'Renamed farm' });
  });

  it('rejects an empty patch', () => {
    expect(() => validatePatch({})).toThrow(ApiError);
  });

  it('still rejects invalid values in a patch', () => {
    expectFieldError(() => validatePatch({ landSize: -5 }), 'landSize');
  });
});

describe('persistence', () => {
  let dir: string;
  let originalDbPath: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'kf-test-'));
    originalDbPath = config.databasePath;
    config.databasePath = path.join(dir, 'test.db');
    closeDb();
  });

  afterEach(() => {
    closeDb();
    config.databasePath = originalDbPath;
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('creates, reads back, and patches the farm', () => {
    const created = createFarm(validateFarm(VALID, { partial: false }));
    expect(created.id).toBe(1);
    expect(getFarm()?.cropType).toBe('Soybean');

    const updated = updateFarm({ growthStage: 'Maturity' });
    expect(updated.growthStage).toBe('Maturity');
    expect(updated.cropType).toBe('Soybean');
    expect(updated.cropHistory).toEqual(['Wheat', 'Gram']);
  });

  it('refuses to create a second farm', () => {
    createFarm(validateFarm(VALID, { partial: false }));
    expect(() => createFarm(validateFarm(VALID, { partial: false }))).toThrow(ApiError);
  });
});

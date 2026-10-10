import type { FarmInput, FarmPatch, FieldError, LandSizeUnit } from '../../../../shared/contracts/farm';
import { LAND_SIZE_UNITS } from '../../../../shared/contracts/farm';
import { ApiError } from '../../http';
import { CROP_PREFERENCES, CROP_TYPES, GROWTH_STAGES, SOIL_TYPES, STATES } from './options';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isBlank(v: unknown): boolean {
  return v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
}

function optString(value: unknown): string | null {
  if (isBlank(value)) return null;
  return String(value).trim();
}

function cleanList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of value) {
    if (typeof raw !== 'string') continue;
    const v = raw.trim();
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

function parseCoordinate(
  field: string,
  value: unknown,
  errors: FieldError[],
  kind: 'lat' | 'lng',
): number | null {
  if (isBlank(value)) return null;
  const n = Number(value);
  const lo = kind === 'lat' ? -90 : -180;
  const hi = kind === 'lat' ? 90 : 180;
  if (!Number.isFinite(n)) {
    errors.push({ field, message: 'Must be a number.' });
    return null;
  }
  if (n < lo || n > hi) {
    errors.push({ field, message: `Must be between ${lo} and ${hi}.` });
    return null;
  }
  return n;
}

/**
 * Validates and normalises a farm payload.
 * `partial` is true for PATCH so only supplied fields are checked.
 * Throws ApiError(422) with per-field details on failure.
 */
export function validateFarm(body: unknown, opts: { partial: boolean }): FarmInput {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw new ApiError(400, 'INVALID_BODY', 'Request body must be a JSON object.');
  }
  const raw = body as Record<string, unknown>;
  const errors: FieldError[] = [];
  const out = {} as FarmInput;
  const supplied = (k: string) => Object.prototype.hasOwnProperty.call(raw, k);
  const need = (k: string) => !opts.partial || supplied(k);

  // state
  if (need('state')) {
    if (isBlank(raw.state)) {
      errors.push({ field: 'state', message: 'State is required.' });
    } else {
      const state = String(raw.state).trim();
      if (!STATES[state]) errors.push({ field: 'state', message: 'Choose a state from the list.' });
      else out.state = state;
    }
  }

  // district (must belong to the chosen state)
  if (need('district')) {
    if (isBlank(raw.district)) {
      errors.push({ field: 'district', message: 'District is required.' });
    } else {
      const district = String(raw.district).trim();
      const state = out.state ?? (typeof raw.state === 'string' ? raw.state.trim() : '');
      const districts = STATES[state] ?? [];
      if (state && !districts.includes(district)) {
        errors.push({ field: 'district', message: `District is not in ${state}.` });
      } else {
        out.district = district;
      }
    }
  }

  // land size
  if (need('landSize')) {
    if (isBlank(raw.landSize)) {
      errors.push({ field: 'landSize', message: 'Land size is required.' });
    } else {
      const n = Number(raw.landSize);
      if (!Number.isFinite(n)) errors.push({ field: 'landSize', message: 'Land size must be a number.' });
      else if (n <= 0) errors.push({ field: 'landSize', message: 'Land size must be greater than 0.' });
      else if (n > 1_000_000) errors.push({ field: 'landSize', message: 'Land size looks too large.' });
      else out.landSize = n;
    }
  }

  // land size unit
  if (need('landSizeUnit')) {
    if (isBlank(raw.landSizeUnit)) {
      errors.push({ field: 'landSizeUnit', message: 'Unit is required.' });
    } else {
      const unit = String(raw.landSizeUnit).trim() as LandSizeUnit;
      if (!LAND_SIZE_UNITS.includes(unit)) {
        errors.push({ field: 'landSizeUnit', message: 'Choose acre, hectare or bigha.' });
      } else out.landSizeUnit = unit;
    }
  }

  // sowing date
  if (need('sowingDate')) {
    if (isBlank(raw.sowingDate)) {
      errors.push({ field: 'sowingDate', message: 'Sowing date is required.' });
    } else {
      const d = String(raw.sowingDate).trim();
      if (!DATE_RE.test(d) || Number.isNaN(Date.parse(d))) {
        errors.push({ field: 'sowingDate', message: 'Use YYYY-MM-DD.' });
      } else out.sowingDate = d;
    }
  }

  // crop type (required)
  if (need('cropType')) {
    if (isBlank(raw.cropType)) {
      errors.push({ field: 'cropType', message: 'Crop type is required.' });
    } else {
      const crop = String(raw.cropType).trim();
      if (!CROP_TYPES.includes(crop)) errors.push({ field: 'cropType', message: 'Choose a crop from the list.' });
      else out.cropType = crop;
    }
  }

  // ---- optional fields ----

  if (supplied('farmName')) {
    const v = optString(raw.farmName);
    if (v && v.length > 80) errors.push({ field: 'farmName', message: 'Max 80 characters.' });
    else out.farmName = v;
  }

  if (supplied('soilType')) {
    const v = optString(raw.soilType);
    if (v && !SOIL_TYPES.includes(v)) errors.push({ field: 'soilType', message: 'Choose a soil type from the list.' });
    else out.soilType = v;
  }

  if (supplied('cropPreference')) {
    const v = optString(raw.cropPreference);
    if (v && !CROP_PREFERENCES.includes(v)) errors.push({ field: 'cropPreference', message: 'Choose from the list.' });
    else out.cropPreference = v;
  }

  if (supplied('growthStage')) {
    const v = optString(raw.growthStage);
    if (v && !GROWTH_STAGES.includes(v)) errors.push({ field: 'growthStage', message: 'Choose from the list.' });
    else out.growthStage = v;
  }

  if (supplied('cropHistory')) {
    const list = cleanList(raw.cropHistory);
    if (list.length > 20) errors.push({ field: 'cropHistory', message: 'Max 20 entries.' });
    else if (list.some((x) => x.length > 60)) errors.push({ field: 'cropHistory', message: 'Each entry max 60 characters.' });
    else out.cropHistory = list;
  }

  // current income: stored as reference data only (no optimizer, no advice)
  if (supplied('currentIncome')) {
    if (isBlank(raw.currentIncome)) out.currentIncome = null;
    else {
      const n = Number(raw.currentIncome);
      if (!Number.isFinite(n)) errors.push({ field: 'currentIncome', message: 'Income must be a number.' });
      else if (n < 0) errors.push({ field: 'currentIncome', message: 'Income cannot be negative.' });
      else out.currentIncome = n;
    }
  }
  if (supplied('currentIncomeCurrency')) {
    out.currentIncomeCurrency = 'INR';
  }

  // coordinates (optional now; the weather module needs them later)
  if (supplied('latitude')) out.latitude = parseCoordinate('latitude', raw.latitude, errors, 'lat');
  if (supplied('longitude')) out.longitude = parseCoordinate('longitude', raw.longitude, errors, 'lng');
  if (supplied('latitude') || supplied('longitude')) {
    const hasLat = out.latitude !== undefined && out.latitude !== null;
    const hasLng = out.longitude !== undefined && out.longitude !== null;
    if (hasLat !== hasLng) {
      errors.push({
        field: hasLat ? 'longitude' : 'latitude',
        message: 'Enter both latitude and longitude, or leave both blank.',
      });
    }
  }

  if (errors.length > 0) {
    throw new ApiError(422, 'VALIDATION_FAILED', 'Please correct the highlighted fields.', errors);
  }
  return out;
}

/** PATCH: only supplied fields are validated. At least one must be present. */
export function validatePatch(body: unknown): FarmPatch {
  const patch = validateFarm(body, { partial: true });
  if (Object.keys(patch).length === 0) {
    throw new ApiError(400, 'EMPTY_PATCH', 'No valid fields supplied.');
  }
  return patch;
}

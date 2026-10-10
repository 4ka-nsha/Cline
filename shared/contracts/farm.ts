/**
 * Shared type contracts for the farm-setup module.
 * Imported by the Express server, the React app, and (later) the MCP server.
 * Keep these in sync with `server/src/modules/farm/schema.ts` validation.
 */

export const LAND_SIZE_UNITS = ['acre', 'hectare', 'bigha'] as const;
export type LandSizeUnit = (typeof LAND_SIZE_UNITS)[number];

export const CURRENCY_CODES = ['INR'] as const;
export type CurrencyCode = (typeof CURRENCY_CODES)[number];

/** Farmer profile. All timestamps are ISO-8601 UTC strings. */
export interface FarmProfile {
  id: number;
  farmName: string | null;
  state: string;
  district: string;
  soilType: string | null;
  landSize: number;
  landSizeUnit: LandSizeUnit;
  sowingDate: string; // YYYY-MM-DD
  cropPreference: string | null;
  cropType: string;
  cropHistory: string[]; // past crops, for future reference
  currentIncome: number | null;
  currentIncomeCurrency: CurrencyCode;
  growthStage: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

/** What the form submits. Coordinates and growth stage are optional. */
export interface FarmInput {
  farmName?: string | null;
  state: string;
  district: string;
  soilType?: string | null;
  landSize: number;
  landSizeUnit: LandSizeUnit;
  sowingDate: string;
  cropPreference?: string | null;
  cropType: string;
  cropHistory?: string[];
  currentIncome?: number | null;
  currentIncomeCurrency?: CurrencyCode;
  growthStage?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

/** Partial update (PATCH). Every field optional. */
export type FarmPatch = Partial<FarmInput>;

/** Structured per-field validation error, rendered next to the input. */
export interface FieldError {
  field: string;
  message: string;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: FieldError[];
  };
  meta: ResponseMeta;
}

/** Present on every response so provenance is never lost. */
export interface ResponseMeta {
  requestId: string;
  servedAt: string;
  source: 'user-input';
}

export interface FarmResponse {
  farm: FarmProfile | null;
  meta: ResponseMeta;
}

export interface FarmOptionsResponse {
  states: string[];
  districtsByState: Record<string, string[]>;
  soilTypes: string[];
  cropPreferences: string[];
  cropTypes: string[];
  growthStages: string[];
  landSizeUnits: { value: LandSizeUnit; label: string }[];
  meta: ResponseMeta;
}

// Shared TypeScript interfaces for the Farm Assistant app.
// Components never define their own data shapes; they consume these types
// through the service layer.

/* ----------------------------- Farm profile ----------------------------- */

export type SoilType =
  | 'loamy'
  | 'clay'
  | 'sandy'
  | 'silt'
  | 'black'
  | 'red'
  | 'laterite'

export type IrrigationType = 'rainfed' | 'canal' | 'drip' | 'sprinkler' | 'borewell'

export interface FarmProfile {
  farmerName: string
  location: string
  /** Land area in acres. */
  farmSizeAcres: number
  soilType: SoilType
  irrigation: IrrigationType
  /** Season, e.g. "Kharif", "Rabi". */
  season: string
  /** Ids or names of crops the farmer is interested in / currently growing. */
  preferredCrops: string[]
  /** True once onboarding has been completed. */
  onboarded: boolean
}

/* ------------------------------- Advisory ------------------------------- */

export type AdvisoryLevel = 'info' | 'success' | 'warning' | 'danger'

export interface Advisory {
  id: string
  title: string
  message: string
  level: AdvisoryLevel
  /** Short label for the action, e.g. "Irrigate today". */
  action?: string
  icon?: string
}

/* -------------------------------- Crops --------------------------------- */

export interface CropRecommendation {
  id: string
  name: string
  /** Expected yield per acre, e.g. "18-22 quintals". */
  expectedYield: string
  /** Suitability score from 0-100. */
  suitability: number
  /** Short reason why this crop fits the profile. */
  reason: string
  /** Suggested seed variety. */
  seedVariety: string
  /** Seed rate per acre, e.g. "40 kg". */
  seedRate: string
  durationDays: number
}

/* ------------------------------- Weather -------------------------------- */

export interface WeatherDay {
  date: string
  tempMin: number
  tempMax: number
  condition: string
  rainfallMm: number
  humidity: number
}

export interface WeatherForecast {
  location: string
  current: {
    tempC: number
    condition: string
    humidity: number
    windKph: number
  }
  daily: WeatherDay[]
  /** Simple advisory derived from the forecast, e.g. rain alerts. */
  alerts: string[]
}

/* -------------------------------- Market -------------------------------- */

export interface MarketPrice {
  id: string
  commodity: string
  market: string
  /** Current market price per quintal (INR). */
  pricePerQuintal: number
  /** Minimum Support Price per quintal (INR), if applicable. */
  mspPerQuintal: number | null
  unit: string
  date: string
  trend: 'up' | 'down' | 'stable'
}

/* -------------------------------- Inputs -------------------------------- */

export type InputCategory = 'pesticide' | 'fertilizer' | 'fungicide' | 'herbicide'

export interface InputProduct {
  id: string
  name: string
  category: InputCategory
  /** Crops this input is used on. */
  targetCrops: string[]
  /** Pest or purpose it addresses. */
  targetPest: string
  dosage: string
  /** Pre-harvest interval in days. */
  phiDays: number
  safetyNotes: string[]
  pricePerUnit: number
  unit: string
}

/* ------------------------------- Expenses ------------------------------- */

export type ExpenseCategory =
  | 'seeds'
  | 'fertilizer'
  | 'pesticide'
  | 'labour'
  | 'irrigation'
  | 'equipment'
  | 'other'

export interface Expense {
  id: string
  category: ExpenseCategory
  description: string
  amount: number
  date: string
}

export interface ExpenseSummary {
  total: number
  byCategory: { category: ExpenseCategory; amount: number }[]
}

/* ---------------------------- Service results --------------------------- */

/** Standard envelope so live and mock modes return the same shape. */
export interface ServiceResult<T> {
  data: T
  source: 'mock' | 'live'
}

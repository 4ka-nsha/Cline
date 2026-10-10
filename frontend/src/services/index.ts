// Typed service layer. All data access in the app goes through these services,
// which respect the explicit mock/live mode set in config.ts.
export { DATA_MODE, API_BASE_URL, isLive } from './config'
export type { DataMode } from './config'

export { getAdvisories } from './advisoryService'
export { getCropRecommendations } from './cropService'
export { getWeather } from './weatherService'
export { getMarketPrices } from './marketService'
export { getInputs } from './inputService'
export { getExpenses } from './expenseService'

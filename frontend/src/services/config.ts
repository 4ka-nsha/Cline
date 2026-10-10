/** Explicit data-source mode for the service layer. */
export type DataMode = 'mock' | 'live'

/**
 * Central configuration for the service layer.
 *
 * Data mode is explicit and controlled via the VITE_DATA_MODE environment
 * variable:
 *   - "mock" (default): services read from src/mocks/
 *   - "live":          services call the real backend at VITE_API_BASE_URL
 *
 * NOTE: Only non-secret configuration may live in VITE_* variables. Vite
 * inlines these into the public client bundle, so API keys/secrets must NEVER
 * be placed here (see .clinerules/frontend.md).
 */

export const DATA_MODE: DataMode =
  (import.meta.env.VITE_DATA_MODE as DataMode | undefined) === 'live'
    ? 'live'
    : 'mock'

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export function isLive(): boolean {
  return DATA_MODE === 'live'
}

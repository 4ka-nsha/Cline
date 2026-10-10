/**
 * Climate trends service (new module).
 *
 * Live mode calls GET /api/climate?lat={lat}&lon={lon}&years={n}.
 * Returns the N most recent complete calendar years.
 * Live failures propagate (no silent fallback).
 */
import type { ClimateTrends } from '../types'
import { DATA_MODE } from './config'
import { httpGet } from './http'
import { resolveCoords } from './geo'

export type { ClimateTrends }

export async function getClimate(
  location: string,
  years = 5,
  signal?: AbortSignal,
): Promise<ClimateTrends> {
  if (DATA_MODE === 'live') {
    const { lat, lon } = resolveCoords(location)
    return httpGet<ClimateTrends>(
      `/api/climate?lat=${lat}&lon=${lon}&years=${years}`,
      signal,
    )
  }
  return Promise.resolve({ rainfallTrend: [], tempTrend: [] })
}

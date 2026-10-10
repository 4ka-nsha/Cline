/**
 * Harvest timing service (new module).
 *
 * Live mode calls GET /api/harvest?crop={crop}&sowingDate={YYYY-MM-DD}&lat={lat}&lon={lon}.
 * Live failures propagate (no silent fallback).
 */
import type { HarvestAdvice } from '../types'
import { DATA_MODE } from './config'
import { httpGet } from './http'
import { resolveCoords } from './geo'

export type { HarvestAdvice }

export async function getHarvest(
  crop: string,
  sowingDate: string,
  location: string,
  signal?: AbortSignal,
): Promise<HarvestAdvice> {
  if (DATA_MODE === 'live') {
    const { lat, lon } = resolveCoords(location)
    return httpGet<HarvestAdvice>(
      `/api/harvest?crop=${encodeURIComponent(crop)}&sowingDate=${sowingDate}&lat=${lat}&lon=${lon}`,
      signal,
    )
  }
  return Promise.resolve({
    optimalWindow: { start: '', end: '' },
    reason: 'Mock mode — switch to live for the harvest window.',
  })
}

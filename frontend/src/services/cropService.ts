import type { CropRecommendation, SeedVariety } from '../types'
import { DATA_MODE } from './config'
import { httpGet } from './http'
import { mockCropRecommendations } from '../mocks'

/**
 * Seed recommendation service. Live failures propagate (no silent fallback).
 *
 * Live mode calls GET /api/seeds?crop={crop}&state={state} and adapts the
 * backend { varieties } shape to the UI CropRecommendation type.
 * Signature is extended (crop, state) — Crops.tsx updated to match.
 */
export async function getCropRecommendations(
  crop: string,
  state?: string,
  signal?: AbortSignal,
): Promise<CropRecommendation[]> {
  if (DATA_MODE === 'live') {
    const q =
      `/api/seeds?crop=${encodeURIComponent(crop)}` +
      (state ? `&state=${encodeURIComponent(state)}` : '')
    const b = await httpGet<{ varieties: SeedVariety[] }>(q, signal)
    return b.varieties.map((v, i) => ({
      id: `seed-${v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`,
      name: v.name,
      expectedYield: `${v.yield} quintals/hectare`,
      // Backend has no suitability score; rank by position.
      suitability: Math.max(0, 100 - i * 5),
      reason: `Matures in ${v.maturityDays} days.${v.resistance.length ? ` Resistant to ${v.resistance.join(', ')}.` : ''}`,
      seedVariety: v.name,
      seedRate: '',
      durationDays: v.maturityDays,
    }))
  }
  return Promise.resolve(mockCropRecommendations)
}

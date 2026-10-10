/**
 * Irrigation advisory service (new module).
 *
 * Live mode calls GET /api/irrigation?crop={crop}&stage={stage}&lat={lat}&lon={lon}.
 * Live failures propagate (no silent fallback).
 */
import type { IrrigationAdvice } from '../types'
import { DATA_MODE } from './config'
import { httpGet } from './http'
import { resolveCoords } from './geo'

export type { IrrigationAdvice }

export async function getIrrigation(
  crop: string,
  stage: string,
  location: string,
  signal?: AbortSignal,
): Promise<IrrigationAdvice> {
  if (DATA_MODE === 'live') {
    const { lat, lon } = resolveCoords(location)
    return httpGet<IrrigationAdvice>(
      `/api/irrigation?crop=${encodeURIComponent(crop)}&stage=${encodeURIComponent(stage)}&lat=${lat}&lon=${lon}`,
      signal,
    )
  }
  return Promise.resolve({
    nextIrrigation: '',
    reason: 'Mock mode — switch to live for the irrigation advisory.',
    waterNeeded: '',
  })
}

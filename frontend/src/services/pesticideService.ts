/**
 * Pesticide safety-check service (new module).
 *
 * Live mode calls POST /api/pesticide/check with { pesticide } and returns
 * { status: 'approved' | 'banned' | 'restricted', reason }.
 * Uses httpPost (http.ts). Live failures propagate (no silent fallback).
 */
import type { PesticideCheckResult } from '../types'
import { DATA_MODE } from './config'
import { httpPost } from './http'

export type { PesticideCheckResult }

export async function checkPesticide(
  pesticide: string,
  signal?: AbortSignal,
): Promise<PesticideCheckResult> {
  if (DATA_MODE === 'live') {
    return httpPost<PesticideCheckResult>(
      '/api/pesticide/check',
      { pesticide },
      signal,
    )
  }
  return Promise.resolve({
    status: 'approved',
    reason: 'Mock mode — switch to live for the CIBRC safety check.',
  })
}

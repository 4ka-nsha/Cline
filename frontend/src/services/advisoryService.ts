import type { Advisory } from '../types'
import { DATA_MODE } from './config'
import { httpGet } from './http'
import { mockAdvisories } from '../mocks'

/**
 * Advisory service.
 *
 * In "mock" mode returns static advisories. In "live" mode calls the backend.
 * A live failure is NOT caught here — it propagates so the UI can show an
 * error instead of silently swapping in mock data.
 */
export async function getAdvisories(signal?: AbortSignal): Promise<Advisory[]> {
  if (DATA_MODE === 'live') {
    return httpGet<Advisory[]>('/api/advisories', signal)
  }
  return Promise.resolve(mockAdvisories)
}

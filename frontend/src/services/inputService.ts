import type { InputProduct } from '../types'
import { DATA_MODE } from './config'
import { httpGet } from './http'
import { mockInputs } from '../mocks'

/** Pesticide/input information service. Live failures propagate (no silent fallback). */
export async function getInputs(signal?: AbortSignal): Promise<InputProduct[]> {
  if (DATA_MODE === 'live') {
    return httpGet<InputProduct[]>('/api/inputs', signal)
  }
  return Promise.resolve(mockInputs)
}

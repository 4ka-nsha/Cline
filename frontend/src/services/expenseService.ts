import type { Expense } from '../types'
import { DATA_MODE } from './config'
import { httpGet } from './http'
import { mockExpenses } from '../mocks'

/**
 * Expense tracker service.
 *
 * NOTE on persistence: The MVP keeps expenses in component state and does not
 * persist across reloads in either mode unless the backend supports it. In
 * "live" mode a save would POST to the backend; the MVP exposes the read path
 * wired to live/mock. Live failures propagate (no silent fallback).
 */
export async function getExpenses(signal?: AbortSignal): Promise<Expense[]> {
  if (DATA_MODE === 'live') {
    return httpGet<Expense[]>('/api/expenses', signal)
  }
  return Promise.resolve(mockExpenses)
}

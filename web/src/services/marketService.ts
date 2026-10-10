import type { MarketPrice } from '../types'
import { DATA_MODE } from './config'
import { httpGet } from './http'
import { mockMarketPrices } from '../mocks'

/** Market prices & MSP service. Live failures propagate (no silent fallback). */
export async function getMarketPrices(
  signal?: AbortSignal,
): Promise<MarketPrice[]> {
  if (DATA_MODE === 'live') {
    return httpGet<{ data: MarketPrice[] }>('/api/demo/market', signal).then((r) => r.data)
  }
  return Promise.resolve(mockMarketPrices)
}

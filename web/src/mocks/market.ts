import type { MarketPrice } from '../types'

export const mockMarketPrices: MarketPrice[] = [
  { id: 'm-wheat', commodity: 'Wheat', market: 'Local Mandi', pricePerQuintal: 2450, mspPerQuintal: 2275, unit: 'quintal', date: '2026-10-09', trend: 'up' },
  { id: 'm-mustard', commodity: 'Mustard', market: 'Local Mandi', pricePerQuintal: 5600, mspPerQuintal: 5650, unit: 'quintal', date: '2026-10-09', trend: 'down' },
  { id: 'm-chickpea', commodity: 'Chickpea', market: 'Local Mandi', pricePerQuintal: 6100, mspPerQuintal: 5440, unit: 'quintal', date: '2026-10-09', trend: 'up' },
  { id: 'm-potato', commodity: 'Potato', market: 'Local Mandi', pricePerQuintal: 1200, mspPerQuintal: null, unit: 'quintal', date: '2026-10-09', trend: 'stable' },
  { id: 'm-paddy', commodity: 'Paddy', market: 'Local Mandi', pricePerQuintal: 2200, mspPerQuintal: 2183, unit: 'quintal', date: '2026-10-09', trend: 'stable' },
  { id: 'm-onion', commodity: 'Onion', market: 'Local Mandi', pricePerQuintal: 1800, mspPerQuintal: null, unit: 'quintal', date: '2026-10-09', trend: 'up' },
]

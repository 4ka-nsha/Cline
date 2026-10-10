import type { CropRecommendation } from '../types'

export const mockCropRecommendations: CropRecommendation[] = [
  {
    id: 'crop-wheat',
    name: 'Wheat',
    expectedYield: '18-22 quintals/acre',
    suitability: 92,
    reason: 'Well suited to loamy soil and the current cool season.',
    seedVariety: 'HD-2967',
    seedRate: '45 kg/acre',
    durationDays: 130,
  },
  {
    id: 'crop-mustard',
    name: 'Mustard',
    expectedYield: '8-10 quintals/acre',
    suitability: 84,
    reason: 'Thrives in sandy-loam and provides a good rotation crop.',
    seedVariety: 'Pusa Bold',
    seedRate: '4 kg/acre',
    durationDays: 110,
  },
  {
    id: 'crop-chickpea',
    name: 'Chickpea (Chana)',
    expectedYield: '10-12 quintals/acre',
    suitability: 78,
    reason: 'Fixes nitrogen in soil and needs less water.',
    seedVariety: 'Pusa 372',
    seedRate: '40 kg/acre',
    durationDays: 120,
  },
  {
    id: 'crop-potato',
    name: 'Potato',
    expectedYield: '80-100 quintals/acre',
    suitability: 71,
    reason: 'Profitable but needs consistent irrigation and fertile soil.',
    seedVariety: 'Kufri Jyoti',
    seedRate: '800 kg/acre',
    durationDays: 100,
  },
]

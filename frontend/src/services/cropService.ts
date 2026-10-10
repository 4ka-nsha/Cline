import type { CropRecommendation } from '../types'
import { DATA_MODE } from './config'
import { httpGet } from './http'
import { mockCropRecommendations } from '../mocks'

/** Crop & seed recommendation service. Live failures propagate (no silent fallback). */
export async function getCropRecommendations(
  signal?: AbortSignal,
): Promise<CropRecommendation[]> {
  if (DATA_MODE === 'live') {
    return httpGet<CropRecommendation[]>('/api/crops', signal)
  }
  return Promise.resolve(mockCropRecommendations)
}

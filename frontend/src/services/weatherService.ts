import type { WeatherForecast } from '../types'
import { DATA_MODE } from './config'
import { httpGet } from './http'
import { mockWeather } from '../mocks'

/** Weather forecast service. Live failures propagate (no silent fallback). */
export async function getWeather(
  location: string,
  signal?: AbortSignal,
): Promise<WeatherForecast> {
  if (DATA_MODE === 'live') {
    const q = encodeURIComponent(location)
    return httpGet<WeatherForecast>(`/api/weather?location=${q}`, signal)
  }
  return Promise.resolve(mockWeather)
}

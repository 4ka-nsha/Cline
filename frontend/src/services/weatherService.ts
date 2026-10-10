import type { WeatherForecast } from '../types'
import { apiGet } from '../api/client'
import { mockWeather } from '../mocks'
import { DATA_MODE } from './config'

/** Raw shape returned by GET /api/weather (see 02-api-contracts.md). */
interface BackendWeather {
  forecast: {
    date: string
    tempMax: number
    tempMin: number
    rainfall: number
    description: string
  }[]
}

/** Demo coordinates (Thanjavur, Tamil Nadu) until the profile stores lat/lon. */
const DEMO_LAT = 10.78
const DEMO_LON = 79.13

/**
 * Weather forecast service. Live failures propagate (no silent fallback).
 *
 * Live mode calls GET /api/weather?lat=10.78&lon=79.13 via src/api/client
 * and adapts the backend { forecast } shape to the UI WeatherForecast type.
 */
export async function getWeather(
  location: string,
  signal?: AbortSignal,
): Promise<WeatherForecast> {
  if (DATA_MODE === 'live') {
    const b = await apiGet<BackendWeather>(
      `/api/weather?lat=${DEMO_LAT}&lon=${DEMO_LON}`,
      signal,
    )
    return {
      location,
      current: {
        tempC: b.forecast[0]?.tempMax ?? 0,
        condition: b.forecast[0]?.description ?? '',
        // Backend does not provide these; UI must tolerate 0/unknown.
        humidity: 0,
        windKph: 0,
      },
      daily: b.forecast.map((d) => ({
        date: d.date,
        tempMin: d.tempMin,
        tempMax: d.tempMax,
        condition: d.description,
        rainfallMm: d.rainfall,
        humidity: 0,
      })),
      alerts: [],
    }
  }
  return Promise.resolve(mockWeather)
}

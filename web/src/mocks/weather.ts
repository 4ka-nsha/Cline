import type { WeatherForecast } from '../types'

export const mockWeather: WeatherForecast = {
  location: 'Your Farm Location',
  current: {
    tempC: 26,
    condition: 'Partly cloudy',
    humidity: 62,
    windKph: 12,
  },
  daily: [
    { date: '2026-10-10', tempMin: 18, tempMax: 29, condition: 'Sunny', rainfallMm: 0, humidity: 55 },
    { date: '2026-10-11', tempMin: 19, tempMax: 30, condition: 'Partly cloudy', rainfallMm: 0, humidity: 58 },
    { date: '2026-10-12', tempMin: 20, tempMax: 28, condition: 'Cloudy', rainfallMm: 2, humidity: 70 },
    { date: '2026-10-13', tempMin: 19, tempMax: 26, condition: 'Light rain', rainfallMm: 8, humidity: 82 },
    { date: '2026-10-14', tempMin: 18, tempMax: 27, condition: 'Sunny', rainfallMm: 0, humidity: 60 },
    { date: '2026-10-15', tempMin: 18, tempMax: 29, condition: 'Sunny', rainfallMm: 0, humidity: 54 },
    { date: '2026-10-16', tempMin: 19, tempMax: 31, condition: 'Clear', rainfallMm: 0, humidity: 50 },
  ],
  alerts: [
    'Light rain expected on Oct 13 — delay any planned spraying.',
    'Dry spell Oct 14-16 — ensure adequate irrigation.',
  ],
}

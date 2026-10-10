import { Router } from 'express';
import type { Advisory, MarketPrice, WeatherForecast } from './types';
import { makeMeta } from '../../http';

export const demoRouter: Router = Router();

const advisories: Advisory[] = [
  {
    id: 'adv-1',
    title: 'Irrigate today (demo)',
    message: 'No rainfall expected in the next 48 hours. This is demo data — review your field before irrigating.',
    level: 'warning',
    action: 'Plan irrigation',
    icon: 'droplets',
  },
  {
    id: 'adv-2',
    title: 'Good sowing window (demo)',
    message: 'Demonstration advisory — not a validated agronomic recommendation.',
    level: 'success',
    action: 'View crops',
    icon: 'sprout',
  },
  {
    id: 'adv-3',
    title: 'Wheat price above MSP (demo)',
    message: 'Demonstration market advisory. Prices are reported observations, not guaranteed sale offers.',
    level: 'info',
    action: 'View market',
    icon: 'trending-up',
  },
];

const weather: WeatherForecast = {
  location: 'Demo farm',
  current: { tempC: 26, condition: 'Partly cloudy', humidity: 62, windKph: 12 },
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
    'Demo alert: light rain expected on Oct 13 — review any planned spraying.',
    'Demo alert: dry spell Oct 14–16 — review irrigation needs.',
  ],
};

const market: MarketPrice[] = [
  { id: 'm-wheat', commodity: 'Wheat', market: 'Local Mandi', pricePerQuintal: 2450, mspPerQuintal: 2275, unit: 'quintal', date: '2026-10-09', trend: 'up' },
  { id: 'm-mustard', commodity: 'Mustard', market: 'Local Mandi', pricePerQuintal: 5600, mspPerQuintal: 5650, unit: 'quintal', date: '2026-10-09', trend: 'down' },
  { id: 'm-chickpea', commodity: 'Chickpea', market: 'Local Mandi', pricePerQuintal: 6100, mspPerQuintal: 5440, unit: 'quintal', date: '2026-10-09', trend: 'up' },
  { id: 'm-potato', commodity: 'Potato', market: 'Local Mandi', pricePerQuintal: 1200, mspPerQuintal: null, unit: 'quintal', date: '2026-10-09', trend: 'stable' },
  { id: 'm-paddy', commodity: 'Paddy', market: 'Local Mandi', pricePerQuintal: 2200, mspPerQuintal: 2183, unit: 'quintal', date: '2026-10-09', trend: 'stable' },
  { id: 'm-onion', commodity: 'Onion', market: 'Local Mandi', pricePerQuintal: 1800, mspPerQuintal: null, unit: 'quintal', date: '2026-10-09', trend: 'up' },
];

/**
 * Explicitly-labelled demo endpoints for the dashboard/weather/market pages.
 * These exist so the UI has something to call in live mode before the real
 * weather/calendar/market modules land. Every payload is marked demo.
 */
demoRouter.get('/advisories', (_req, res) => {
  res.json({ data: advisories, meta: { ...makeMeta(), demo: true } });
});

demoRouter.get('/weather', (req, res) => {
  const location = typeof req.query.location === 'string' && req.query.location.trim() !== ''
    ? req.query.location
    : weather.location;
  res.json({ data: { ...weather, location }, meta: { ...makeMeta(), demo: true } });
});

demoRouter.get('/market', (_req, res) => {
  res.json({ data: market, meta: { ...makeMeta(), demo: true } });
});

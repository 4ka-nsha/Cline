/** Shared shapes for the explicitly-labelled demo endpoints. */

export type AdvisoryLevel = 'info' | 'success' | 'warning' | 'danger';

export interface Advisory {
  id: string;
  title: string;
  message: string;
  level: AdvisoryLevel;
  action?: string;
  icon?: string;
}

export interface WeatherDay {
  date: string;
  tempMin: number;
  tempMax: number;
  condition: string;
  rainfallMm: number;
  humidity: number;
}

export interface WeatherForecast {
  location: string;
  current: {
    tempC: number;
    condition: string;
    humidity: number;
    windKph: number;
  };
  daily: WeatherDay[];
  alerts: string[];
}

export interface MarketPrice {
  id: string;
  commodity: string;
  market: string;
  pricePerQuintal: number;
  mspPerQuintal: number | null;
  unit: string;
  date: string;
  trend: 'up' | 'down' | 'stable';
}

"""Open-Meteo integration: fetch and shape the 7-day forecast.

Ported from the original Express implementation (src/routes/weather.js).
"""
from __future__ import annotations

from urllib.parse import urlencode

import httpx

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"
REQUEST_TIMEOUT_SECONDS = 10.0
FORECAST_DAYS = 7

# WMO weather interpretation codes used by Open-Meteo.
# https://open-meteo.com/en/docs
WMO_CODES = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
}


class WeatherServiceError(Exception):
    """Raised when the upstream weather service cannot be used."""

    def __init__(self, message: str, status_code: int = 502) -> None:
        super().__init__(message)
        self.status_code = status_code


def describe_weather(code: int | None) -> str:
    if code is None:
        return "Unknown"
    return WMO_CODES.get(code, "Unknown")


def build_open_meteo_url(lat: float, lon: float) -> str:
    params = {
        "latitude": str(lat),
        "longitude": str(lon),
        "daily": "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum",
        "timezone": "auto",
        "forecast_days": str(FORECAST_DAYS),
    }
    return f"{OPEN_METEO_URL}?{urlencode(params)}"


async def fetch_forecast(lat: float, lon: float) -> dict:
    """Fetch the daily forecast and return { "forecast": [...] }."""
    url = build_open_meteo_url(lat, lon)

    try:
        async with httpx.AsyncClient(
            timeout=REQUEST_TIMEOUT_SECONDS,
            headers={"Accept": "application/json"},
        ) as client:
            response = await client.get(url)
    except httpx.TimeoutException as exc:
        raise WeatherServiceError("Weather service request timed out") from exc
    except httpx.HTTPError as exc:
        raise WeatherServiceError("Could not reach the weather service") from exc

    if response.status_code >= 400:
        raise WeatherServiceError(
            f"Weather service responded with status {response.status_code}"
        )

    try:
        data = response.json()
    except ValueError as exc:
        raise WeatherServiceError("Weather service returned an invalid response") from exc

    daily = data.get("daily") if isinstance(data, dict) else None
    if not daily or not isinstance(daily.get("time"), list):
        raise WeatherServiceError("Weather service response is missing daily forecast data")

    times = daily["time"]
    temp_max = daily.get("temperature_2m_max") or []
    temp_min = daily.get("temperature_2m_min") or []
    precip = daily.get("precipitation_sum") or []
    codes = daily.get("weather_code") or []

    forecast = [
        {
            "date": date,
            "tempMax": temp_max[index] if index < len(temp_max) else None,
            "tempMin": temp_min[index] if index < len(temp_min) else None,
            "rainfall": precip[index] if index < len(precip) else 0,
            "description": describe_weather(codes[index] if index < len(codes) else None),
        }
        for index, date in enumerate(times)
    ]

    return {"forecast": forecast}

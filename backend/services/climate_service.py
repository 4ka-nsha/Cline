"""Open-Meteo Historical Weather (ERA5) integration for climate trends.

Provides multi-year annual rainfall and temperature trends for a coordinate.
Data source: https://open-meteo.com/en/docs/historical-weather-api
(ERA5 reanalysis archive, free, no API key).
"""
from __future__ import annotations

from datetime import date
from urllib.parse import urlencode

import httpx

ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive"
REQUEST_TIMEOUT_SECONDS = 15.0

DAILY_VARS = "precipitation_sum,temperature_2m_max,temperature_2m_min"


class ClimateServiceError(Exception):
    """Raised when the upstream climate service cannot be used."""

    def __init__(self, message: str, status_code: int = 502) -> None:
        super().__init__(message)
        self.status_code = status_code


def _complete_year_window(years: int) -> tuple[date, date]:
    """Return (start, end) covering the most recent `years` COMPLETE calendar years.

    The current in-progress year is deliberately excluded: its partial data
    would understate annual rainfall and skew a trend chart (e.g. in Oct 2026
    a "2026" point would only reflect Jan-Oct). We bound the window from
    Jan 1 of (current_year - years) through Dec 31 of (current_year - 1) so
    the response contains exactly `years` full years -- for years=5 in 2026
    that is 2021-01-01..2025-12-31 (i.e. 2021, 2022, 2023, 2024, 2025).
    """
    current_year = date.today().year
    return date(current_year - years, 1, 1), date(current_year - 1, 12, 31)


def build_archive_url(lat: float, lon: float, years: int) -> str:
    start, end = _complete_year_window(years)
    params = {
        "latitude": str(lat),
        "longitude": str(lon),
        "start_date": start.isoformat(),
        "end_date": end.isoformat(),
        "daily": DAILY_VARS,
    }
    return f"{ARCHIVE_URL}?{urlencode(params)}"


async def fetch_climate_trends(lat: float, lon: float, years: int) -> dict:
    """Fetch daily archive data and aggregate into annual trends.

    Returns the exact API-contract payload:
    { "rainfallTrend": [{ year, rainfall }], "tempTrend": [{ year, tempMax, tempMin }] }
    """
    url = build_archive_url(lat, lon, years)

    try:
        async with httpx.AsyncClient(
            timeout=REQUEST_TIMEOUT_SECONDS,
            headers={"Accept": "application/json"},
        ) as client:
            response = await client.get(url)
    except httpx.TimeoutException as exc:
        raise ClimateServiceError("Climate service request timed out") from exc
    except httpx.HTTPError as exc:
        raise ClimateServiceError("Could not reach the climate service") from exc

    if response.status_code >= 400:
        raise ClimateServiceError(
            f"Climate service responded with status {response.status_code}"
        )

    try:
        data = response.json()
    except ValueError as exc:
        raise ClimateServiceError("Climate service returned an invalid response") from exc

    daily = data.get("daily") if isinstance(data, dict) else None
    if not daily or not isinstance(daily.get("time"), list):
        raise ClimateServiceError(
            "Climate service response is missing daily data"
        )

    times = daily["time"]
    precip = daily.get("precipitation_sum") or []
    tmax = daily.get("temperature_2m_max") or []
    tmin = daily.get("temperature_2m_min") or []

    # Bucket daily values by calendar year, skipping nulls (missing days).
    per_year: dict[int, dict[str, list]] = {}
    for index, day in enumerate(times):
        try:
            year = int(str(day)[:4])
        except (TypeError, ValueError):
            continue
        bucket = per_year.setdefault(year, {"rain": [], "tmax": [], "tmin": []})

        p = precip[index] if index < len(precip) else None
        if p is not None:
            bucket["rain"].append(p)
        mx = tmax[index] if index < len(tmax) else None
        if mx is not None:
            bucket["tmax"].append(mx)
        mn = tmin[index] if index < len(tmin) else None
        if mn is not None:
            bucket["tmin"].append(mn)

    if not per_year:
        raise ClimateServiceError("Climate service response contained no usable daily data")

    # The fetch window (_complete_year_window) already excludes the current
    # in-progress year, so every bucket here is a complete calendar year. We
    # still defensively drop the current year and keep only the most recent
    # `years` entries, then sort ascending for the trend chart.
    current_year = date.today().year
    complete_years = [y for y in per_year if y < current_year]
    selected = sorted(complete_years, reverse=True)[:years]
    selected.sort()

    rainfall_trend = []
    temp_trend = []
    for year in selected:
        bucket = per_year[year]
        if bucket["rain"]:
            rainfall_trend.append(
                {"year": year, "rainfall": round(sum(bucket["rain"]), 1)}
            )
        if bucket["tmax"] and bucket["tmin"]:
            temp_trend.append(
                {
                    "year": year,
                    "tempMax": round(sum(bucket["tmax"]) / len(bucket["tmax"]), 1),
                    "tempMin": round(sum(bucket["tmin"]) / len(bucket["tmin"]), 1),
                }
            )

    return {"rainfallTrend": rainfall_trend, "tempTrend": temp_trend}

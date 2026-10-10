"""Irrigation advisory logic.

Combines a hardcoded crop x stage water-requirement table (backend/data/
irrigation.json) with the live Open-Meteo forecast (via services.weather) to
recommend whether to irrigate now or defer based on expected rainfall.
"""
from __future__ import annotations

import json
from datetime import date
from pathlib import Path

from functools import lru_cache

from services.weather import WeatherServiceError, fetch_forecast

DATA_FILE = Path(__file__).resolve().parents[1] / "data" / "irrigation.json"

# How many forecast days of rain count toward the upcoming-water decision.
RAIN_LOOKAHEAD_DAYS = 3


class IrrigationServiceError(Exception):
    """Raised for bad crop/stage input or an unusable forecast."""

    def __init__(self, message: str, status_code: int = 400) -> None:
        super().__init__(message)
        self.status_code = status_code


@lru_cache(maxsize=1)
def _load_data() -> dict:
    with DATA_FILE.open(encoding="utf-8") as fh:
        return json.load(fh)


def _find_stage_key(stages: dict, stage: str) -> str | None:
    """Case-insensitive match of the requested stage against the table keys."""
    wanted = stage.strip().lower()
    for key in stages:
        if key.lower() == wanted:
            return key
    return None


async def advise_irrigation(crop: str, stage: str, lat: float, lon: float) -> dict:
    """Return { nextIrrigation, reason, waterNeeded } for a crop/stage/location."""
    data = _load_data()
    crops = data["crops"]

    crop_key = crop.strip().lower()
    if crop_key not in crops:
        raise IrrigationServiceError(
            f"Unknown crop '{crop}'. Supported crops: {', '.join(sorted(crops))}",
            status_code=404,
        )

    stages = crops[crop_key]["stages"]
    stage_key = _find_stage_key(stages, stage)
    if stage_key is None:
        raise IrrigationServiceError(
            f"Unknown stage '{stage}' for {crop_key}. "
            f"Stages: {', '.join(stages)}",
            status_code=404,
        )

    need_mm = stages[stage_key]["waterMm"]
    critical = stages[stage_key]["critical"]
    runoff = data.get("runoffCoefficient", {}).get(
        crop_key, data.get("runoffCoefficient", {}).get("default", 0.6)
    )

    # Pull the live forecast; rainfall over the lookahead window decides timing.
    try:
        forecast = await fetch_forecast(lat, lon)
    except WeatherServiceError as exc:
        raise IrrigationServiceError(str(exc), status_code=502) from exc

    days = forecast.get("forecast", [])[:RAIN_LOOKAHEAD_DAYS]
    rain_total = sum(d.get("rainfall") or 0 for d in days)
    effective_rain = round(rain_total * runoff, 1)
    coverage = min(1.0, effective_rain / need_mm) if need_mm else 1.0
    deficit_mm = round(max(0.0, need_mm - effective_rain), 1)

    critical_note = " (critical stage — do not stress)" if critical else ""

    if effective_rain >= need_mm:
        next_irrigation = "defer"
        reason = (
            f"{rain_total:.1f} mm rain is expected over the next {len(days)} day(s); "
            f"after runoff that is ~{effective_rain:.1f} mm of effective water, "
            f"meeting the ~{need_mm} mm need for {crop_key} at '{stage_key}'"
            f"{critical_note}. Postpone irrigation and re-check after the rain."
        )
        water_needed = "0 mm this round (rain should cover the requirement)"
    else:
        next_irrigation = "irrigate now"
        reason = (
            f"Only ~{effective_rain:.1f} mm of effective rain is expected over the "
            f"next {len(days)} day(s), which covers {coverage*100:.0f}% of the "
            f"~{need_mm} mm need for {crop_key} at '{stage_key}'{critical_note}. "
            f"Irrigate to make up the ~{deficit_mm} mm deficit."
        )
        water_needed = f"{deficit_mm} mm (~{deficit_mm * 10} m³/ha)"

    return {
        "nextIrrigation": next_irrigation,
        "reason": reason,
        "waterNeeded": water_needed,
    }

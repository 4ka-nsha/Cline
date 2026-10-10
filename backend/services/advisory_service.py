"""Advisory synthesizer: combine weather + irrigation into farmer advisories.

No direct external HTTP calls here — all upstream data comes through the
existing services (services.weather.fetch_forecast and
services.irrigation_service.advise_irrigation). The irrigation call also
validates the crop/stage inputs (404 on unknown values).
"""
from __future__ import annotations

from services.irrigation_service import IrrigationServiceError, advise_irrigation
from services.weather import WeatherServiceError, fetch_forecast

# Rule thresholds.
HEAVY_RAIN_MM_3D = 10.0
LOW_RAIN_MM_5D = 2.0
HEAT_TEMP_C = 35.0


class AdvisoryServiceError(Exception):
    """Raised for bad crop/stage input or unusable upstream data."""

    def __init__(self, message: str, status_code: int = 400) -> None:
        super().__init__(message)
        self.status_code = status_code


async def build_advisories(crop: str, stage: str, lat: float, lon: float) -> dict:
    """Return { advisories: [{ title, message, severity }] } (1-3 items)."""
    crop = (crop or "").strip() or "rice"
    stage = (stage or "").strip() or "flowering"

    # Validates crop/stage (raises 404 on unknown) and gives the watering
    # outlook used for the all-clear fallback advisory below.
    try:
        irrigation = await advise_irrigation(crop, stage, lat, lon)
    except IrrigationServiceError as exc:
        raise AdvisoryServiceError(str(exc), status_code=exc.status_code) from exc

    try:
        forecast_data = await fetch_forecast(lat, lon)
    except WeatherServiceError as exc:
        raise AdvisoryServiceError(str(exc), status_code=502) from exc

    days = forecast_data.get("forecast", [])
    rain_3d = sum((d.get("rainfall") or 0) for d in days[:3])
    rain_5d = sum((d.get("rainfall") or 0) for d in days[:5])
    today_max = days[0].get("tempMax") if days else None

    advisories: list[dict] = []

    if rain_3d > HEAVY_RAIN_MM_3D:
        advisories.append(
            {
                "title": "Heavy rain expected",
                "message": (
                    f"About {rain_3d:.1f} mm of rain is expected over the next "
                    "3 days. Heavy rain expected — delay pesticide spraying."
                ),
                "severity": "warning",
            }
        )

    if rain_5d < LOW_RAIN_MM_5D and stage.lower() == "flowering":
        advisories.append(
            {
                "title": "Low rainfall at flowering",
                "message": (
                    f"Only about {rain_5d:.1f} mm of rain is expected over the "
                    "next 5 days. Low rainfall during flowering — plan "
                    "irrigation within 2 days."
                ),
                "severity": "critical",
            }
        )

    if isinstance(today_max, (int, float)) and today_max > HEAT_TEMP_C:
        advisories.append(
            {
                "title": "Heat stress risk",
                "message": (
                    f"Today's high of {today_max:.1f}°C exceeds {HEAT_TEMP_C:.0f}°C. "
                    "High heat stress risk — irrigate early morning."
                ),
                "severity": "warning",
            }
        )

    if not advisories:
        advisories.append(
            {
                "title": "Conditions normal",
                "message": (
                    f"No rain or heat risks for {crop} at '{stage}' in the next "
                    "few days. Irrigation outlook: "
                    f"{irrigation.get('nextIrrigation')} "
                    f"({irrigation.get('waterNeeded')})."
                ),
                "severity": "info",
            }
        )

    return {"advisories": advisories[:3]}

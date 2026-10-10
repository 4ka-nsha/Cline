"""GET /api/weather route.

Query params: lat (float, -90..90), lon (float, -180..180).
Response: { forecast: [{ date, tempMax, tempMin, rainfall, description }] }
"""
from fastapi import APIRouter, HTTPException, Query

from services.weather import WeatherServiceError, fetch_forecast

router = APIRouter()


@router.get("")
async def get_weather(
    lat: float = Query(..., description="Latitude between -90 and 90"),
    lon: float = Query(..., description="Longitude between -180 and 180"),
) -> dict:
    if not -90 <= lat <= 90:
        raise HTTPException(
            status_code=400,
            detail="Query parameter lat must be between -90 and 90",
        )
    if not -180 <= lon <= 180:
        raise HTTPException(
            status_code=400,
            detail="Query parameter lon must be between -180 and 180",
        )

    try:
        return await fetch_forecast(lat, lon)
    except WeatherServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=str(exc)) from exc

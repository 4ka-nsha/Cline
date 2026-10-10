"""GET /api/climate route.

Query params: lat (float, -90..90), lon (float, -180..180), years (int, default 5).
Response: { rainfallTrend: [{ year, rainfall }], tempTrend: [{ year, tempMax, tempMin }] }
"""
from fastapi import APIRouter, HTTPException, Query

from services.climate_service import ClimateServiceError, fetch_climate_trends

router = APIRouter()


@router.get("")
async def get_climate(
    lat: float = Query(..., description="Latitude between -90 and 90"),
    lon: float = Query(..., description="Longitude between -180 and 180"),
    years: int = Query(5, ge=1, le=100, description="Number of years of history"),
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
        return await fetch_climate_trends(lat, lon, years)
    except ClimateServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=str(exc)) from exc

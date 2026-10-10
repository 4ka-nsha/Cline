"""GET /api/harvest route.

Query params: crop, sowingDate (YYYY-MM-DD), lat, lon.
Response: { optimalWindow: { start, end }, reason: string }

lat/lon are accepted for contract parity; harvest timing here is driven by the
sowing date and the crop maturity table (not location-specific).
"""
from datetime import date

from fastapi import APIRouter, HTTPException, Query

from services.harvest_service import HarvestServiceError, advise_harvest

router = APIRouter()


@router.get("")
def get_harvest(
    crop: str = Query(..., description="Crop name, e.g. rice, wheat, cotton, tomato"),
    sowingDate: date = Query(..., alias="sowingDate", description="Sowing date (YYYY-MM-DD)"),
    lat: float = Query(..., description="Latitude between -90 and 90"),
    lon: float = Query(..., description="Longitude between -180 and 180"),
) -> dict:
    if not -90 <= lat <= 90:
        raise HTTPException(status_code=400, detail="lat must be between -90 and 90")
    if not -180 <= lon <= 180:
        raise HTTPException(status_code=400, detail="lon must be between -180 and 180")

    try:
        return advise_harvest(crop, sowingDate)
    except HarvestServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=str(exc)) from exc

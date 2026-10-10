"""GET /api/irrigation route.

Query params: crop, stage, lat, lon.
Response: { nextIrrigation: string, reason: string, waterNeeded: string }
"""
from datetime import date

from fastapi import APIRouter, HTTPException, Query

from services.irrigation_service import IrrigationServiceError, advise_irrigation

router = APIRouter()


@router.get("")
async def get_irrigation(
    crop: str = Query(..., description="Crop name, e.g. rice, wheat, cotton, tomato"),
    stage: str = Query(..., description="Growth stage, e.g. flowering, tillering"),
    lat: float = Query(..., description="Latitude between -90 and 90"),
    lon: float = Query(..., description="Longitude between -180 and 180"),
) -> dict:
    if not -90 <= lat <= 90:
        raise HTTPException(status_code=400, detail="lat must be between -90 and 90")
    if not -180 <= lon <= 180:
        raise HTTPException(status_code=400, detail="lon must be between -180 and 180")

    try:
        return await advise_irrigation(crop, stage, lat, lon)
    except IrrigationServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=str(exc)) from exc

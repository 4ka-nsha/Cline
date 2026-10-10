"""GET /api/advisories route (synthesizer: weather + irrigation).

Query params: lat, lon (required), crop (default rice), stage (default flowering).
Response: { advisories: [{ title, message, severity }] },
  where severity is one of 'info' | 'warning' | 'critical'.
"""
from fastapi import APIRouter, HTTPException, Query

from services.advisory_service import AdvisoryServiceError, build_advisories

router = APIRouter()


@router.get("")
async def get_advisories(
    lat: float = Query(..., description="Latitude between -90 and 90"),
    lon: float = Query(..., description="Longitude between -180 and 180"),
    crop: str = Query("rice", description="Crop name, e.g. rice, wheat, cotton, tomato"),
    stage: str = Query("flowering", description="Growth stage, e.g. flowering, tillering"),
) -> dict:
    if not -90 <= lat <= 90:
        raise HTTPException(status_code=400, detail="lat must be between -90 and 90")
    if not -180 <= lon <= 180:
        raise HTTPException(status_code=400, detail="lon must be between -180 and 180")

    try:
        return await build_advisories(crop, stage, lat, lon)
    except AdvisoryServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=str(exc)) from exc

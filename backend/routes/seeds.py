"""GET /api/seeds route.

Query params: crop (required, case-insensitive), state (optional, case-insensitive).
Response: { varieties: [{ name, maturityDays, yield, resistance }] }
"""
from fastapi import APIRouter, HTTPException, Query

from services.seed_service import recommend_seeds

router = APIRouter()


@router.get("")
def get_seeds(
    crop: str = Query(..., description="Crop name, e.g. rice, wheat, cotton, tomato"),
    state: str | None = Query(None, description="Optional state to filter suitable varieties"),
) -> dict:
    if not crop.strip():
        raise HTTPException(
            status_code=400,
            detail="Query parameter crop must be a non-empty string",
        )

    varieties = recommend_seeds(crop, state)
    if not varieties:
        raise HTTPException(
            status_code=404,
            detail=f"No varieties found for crop '{crop}'"
            + (f" in state '{state}'" if state else ""),
        )
    return {"varieties": varieties}

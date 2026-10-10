"""POST /api/pesticide/check route.

Body: { pesticide: string }
Response: { status: "approved" | "banned" | "restricted", reason: string }
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.pesticide_service import check_pesticide

router = APIRouter()


class PesticideCheckRequest(BaseModel):
    pesticide: str


@router.post("/check")
def check(req: PesticideCheckRequest) -> dict:
    name = req.pesticide.strip()
    if not name:
        raise HTTPException(
            status_code=400,
            detail="Query body must include a non-empty 'pesticide' string",
        )
    return check_pesticide(name)

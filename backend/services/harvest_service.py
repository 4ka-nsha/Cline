"""Harvest timing logic.

Computes the optimal harvest window from a sowing date plus a hardcoded crop
maturity table (backend/data/harvest.json).
"""
from __future__ import annotations

import json
from datetime import date, timedelta
from functools import lru_cache
from pathlib import Path

DATA_FILE = Path(__file__).resolve().parents[1] / "data" / "harvest.json"


class HarvestServiceError(Exception):
    """Raised for an unknown crop or an invalid sowing date."""

    def __init__(self, message: str, status_code: int = 400) -> None:
        super().__init__(message)
        self.status_code = status_code


@lru_cache(maxsize=1)
def _load_data() -> dict:
    with DATA_FILE.open(encoding="utf-8") as fh:
        return json.load(fh)


def advise_harvest(crop: str, sowing_date: date) -> dict:
    """Return { optimalWindow: { start, end }, reason } for a crop and sowing date."""
    crops = _load_data()["crops"]
    crop_key = crop.strip().lower()
    if crop_key not in crops:
        raise HarvestServiceError(
            f"Unknown crop '{crop}'. Supported crops: {', '.join(sorted(crops))}",
            status_code=404,
        )

    window = crops[crop_key]
    start = sowing_date + timedelta(days=window["minDays"])
    end = sowing_date + timedelta(days=window["maxDays"])

    reason = (
        f"{crop_key} typically matures in {window['minDays']}–{window['maxDays']} "
        f"days. Sown on {sowing_date.isoformat()}, the optimal harvest window is "
        f"{start.isoformat()} to {end.isoformat()}. Monitor grain/moisture and "
        f"weather before the window opens."
    )

    return {
        "optimalWindow": {"start": start.isoformat(), "end": end.isoformat()},
        "reason": reason,
    }

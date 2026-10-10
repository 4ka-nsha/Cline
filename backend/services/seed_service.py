"""Seed recommendation lookup against a hardcoded ICAR variety dataset.

Data source: backend/data/seeds.json. Filtering is by crop (case-insensitive)
and, optionally, by suitable state (case-insensitive exact match).
"""
from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

# backend/data/seeds.json -> parents[1] == backend/
DATA_FILE = Path(__file__).resolve().parents[1] / "data" / "seeds.json"


@lru_cache(maxsize=1)
def _load_varieties() -> list[dict]:
    with DATA_FILE.open(encoding="utf-8") as fh:
        raw = json.load(fh)
    return raw.get("varieties", [])


def recommend_seeds(crop: str, state: str | None = None) -> list[dict]:
    """Return contract-shaped varieties for a crop, optionally filtered by state.

    Each item: { name, maturityDays, yield, resistance }.
    """
    crop_l = crop.strip().lower()
    state_l = state.strip().lower() if state else None

    results = []
    for v in _load_varieties():
        if v.get("crop", "").lower() != crop_l:
            continue
        if state_l is not None:
            states = [s.lower() for s in v.get("suitableStates", [])]
            if state_l not in states:
                continue
        results.append(
            {
                "name": v["name"],
                "maturityDays": v["maturityDays"],
                # JSON stores yieldQuintalsPerHectare; API contract field is 'yield'.
                "yield": v["yieldQuintalsPerHectare"],
                "resistance": v.get("resistance", []),
            }
        )
    return results

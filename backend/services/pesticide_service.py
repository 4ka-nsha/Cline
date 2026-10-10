"""Pesticide safety lookup against a hardcoded CIBRC dataset.

Data source: backend/data/pesticides.json (banned + restricted pesticides).
Matching is tolerant of common trade names, formulations and casing, e.g.
"Chlorpyrifos 20 EC", "Lorsban" and "chlorpyrifos" all resolve to the same entry.
"""
from __future__ import annotations

import json
import re
from functools import lru_cache
from pathlib import Path

# backend/data/pesticides.json -> parents[1] == backend/
DATA_FILE = Path(__file__).resolve().parents[1] / "data" / "pesticides.json"

# Tokens stripped before matching, so "Chlorpyrifos 20 EC" matches "chlorpyrifos".
_FORMULATION_NOISE = {
    "ec", "sc", "wp", "sp", "ws", "wg", "wdg", "sl", "ls", "dc", "ew", "ol",
    "gr", "gs", "granules", "granular", "wettable", "soluble", "emulsifiable",
    "concentrate", "suspension", "powder", "liquid", "active", "ingredient",
}


def _normalise(text: str) -> str:
    """Lowercase, drop punctuation and collapse whitespace for matching."""
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def _bare(text: str) -> str:
    """Normalise then strip formulation words and numeric strengths."""
    words = _normalise(text).split()
    kept = [w for w in words if w not in _FORMULATION_NOISE and not w.isdigit() and "%" not in w]
    return " ".join(kept).strip()


@lru_cache(maxsize=1)
def _load_dataset() -> dict:
    with DATA_FILE.open(encoding="utf-8") as fh:
        raw = json.load(fh)

    # Build a lookup: normalised alias/bare-alias -> (status, reason).
    index: dict[str, tuple[str, str]] = {}
    for status in ("banned", "restricted"):
        for entry in raw.get(status, []):
            reason = entry["reason"]
            names = [entry["name"], *entry.get("aliases", [])]
            for name in names:
                for key in {_normalise(name), _bare(name)}:
                    if key:
                        index[key] = (status, reason)
    return index


def check_pesticide(pesticide: str) -> dict:
    """Return { status, reason } for a pesticide name.

    status is one of "approved" | "banned" | "restricted".
    """
    index = _load_dataset()
    query_full = _normalise(pesticide)
    query_bare = _bare(pesticide)

    # 1. Exact match on the full normalised name, then on the bare name.
    for key in (query_full, query_bare):
        if key and key in index:
            status, reason = index[key]
            return {"status": status, "reason": reason}

    # 2. Fuzzy containment: a dataset key fully inside the query, or vice versa.
    #    Longer keys win so "chlorpyrifos" beats a stray short token.
    candidates = []
    for key, (status, reason) in index.items():
        if key and (key in query_bare or query_bare in key):
            candidates.append((len(key), status, reason))
    if candidates:
        _, status, reason = max(candidates, key=lambda c: c[0])
        return {"status": status, "reason": reason}

    # 3. Not on the banned/restricted list -> treat as approved, with a caveat.
    return {
        "status": "approved",
        "reason": (
            f"'{pesticide.strip()}' is not on the banned or restricted list. "
            "Always follow the product label, recommended dosage, and the "
            "pre-harvest interval, and wear protective gear."
        ),
    }

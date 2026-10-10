"""FastAPI entry point for the farm assistant backend.

Runs on port 8000 so the Vite frontend (VITE_API_BASE_URL=http://localhost:8000)
can reach it during development.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.advisories import router as advisories_router
from routes.climate import router as climate_router
from routes.harvest import router as harvest_router
from routes.irrigation import router as irrigation_router
from routes.pesticide import router as pesticide_router
from routes.seeds import router as seeds_router
from routes.weather import router as weather_router

app = FastAPI(title="Farm Assistant API", version="0.1.0")

# Allow the Vite dev server to call the API during development.
# allow_credentials stays False because "*" origins are incompatible with it.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


# Register routes (all prefixed with /api).
app.include_router(weather_router, prefix="/api/weather", tags=["weather"])
app.include_router(climate_router, prefix="/api/climate", tags=["climate"])
app.include_router(pesticide_router, prefix="/api/pesticide", tags=["pesticide"])
app.include_router(seeds_router, prefix="/api/seeds", tags=["seeds"])
app.include_router(irrigation_router, prefix="/api/irrigation", tags=["irrigation"])
app.include_router(harvest_router, prefix="/api/harvest", tags=["harvest"])
app.include_router(advisories_router, prefix="/api/advisories", tags=["advisories"])


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
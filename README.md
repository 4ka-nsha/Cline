# Krishi Sahyog: Empowering Indian Farmers

An integrated agricultural dashboard designed to streamline the entire farming lifecycle—from seed selection to harvest and market pricing. Built for Indian farmers, this platform consolidates fragmented data into a single, actionable interface.

## The Problem

Indian farmers navigate a complex web of decisions across the entire crop lifecycle. Currently, they must consult multiple, disconnected sources for weather, market prices, pesticide regulations, and government schemes. This fragmentation leads to suboptimal decisions, financial losses, and missed opportunities.

## Our Solution

A unified dashboard that consolidates hyperlocal weather, historical climate trends, crop-specific advice, and pesticide safety into one place. The platform uses real-time APIs and historical datasets to provide actionable, location-specific advisories.

## Key Features

- ** Hyperlocal Weather:** 7-day forecast powered by Open-Meteo.
- ** Climate Intelligence:** 5-year historical rainfall and temperature trends using real ERA5 reanalysis data.
- ** Smart Seed Recommendations:** ICAR-recommended crop varieties filtered by state and season.
- ** Pesticide Safety Check:** Cross-references inputs against the CIBRC banned/restricted list, with smart matching for trade names (e.g., identifying "Lorsban" as Chlorpyrifos) and formulation tags (e.g., "20 EC").
- ** Irrigation Advisory:** Rule-based engine combining current weather forecasts with crop growth stages.
- ** Harvest Timing:** Calculates optimal harvest windows using crop maturity days and upcoming rainfall forecasts.
- ** Today's Advisories:** Synthesized, actionable alerts (e.g., "Delay spraying due to rain," "Irrigate early due to heat stress").

##  Tech Stack

**Backend:**
- Python 3
- FastAPI & Uvicorn
- HTTPX (Async API calls)

**Frontend:**
- React (Vite)
- Tailwind CSS
- Recharts (Data visualization)
- Leaflet (Mapping)

**Data Sources:**
- **Weather & Climate:** [Open-Meteo API](https://open-meteo.com/) (ERA5 Archive)
- **Seeds:** ICAR Landmark Varieties
- **Pesticides:** CIBRC (Central Insecticides Board and Registration Committee)
- **Market Data:** AGMARKNET (handled by frontend partner)

**AI Integration:**
- **Cline AI:** Used for autonomous scaffolding, API integration, bug fixing, and test generation across the entire backend.

## Project Structure

```text
├── backend/
│   ├── main.py                 # FastAPI entry point, CORS, route registration
│   ├── requirements.txt        # Python dependencies
│   ├── data/                   # Hardcoded static data (seeds, pesticides)
│   ├── routes/                 # API endpoint definitions
│   └── services/               # Business logic and external API calls
├── frontend/
│   ├── src/
│   │   ├── api/                # API client config (baseURL: localhost:8000)
│   │   ├── components/         # React components for each module
│   │   └── pages/              # Dashboard views
│   └── package.json
└── .clinerules/                # AI context rules for Cline
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+

### Backend Setup

```bash
cd backend
python -m venv .venv
# Windows:
.\.venv\Scripts\Activate.ps1
# Mac/Linux:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

The backend will be available at `http://localhost:8000`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## API Reference

| Endpoint | Method | Description | Sample Params |
| :--- | :--- | :--- | :--- |
| `/api/health` | GET | Health check | - |
| `/api/weather` | GET | 7-day forecast | `?lat=10.78&lon=79.13` |
| `/api/climate` | GET | 5-year historical trends | `?lat=10.78&lon=79.13&years=5` |
| `/api/seeds` | GET | Recommended seed varieties | `?crop=rice&state=Tamil Nadu` |
| `/api/pesticide/check` | POST | Check pesticide safety | `{"pesticide": "Lorsban"}` |
| `/api/irrigation` | GET | Irrigation recommendation | `?crop=rice&stage=flowering&lat=10.78&lon=79.13` |
| `/api/harvest` | GET | Optimal harvest window | `?crop=rice&sowingDate=2025-06-15&lat=10.78&lon=79.13` |
| `/api/advisories` | GET | Synthesized daily advisories | `?lat=10.78&lon=79.13&crop=rice&stage=flowering` |

## Disclaimers

- **Pesticide Dataset:** The CIBRC banned/restricted pesticide list included in this repository is a **representative sample** for demonstration purposes. It is not exhaustive. Always verify against the official CIBRC list and follow label instructions.
- **Climate Data:** Historical climate trends are calculated using the Open-Meteo ERA5 Archive API. The current incomplete year is excluded from trend calculations to prevent misleading visual dips.

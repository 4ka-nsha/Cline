# Farm Assistant — Frontend

React + Vite + TypeScript + Tailwind CSS frontend for the Farm Assistant app.

## Stack

- **React 18** + **Vite 5** + **TypeScript**
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide** icons
- **Recharts** for charts

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite (default: http://localhost:5173).

## Project structure

```
src/
  components/   Reusable UI (Layout, cards, state views)
  pages/        Route-level screens (Dashboard, Crops, Weather, …)
  services/     Typed data-access layer (mock / live switching)
  mocks/        Sample data used in "mock" mode
  types/        Shared TypeScript interfaces
  context/      React context (FarmProfile)
  utils/        Helpers (formatting, useAsync hook)
```

## Data modes: mock vs live

The app uses an explicit data mode controlled by `VITE_DATA_MODE`:

- `mock` (default): services return sample data from `src/mocks/`.
- `live`: services call the backend at `VITE_API_BASE_URL`.

Copy `.env.example` to `.env` and adjust as needed.

**Important rules (see `.clinerules/frontend.md`):**
- Failed live requests are surfaced to the UI — they are never silently
  replaced with mock data.
- No API secrets in frontend code or `VITE_` variables (they are public).

## Scope (MVP)

Farm profile/onboarding, dashboard advisories, crop & seed recommendations,
weather, market prices & MSP comparison, pesticide/input info, and an expense
tracker. No chatbot, auth, or maps in this MVP.

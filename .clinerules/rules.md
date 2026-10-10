# KrishiFlow project rules

## Scope
- Single-user local demo. No authentication. Do not deploy publicly with real farmer records without access control.
- Build only what is asked. Do not add unrequested features.
- Currently implemented: **farm setup input + persistence only.**
- Not yet implemented (do not stub or fake them): weather dashboard, activity calendar, mandi comparison, MCP server.

## Explicitly excluded (never add)
- Expense tracker
- General chatbox / chatbot UI
- Embedded LLM
- Price prediction or profit forecasting
- Pesticide dosage recommendations
- Seed / crop recommendations
- Payments or government form submission

## Secrets
- Never hardcode secrets. Provide `.env.example` and keep `.env` gitignored.
- API keys are read from `process.env` only.

## Data honesty
- Preserve source URLs, units, and observation timestamps on every data response.
- Label synthetic/demo data clearly and visibly in the UI.
- Never silently substitute demo data for live data. Surface the failure and let the user opt in.
- Do not describe forecast or price values as field measurements or guaranteed sale offers.

## Architecture
- React + TypeScript + Vite + Tailwind CSS on the frontend.
- Node.js + TypeScript + Express on the backend.
- SQLite via Node's built-in `node:sqlite` (no native modules, no build toolchain).
- Share service functions between REST endpoints and MCP tools. Routes and MCP tools must be thin wrappers over the same service module.
- Share type contracts via `shared/contracts/`.

## Farmer input schema (agreed)
- state (select, required)
- district (select, dependent on state, required)
- soil type (select, optional)
- land size + land size unit (number + select, required)
- sowing date (date, required)
- crop preference / type of crop (select, optional)
- crop type (select, required) - drives market commodity later
- crop history (list of past crops, optional, for future reference)
- current income (number, optional) - stored as reference data only; no optimizer
- growth stage (select, optional, farmer-reported)
- farm name, latitude, longitude (optional; coordinates needed by the weather module later)

## UI requirements
- Farmers interact through dropdowns, forms, and action buttons. No chat input.
- Must be usable on a phone: single-column layout under `sm:`, no horizontal overflow.
- Validate on the server; show server field errors inline next to the relevant input.

## Testing / verification
- Any new code must be run and verified before calling it done.
- Persistence must survive a backend restart.
- Keep `.env.example` in sync with any new env var.

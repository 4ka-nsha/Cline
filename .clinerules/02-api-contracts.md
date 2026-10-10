# API Contracts — DO NOT BREAK
These endpoints are consumed by the frontend. Response shapes must match exactly.

## GET /api/weather?lat={lat}&lon={lon}
Response: { forecast: [{ date, tempMax, tempMin, rainfall, description }] }

## GET /api/climate?lat={lat}&lon={lon}&years={n}
Response: { rainfallTrend: [{ year, rainfall }], tempTrend: [{ year, tempMax, tempMin }] }

## GET /api/seeds?crop={crop}&state={state}
Response: { varieties: [{ name, maturityDays, yield, resistance }] }

## POST /api/pesticide/check
Body: { pesticide: string }
Response: { status: "approved" | "banned" | "restricted", reason: string }

## GET /api/irrigation?crop={crop}&stage={stage}&lat={lat}&lon={lon}
Response: { nextIrrigation: string, reason: string, waterNeeded: string }

## GET /api/harvest?crop={crop}&sowingDate={date}&lat={lat}&lon={lon}
Response: { optimalWindow: { start, end }, reason: string }
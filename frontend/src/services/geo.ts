/**
 * Client-side location → coordinates lookup.
 *
 * The backend weather/climate/irrigation/harvest endpoints require numeric
 * lat/lon, but the farm profile only stores a free-text `location`.
 * This table resolves known Tamil Nadu / Indian district names to coordinates
 * so the service layer can keep its existing (location, signal) signatures
 * and no React component needs to change.
 *
 * Unknown locations fall back to the Thanjavur demo coordinates.
 */
const KNOWN_LOCATIONS: Record<string, { lat: number; lon: number }> = {
  thanjavur: { lat: 10.78, lon: 79.13 },
  chennai: { lat: 13.08, lon: 80.27 },
  coimbatore: { lat: 11.02, lon: 76.96 },
  madurai: { lat: 9.93, lon: 78.12 },
  salem: { lat: 11.65, lon: 78.16 },
  trichy: { lat: 10.79, lon: 78.7 },
  tiruchirappalli: { lat: 10.79, lon: 78.7 },
  erode: { lat: 11.34, lon: 77.72 },
  vellore: { lat: 12.92, lon: 79.13 },
  villupuram: { lat: 11.94, lon: 79.49 },
  cuddalore: { lat: 11.75, lon: 79.76 },
  nagapattinam: { lat: 10.77, lon: 79.83 },
  kanchipuram: { lat: 12.84, lon: 79.7 },
  ludhiana: { lat: 30.9, lon: 75.85 },
  delhi: { lat: 28.61, lon: 77.2 },
}

export const DEFAULT_COORDS = { lat: 10.78, lon: 79.13 }

export function resolveCoords(location: string): { lat: number; lon: number } {
  const key = location.trim().toLowerCase()
  return KNOWN_LOCATIONS[key] ?? DEFAULT_COORDS
}

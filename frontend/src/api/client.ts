/**
 * Minimal typed API client for the Farm Assistant FastAPI backend.
 *
 * Base URL resolves from VITE_API_BASE_URL (see frontend/.env.example),
 * defaulting to the local FastAPI dev server.
 *
 * Usage:
 *   import { apiGet, apiPost } from './client'
 *   const data = await apiGet<WeatherResponse>('/api/weather?lat=10.78&lon=79.13')
 *
 * NOTE: No secrets here — VITE_* values are inlined into the public bundle.
 * Live-request failures propagate to the caller (never silently fall back
 * to mock data).
 */

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

async function handle<T>(res: Response, path: string): Promise<T> {
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with status ${res.status}`)
  }
  return (await res.json()) as T
}

/** Typed GET against the backend. */
export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  })
  return handle<T>(res, path)
}

/** Typed POST with a JSON body against the backend. */
export async function apiPost<T>(
  path: string,
  body: unknown,
  signal?: AbortSignal,
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  })
  return handle<T>(res, path)
}

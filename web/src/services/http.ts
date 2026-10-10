import { API_BASE_URL } from './config'

/**
 * A tiny typed fetch wrapper used by the service layer in "live" mode.
 *
 * IMPORTANT: Functions here intentionally do NOT catch errors and return mock
 * data. A failed live request must propagate to the caller so the UI can
 * surface a clear error (see .clinerules/frontend.md — never silently replace
 * failed live requests with mock data).
 */
export async function httpGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const url = `${API_BASE_URL}${path}`
  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!res.ok) {
    throw new Error(`Request to ${path} failed with status ${res.status}`)
  }

  return (await res.json()) as T
}

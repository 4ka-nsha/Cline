import type { FarmProfile, SoilType } from '../types'
import type {
  FarmOptionsResponse,
  FarmProfile as BackendFarm,
  FarmResponse,
} from '../../../shared/contracts/farm'
import { DATA_MODE, API_BASE_URL } from './config'

/**
 * Farm profile service — the ONLY service that talks to the real
 * KrishiFlow backend (`/api/farm`, SQLite-backed).
 */

const FALLBACK_OPTIONS: FarmOptionsResponse = {
  states: ['Maharashtra'],
  districtsByState: { Maharashtra: ['Nashik'] },
  soilTypes: ['Black (Regur)'],
  cropPreferences: ['Kharif (kharif season)'],
  cropTypes: ['Wheat'],
  growthStages: ['Not sown yet'],
  landSizeUnits: [{ value: 'acre', label: 'Acres' }],
  meta: { requestId: 'local', servedAt: new Date().toISOString(), source: 'user-input' },
}

let cachedOptions: FarmOptionsResponse | null = null

export async function getFarmOptions(signal?: AbortSignal): Promise<FarmOptionsResponse> {
  if (DATA_MODE !== 'live') return FALLBACK_OPTIONS
  try {
    const res = await fetch(`${API_BASE_URL}/api/farm/setup/options`, { signal })
    if (!res.ok) throw new Error(`Request to /api/farm/setup/options failed (${res.status})`)
    const body = (await res.json()) as FarmOptionsResponse
    cachedOptions = body
    return body
  } catch (err) {
    if (cachedOptions) return cachedOptions
    throw err instanceof Error ? err : new Error('Could not load farm options.')
  }
}

const UI_TO_BACKEND_SOIL: Record<SoilType, string> = {
  loamy: 'Loamy',
  clay: 'Clayey',
  sandy: 'Sandy',
  silt: 'Alluvial',
  black: 'Black (Regur)',
  red: 'Red',
  laterite: 'Laterite',
}
/** Load the saved farm. In mock mode returns null (local-only profile). */
export async function getFarm(signal?: AbortSignal): Promise<FarmProfile | null> {
  if (DATA_MODE !== 'live') return null
  const res = await fetch(`${API_BASE_URL}/api/farm`, { signal })
  if (!res.ok) throw new Error(`Request to /api/farm failed (${res.status})`)
  const body = (await res.json()) as FarmResponse
  return body.farm ? toUiProfile(body.farm) : null
}

/** Save the farm profile (POST first, PATCH on 409 conflict). */
export async function saveFarm(profile: FarmProfile, signal?: AbortSignal): Promise<FarmProfile> {
  if (DATA_MODE !== 'live') return { ...profile, onboarded: true }
  const options = await getFarmOptions(signal)
  const payload = toBackendInput(profile, options)
  const post = await fetch(`${API_BASE_URL}/api/farm`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  })
  if (post.ok) {
    const body = (await post.json()) as FarmResponse
    if (!body.farm) throw new Error('Backend did not return the saved farm.')
    return toUiProfile(body.farm)
  }
  if (post.status === 409) {
    const patch = await fetch(`${API_BASE_URL}/api/farm`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    })
    if (!patch.ok) throw new Error(`Saving the farm failed (${patch.status}).`)
    const body = (await patch.json()) as FarmResponse
    if (!body.farm) throw new Error('Backend did not return the saved farm.')
    return toUiProfile(body.farm)
  }
  let detail = ''
  try {
    const errBody = (await post.json()) as { error?: { message?: string } }
    if (errBody.error?.message) detail = ` ${errBody.error.message}`
  } catch { /* ignore */ }
  throw new Error(`Saving the farm failed (${post.status}).${detail}`)
}


function backendSoilToUi(label: string | null): SoilType {
  if (!label) return 'loamy'
  const lower = label.toLowerCase()
  const found = (Object.entries(UI_TO_BACKEND_SOIL) as [SoilType, string][]).find(
    ([, backend]) => backend.toLowerCase() === lower,
  )
  if (found) return found[0]
  if (lower.includes('black')) return 'black'
  if (lower.includes('red')) return 'red'
  if (lower.includes('later')) return 'laterite'
  if (lower.includes('sand')) return 'sandy'
  if (lower.includes('clay')) return 'clay'
  return 'loamy'
}

function splitLocation(location: string, options: FarmOptionsResponse): { district: string; state: string } {
  const parts = location.split(',').map((p) => p.trim()).filter(Boolean)
  const states = options.states.length > 0 ? options.states : ['Maharashtra']
  if (parts.length >= 2) {
    const maybeState = parts[parts.length - 1] ?? ''
    const state = states.find((s) => s.toLowerCase() === maybeState.toLowerCase()) ?? states[0] ?? 'Maharashtra'
    const district = parts.slice(0, -1).join(', ')
    return { district, state }
  }
  const district = parts[0] ?? ''
  const state =
    Object.entries(options.districtsByState).find(([, ds]) =>
      ds.some((d) => d.toLowerCase() === district.toLowerCase()),
    )?.[0] ?? states[0] ?? 'Maharashtra'
  return { district, state }
}

function toBackendInput(profile: FarmProfile, options: FarmOptionsResponse) {
  const split = splitLocation(profile.location || 'Nashik, Maharashtra', options)
  const fallbackDistrict = options.districtsByState[split.state]?.[0] ?? 'Nashik'
  const seasonLabel =
    options.cropPreferences.find((c) => c.toLowerCase().startsWith(profile.season.toLowerCase())) ??
    options.cropPreferences[0] ??
    'Kharif (kharif season)'
  return {
    farmName: profile.farmerName || null,
    state: split.state,
    district: split.district || fallbackDistrict,
    soilType: UI_TO_BACKEND_SOIL[profile.soilType] ?? 'Loamy',
    landSize: profile.farmSizeAcres,
    landSizeUnit: 'acre' as const,
    sowingDate: new Date().toISOString().slice(0, 10),
    cropPreference: seasonLabel,
    cropType: profile.preferredCrops[0] ?? options.cropTypes[0] ?? 'Wheat',
    cropHistory: profile.preferredCrops,
    currentIncome: null,
    currentIncomeCurrency: 'INR' as const,
    growthStage: options.growthStages[0] ?? null,
    latitude: null,
    longitude: null,
  }
}

function toUiProfile(backend: BackendFarm): FarmProfile {
  const season = backend.cropPreference?.split(' ')[0] ?? 'Kharif'
  return {
    farmerName: backend.farmName ?? '',
    location: `${backend.district}, ${backend.state}`,
    farmSizeAcres: backend.landSize,
    soilType: backendSoilToUi(backend.soilType),
    irrigation: 'rainfed',
    season,
    preferredCrops: backend.cropHistory.length > 0 ? backend.cropHistory : [backend.cropType],
    onboarded: true,
  }
}

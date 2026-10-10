import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { FarmProfile } from '../types'
import { getFarm, saveFarm } from '../services/farmService'

const EMPTY_PROFILE: FarmProfile = {
  farmerName: '',
  location: '',
  farmSizeAcres: 0,
  soilType: 'loamy',
  irrigation: 'rainfed',
  season: 'Kharif',
  preferredCrops: [],
  onboarded: false,
}

interface FarmContextValue {
  profile: FarmProfile
  loading: boolean
  error: string | null
  updateProfile: (patch: Partial<FarmProfile>) => void
  completeOnboarding: () => Promise<void>
  saveError: string | null
  resetProfile: () => void
}

const FarmContext = createContext<FarmContextValue | undefined>(undefined)

/**
 * Farm profile backed by the real KrishiFlow backend (SQLite).
 * In "mock" mode the profile stays local-only; in "live" mode it is
 * loaded from GET /api/farm and saved via POST/PATCH /api/farm.
 */
export function FarmProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<FarmProfile>(EMPTY_PROFILE)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    const controller = new AbortController()
    getFarm(controller.signal)
      .then((saved) => {
        if (!active) return
        if (saved) setProfile(saved)
        setError(null)
      })
      .catch((err: unknown) => {
        if (!active) return
        // No saved farm yet / backend unreachable in mock mode is fine.
        if (err instanceof Error && err.message !== 'NO_SAVED_FARM') {
          setError(err.message)
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
      controller.abort()
    }
  }, [])

  const updateProfile = (patch: Partial<FarmProfile>) =>
    setProfile((prev) => ({ ...prev, ...patch }))

  const completeOnboarding = async () => {
    setSaveError(null)
    const next: FarmProfile = { ...profile, onboarded: true }
    try {
      const saved = await saveFarm(next)
      setProfile(saved)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not save the farm profile.'
      setSaveError(message)
      // Keep local state consistent even when the backend save fails.
      setProfile(next)
      throw new Error(message)
    }
  }

  const resetProfile = () => setProfile(EMPTY_PROFILE)

  return (
    <FarmContext.Provider
      value={{ profile, loading, error, updateProfile, completeOnboarding, saveError, resetProfile }}
    >
      {children}
    </FarmContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFarm(): FarmContextValue {
  const ctx = useContext(FarmContext)
  if (!ctx) throw new Error('useFarm must be used within a FarmProvider')
  return ctx
}

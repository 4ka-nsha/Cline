import { createContext, useContext, useState, type ReactNode } from 'react'
import type { FarmProfile } from '../types'

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
  updateProfile: (patch: Partial<FarmProfile>) => void
  completeOnboarding: () => void
  resetProfile: () => void
}

const FarmContext = createContext<FarmContextValue | undefined>(undefined)

export function FarmProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<FarmProfile>(EMPTY_PROFILE)

  const updateProfile = (patch: Partial<FarmProfile>) =>
    setProfile((prev) => ({ ...prev, ...patch }))

  const completeOnboarding = () => setProfile((prev) => ({ ...prev, onboarded: true }))

  const resetProfile = () => setProfile(EMPTY_PROFILE)

  return (
    <FarmContext.Provider
      value={{ profile, updateProfile, completeOnboarding, resetProfile }}
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

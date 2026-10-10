import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFarm } from '../context/FarmContext'
import { getFarmOptions } from '../services/farmService'
import type { FarmOptionsResponse } from '../../../shared/contracts/farm'
import type { SoilType, IrrigationType } from '../types'
import PageHeader from '../components/PageHeader'
import DataModeBadge from '../components/DataModeBadge'
import { ErrorState, LoadingState } from '../components/StateViews'

const UI_SOILS: { value: SoilType; label: string }[] = [
  { value: 'loamy', label: 'Loamy' },
  { value: 'clay', label: 'Clayey' },
  { value: 'sandy', label: 'Sandy' },
  { value: 'silt', label: 'Alluvial' },
  { value: 'black', label: 'Black (Regur)' },
  { value: 'red', label: 'Red' },
  { value: 'laterite', label: 'Laterite' },
]
const IRRIGATION: IrrigationType[] = ['rainfed', 'canal', 'drip', 'sprinkler', 'borewell']
const SEASONS = ['Kharif', 'Rabi', 'Zaid', 'Year-round']

export default function Onboarding() {
  const { profile, updateProfile, completeOnboarding, saveError } = useFarm()
  const navigate = useNavigate()
  const [cropDraft, setCropDraft] = useState('')
  const [options, setOptions] = useState<FarmOptionsResponse | null>(null)
  const [optionsError, setOptionsError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    const controller = new AbortController()
    getFarmOptions(controller.signal)
      .then((o) => {
        if (active) setOptions(o)
      })
      .catch((err: unknown) => {
        if (active) setOptionsError(err instanceof Error ? err.message : 'Could not load options.')
      })
    return () => {
      active = false
      controller.abort()
    }
  }, [])

  const crops = options?.cropTypes ?? ['Wheat', 'Rice', 'Mustard']

  const toggleCrop = (crop: string) => {
    const has = profile.preferredCrops.includes(crop)
    updateProfile({
      preferredCrops: has
        ? profile.preferredCrops.filter((c) => c !== crop)
        : [...profile.preferredCrops, crop],
    })
  }

  const addCustomCrop = () => {
    const value = cropDraft.trim()
    if (value && !profile.preferredCrops.includes(value)) {
      updateProfile({ preferredCrops: [...profile.preferredCrops, value] })
      setCropDraft('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await completeOnboarding()
      navigate('/')
    } catch {
      /* saveError from context shows inline */
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Farm Profile"
        subtitle="Tell us about your farm. In live mode this is saved to the KrishiFlow backend."
      >
        <DataModeBadge />
      </PageHeader>

      {!options && !optionsError && <LoadingState label="Loading farm options…" />}
      {optionsError && <ErrorState message={optionsError} />}

      <form onSubmit={handleSubmit} className="card max-w-2xl space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="farmerName">Farmer name</label>
            <input
              id="farmerName"
              className="input"
              value={profile.farmerName}
              onChange={(e) => updateProfile({ farmerName: e.target.value })}
              placeholder="e.g. Ramesh Kumar"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="location">Location (district, state)</label>
            <input
              id="location"
              className="input"
              value={profile.location}
              onChange={(e) => updateProfile({ location: e.target.value })}
              placeholder="e.g. Nashik, Maharashtra"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="farmSize">Farm size (acres)</label>
            <input
              id="farmSize"
              type="number"
              min={0}
              step="0.5"
              className="input"
              value={profile.farmSizeAcres || ''}
              onChange={(e) => updateProfile({ farmSizeAcres: Number(e.target.value) })}
              placeholder="e.g. 5"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="season">Season</label>
            <select
              id="season"
              className="input"
              value={profile.season}
              onChange={(e) => updateProfile({ season: e.target.value })}
            >
              {SEASONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="soilType">Soil type</label>
            <select
              id="soilType"
              className="input"
              value={profile.soilType}
              onChange={(e) => updateProfile({ soilType: e.target.value as SoilType })}
            >
              {UI_SOILS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="irrigation">Irrigation</label>
            <select
              id="irrigation"
              className="input"
              value={profile.irrigation}
              onChange={(e) => updateProfile({ irrigation: e.target.value as IrrigationType })}
            >
              {IRRIGATION.map((i) => (
                <option key={i} value={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <span className="label">Preferred crops</span>
          <div className="mt-1 flex flex-wrap gap-2">
            {crops.map((crop) => {
              const active = profile.preferredCrops.includes(crop)
              return (
                <button
                  type="button"
                  key={crop}
                  onClick={() => toggleCrop(crop)}
                  className={`rounded-full border px-3 py-1 text-sm transition ${
                    active
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {crop}
                </button>
              )
            })}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              className="input"
              value={cropDraft}
              onChange={(e) => setCropDraft(e.target.value)}
              placeholder="Add another crop…"
            />
            <button type="button" className="btn-ghost" onClick={addCustomCrop}>
              Add
            </button>
          </div>
        </div>

        {saveError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            Could not save to the backend: {saveError}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save & continue'}
          </button>
        </div>
      </form>
    </div>
  )
}

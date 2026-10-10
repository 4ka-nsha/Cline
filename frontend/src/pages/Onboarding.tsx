import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFarm } from '../context/FarmContext'
import type { SoilType, IrrigationType } from '../types'
import PageHeader from '../components/PageHeader'

const SOIL_TYPES: SoilType[] = ['loamy', 'clay', 'sandy', 'silt', 'black', 'red', 'laterite']
const IRRIGATION: IrrigationType[] = ['rainfed', 'canal', 'drip', 'sprinkler', 'borewell']
const SEASONS = ['Kharif', 'Rabi', 'Zaid', 'Year-round']
const CROP_OPTIONS = ['Wheat', 'Rice', 'Mustard', 'Chickpea', 'Potato', 'Onion', 'Cotton', 'Sugarcane']

export default function Onboarding() {
  const { profile, updateProfile, completeOnboarding } = useFarm()
  const navigate = useNavigate()
  const [cropDraft, setCropDraft] = useState('')

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    completeOnboarding()
    navigate('/')
  }

  return (
    <div>
      <PageHeader
        title="Farm Profile"
        subtitle="Tell us about your farm so we can personalize your advice."
      />

      <form onSubmit={handleSubmit} className="card max-w-2xl space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="farmerName">
              Farmer name
            </label>
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
            <label className="label" htmlFor="location">
              Location / village
            </label>
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
            <label className="label" htmlFor="farmSize">
              Farm size (acres)
            </label>
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
            <label className="label" htmlFor="season">
              Season
            </label>
            <select
              id="season"
              className="input"
              value={profile.season}
              onChange={(e) => updateProfile({ season: e.target.value })}
            >
              {SEASONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="soilType">
              Soil type
            </label>
            <select
              id="soilType"
              className="input"
              value={profile.soilType}
              onChange={(e) => updateProfile({ soilType: e.target.value as SoilType })}
            >
              {SOIL_TYPES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="irrigation">
              Irrigation
            </label>
            <select
              id="irrigation"
              className="input"
              value={profile.irrigation}
              onChange={(e) => updateProfile({ irrigation: e.target.value as IrrigationType })}
            >
              {IRRIGATION.map((i) => (
                <option key={i} value={i}>
                  {i.charAt(0).toUpperCase() + i.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <span className="label">Preferred crops</span>
          <div className="mt-1 flex flex-wrap gap-2">
            {CROP_OPTIONS.map((crop) => {
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

        <div className="flex justify-end gap-2 pt-2">
          <button type="submit" className="btn-primary">
            Save &amp; continue
          </button>
        </div>
      </form>
    </div>
  )
}


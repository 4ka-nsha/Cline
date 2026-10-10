import { getCropRecommendations } from '../services'
import { useAsync } from '../utils/useAsync'
import PageHeader from '../components/PageHeader'
import DataModeBadge from '../components/DataModeBadge'
import { ErrorState, LoadingState } from '../components/StateViews'

export default function Crops() {
  const { data, loading, error } = useAsync((s) => getCropRecommendations(s), [])

  return (
    <div>
      <PageHeader
        title="Crop & Seed Recommendations"
        subtitle="Crops suited to your soil, season, and irrigation."
      >
        <DataModeBadge />
      </PageHeader>

      {loading && <LoadingState label="Loading recommendations…" />}
      {error && <ErrorState message={error} />}
      {data && (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((crop) => (
            <div key={crop.id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{crop.name}</h3>
                  <p className="text-sm text-gray-500">{crop.expectedYield}</p>
                </div>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                  {crop.suitability}% fit
                </span>
              </div>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{ width: `${crop.suitability}%` }}
                />
              </div>

              <p className="mt-3 text-sm text-gray-600">{crop.reason}</p>

              <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-3 text-sm">
                <div>
                  <dt className="text-xs text-gray-400">Seed variety</dt>
                  <dd className="font-medium text-gray-700">{crop.seedVariety}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">Seed rate</dt>
                  <dd className="font-medium text-gray-700">{crop.seedRate}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">Duration</dt>
                  <dd className="font-medium text-gray-700">{crop.durationDays} days</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

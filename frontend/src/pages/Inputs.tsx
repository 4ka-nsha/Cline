import { useState } from 'react'
import { getInputs } from '../services'
import { useAsync } from '../utils/useAsync'
import { formatINR } from '../utils/format'
import type { InputCategory } from '../types'
import PageHeader from '../components/PageHeader'
import DataModeBadge from '../components/DataModeBadge'
import { EmptyState, ErrorState, LoadingState } from '../components/StateViews'

const CATEGORIES: (InputCategory | 'all')[] = [
  'all',
  'pesticide',
  'fungicide',
  'herbicide',
  'fertilizer',
]

export default function Inputs() {
  const { data, loading, error } = useAsync((s) => getInputs(s), [])
  const [filter, setFilter] = useState<InputCategory | 'all'>('all')

  const filtered =
    data?.filter((i) => filter === 'all' || i.category === filter) ?? []

  return (
    <div>
      <PageHeader
        title="Inputs & Pesticides"
        subtitle="Pesticides, fungicides, herbicides, and fertilizers with safe usage."
      >
        <DataModeBadge />
      </PageHeader>

      <div className="mb-4 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-3 py-1 text-sm capitalize transition ${
              filter === c
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading && <LoadingState label="Loading inputs…" />}
      {error && <ErrorState message={error} />}
      {data && filtered.length === 0 && (
        <EmptyState title="No products in this category" />
      )}
      {data && filtered.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((product) => (
            <div key={product.id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <span className="mt-1 inline-block rounded-full bg-soil-100 px-2 py-0.5 text-xs font-medium capitalize text-soil-700">
                    {product.category}
                  </span>
                </div>
                <p className="text-right text-sm font-semibold text-gray-800">
                  {formatINR(product.pricePerUnit)}
                  <span className="text-xs font-normal text-gray-400">
                    /{product.unit}
                  </span>
                </p>
              </div>

              <dl className="mt-3 space-y-2 text-sm">
                <div>
                  <dt className="inline text-gray-400">Targets: </dt>
                  <dd className="inline text-gray-700">{product.targetPest}</dd>
                </div>
                <div>
                  <dt className="inline text-gray-400">Crops: </dt>
                  <dd className="inline text-gray-700">
                    {product.targetCrops.join(', ')}
                  </dd>
                </div>
                <div>
                  <dt className="inline text-gray-400">Dosage: </dt>
                  <dd className="inline text-gray-700">{product.dosage}</dd>
                </div>
                <div>
                  <dt className="inline text-gray-400">Pre-harvest interval: </dt>
                  <dd className="inline text-gray-700">{product.phiDays} days</dd>
                </div>
              </dl>

              {product.safetyNotes.length > 0 && (
                <div className="mt-3 rounded-lg bg-red-50 p-3">
                  <p className="mb-1 text-xs font-semibold text-red-700">Safety</p>
                  <ul className="list-inside list-disc space-y-0.5 text-xs text-red-600">
                    {product.safetyNotes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { checkPesticide, getInputs } from '../services'
import type { PesticideCheckResult } from '../services'
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

  // Live CIBRC safety check: POST /api/pesticide/check { pesticide }.
  const [query, setQuery] = useState('')
  const [checkResult, setCheckResult] = useState<PesticideCheckResult | null>(null)
  const [checking, setChecking] = useState(false)
  const [checkError, setCheckError] = useState<string | null>(null)

  const runCheck = async () => {
    if (!query.trim()) return
    setChecking(true)
    setCheckError(null)
    setCheckResult(null)
    try {
      setCheckResult(await checkPesticide(query.trim()))
    } catch (err) {
      setCheckError(err instanceof Error ? err.message : 'Safety check failed.')
    } finally {
      setChecking(false)
    }
  }

  const statusStyle =
    checkResult?.status === 'banned'
      ? 'bg-red-100 text-red-700'
      : checkResult?.status === 'restricted'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-green-100 text-green-700'

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

      <div className="card mb-4">
        <h3 className="text-base font-semibold text-gray-800">
          Pesticide safety check
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Check a pesticide name against the CIBRC banned/restricted list.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') runCheck()
            }}
            placeholder="e.g. Endosulfan"
            className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm"
          />
          <button
            onClick={runCheck}
            disabled={checking || !query.trim()}
            className="rounded-lg bg-brand-600 px-4 py-1.5 text-sm font-semibold text-white transition disabled:opacity-50"
          >
            {checking ? 'Checking…' : 'Check'}
          </button>
        </div>
        {checkError && <ErrorState message={checkError} />}
        {checkResult && (
          <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm">
            <span
              className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyle}`}
            >
              {checkResult.status}
            </span>
            <p className="mt-2 text-gray-700">{checkResult.reason}</p>
          </div>
        )}
      </div>

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

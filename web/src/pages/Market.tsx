import { getMarketPrices } from '../services/marketService'
import { useAsync } from '../utils/useAsync'
import { formatINR, mspDeltaPercent } from '../utils/format'
import PageHeader from '../components/PageHeader'
import DataModeBadge from '../components/DataModeBadge'
import { ErrorState, LoadingState } from '../components/StateViews'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export default function Market() {
  const { data, loading, error } = useAsync((s) => getMarketPrices(s), [])

  const chartData =
    data?.map((m) => ({
      name: m.commodity,
      Market: m.pricePerQuintal,
      MSP: m.mspPerQuintal ?? 0,
    })) ?? []

  return (
    <div>
      <PageHeader
        title="Market Prices & MSP"
        subtitle="Compare current mandi prices with the Minimum Support Price."
      >
        <DataModeBadge />
      </PageHeader>

      {loading && <LoadingState label="Loading market prices…" />}
      {error && <ErrorState message={error} />}
      {data && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Price vs MSP (₹/quintal)
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip formatter={(v: number) => formatINR(v)} />
                  <Legend />
                  <Bar dataKey="Market" fill="#37a861" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="MSP" fill="#cbb08a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-400">
                  <th className="py-2 pr-4">Commodity</th>
                  <th className="py-2 pr-4">Market</th>
                  <th className="py-2 pr-4">Price</th>
                  <th className="py-2 pr-4">MSP</th>
                  <th className="py-2 pr-4">vs MSP</th>
                  <th className="py-2">Trend</th>
                </tr>
              </thead>
              <tbody>
                {data.map((m) => {
                  const delta =
                    m.mspPerQuintal != null
                      ? mspDeltaPercent(m.pricePerQuintal, m.mspPerQuintal)
                      : null
                  return (
                    <tr key={m.id} className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium text-gray-700">
                        {m.commodity}
                      </td>
                      <td className="py-2 pr-4 text-gray-600">{m.market}</td>
                      <td className="py-2 pr-4 font-semibold text-gray-800">
                        {formatINR(m.pricePerQuintal)}
                      </td>
                      <td className="py-2 pr-4 text-gray-600">
                        {m.mspPerQuintal != null ? formatINR(m.mspPerQuintal) : '—'}
                      </td>
                      <td className="py-2 pr-4">
                        {delta != null ? (
                          <span
                            className={`font-medium ${
                              delta >= 0 ? 'text-green-600' : 'text-red-500'
                            }`}
                          >
                            {delta >= 0 ? '+' : ''}
                            {delta}%
                          </span>
                        ) : (
                          <span className="text-gray-400">n/a</span>
                        )}
                      </td>
                      <td className="py-2 capitalize text-gray-500">{m.trend}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

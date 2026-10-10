import { Link } from 'react-router-dom'
import { useFarm } from '../context/FarmContext'
import { getAdvisories, getMarketPrices, getWeather } from '../services'
import { useAsync } from '../utils/useAsync'
import { formatINR, mspDeltaPercent, formatDate } from '../utils/format'
import AdvisoryCard from '../components/AdvisoryCard'
import PageHeader from '../components/PageHeader'
import DataModeBadge from '../components/DataModeBadge'
import { EmptyState, ErrorState, LoadingState } from '../components/StateViews'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export default function Dashboard() {
  const { profile } = useFarm()
  const advisories = useAsync((s) => getAdvisories(s), [])
  const weather = useAsync((s) => getWeather(profile.location, s), [profile.location])
  const market = useAsync((s) => getMarketPrices(s), [])

  const greeting = profile.farmerName
    ? `Welcome back, ${profile.farmerName}`
    : 'Welcome to your farm dashboard'

  return (
    <div>
      <PageHeader title="Dashboard" subtitle={greeting}>
        <DataModeBadge />
      </PageHeader>

      {!profile.onboarded && (
        <div className="mb-6 flex flex-col items-start justify-between gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4 sm:flex-row sm:items-center">
          <p className="text-sm text-brand-800">
            Set up your farm profile to get personalized advice.
          </p>
          <Link to="/onboarding" className="btn-primary">
            Start onboarding
          </Link>
        </div>
      )}

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">
          Today&apos;s advisories
        </h2>
        {advisories.loading && <LoadingState label="Loading advisories…" />}
        {advisories.error && <ErrorState message={advisories.error} />}
        {advisories.data && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {advisories.data.map((a) => (
              <AdvisoryCard key={a.id} advisory={a} />
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weather summary */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">7-day outlook</h2>
            <Link to="/weather" className="text-sm font-semibold text-brand-600">
              Details →
            </Link>
          </div>
          {weather.loading && <LoadingState label="Loading weather…" />}
          {weather.error && <ErrorState message={weather.error} />}
          {weather.data && (
            <div className="card">
              <div className="mb-3 flex items-baseline justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-800">
                    {weather.data.current.tempC}°C
                  </p>
                  <p className="text-sm text-gray-500">
                    {weather.data.current.condition} · {weather.data.location}
                  </p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>Humidity {weather.data.current.humidity}%</p>
                  <p>Wind {weather.data.current.windKph} km/h</p>
                </div>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weather.data.daily}>
                    <defs>
                      <linearGradient id="temp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#37a861" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#37a861" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatDate}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis hide />
                    <Tooltip
                      labelFormatter={formatDate}
                      formatter={(v: number) => [`${v}°C`, 'Temp']}
                    />
                    <Area
                      type="monotone"
                      dataKey="tempMax"
                      stroke="#27894d"
                      fill="url(#temp)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </section>

        {/* Market summary */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Market snapshot</h2>
            <Link to="/market" className="text-sm font-semibold text-brand-600">
              All prices →
            </Link>
          </div>
          {market.loading && <LoadingState label="Loading market prices…" />}
          {market.error && <ErrorState message={market.error} />}
          {market.data && market.data.length === 0 && (
            <EmptyState title="No market prices available" />
          )}
          {market.data && market.data.length > 0 && (
            <div className="card divide-y divide-gray-100">
              {market.data.slice(0, 4).map((m) => {
                const delta =
                  m.mspPerQuintal != null
                    ? mspDeltaPercent(m.pricePerQuintal, m.mspPerQuintal)
                    : null
                return (
                  <div key={m.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-800">{m.commodity}</p>
                      <p className="text-xs text-gray-500">{m.market}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        {formatINR(m.pricePerQuintal)}
                        <span className="text-xs font-normal text-gray-400">
                          /{m.unit}
                        </span>
                      </p>
                      {delta != null && (
                        <p
                          className={`text-xs font-medium ${
                            delta >= 0 ? 'text-green-600' : 'text-red-500'
                          }`}
                        >
                          {delta >= 0 ? '+' : ''}
                          {delta}% vs MSP
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}


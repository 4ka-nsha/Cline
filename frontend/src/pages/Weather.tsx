import { useFarm } from '../context/FarmContext'
import { getWeather } from '../services'
import { useAsync } from '../utils/useAsync'
import { formatDate } from '../utils/format'
import PageHeader from '../components/PageHeader'
import DataModeBadge from '../components/DataModeBadge'
import { ErrorState, LoadingState } from '../components/StateViews'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export default function Weather() {
  const { profile } = useFarm()
  const { data, loading, error } = useAsync(
    (s) => getWeather(profile.location, s),
    [profile.location],
  )

  return (
    <div>
      <PageHeader
        title="Weather"
        subtitle={profile.location ? `Forecast for ${profile.location}` : 'Local forecast'}
      >
        <DataModeBadge />
      </PageHeader>

      {loading && <LoadingState label="Loading weather…" />}
      {error && <ErrorState message={error} />}
      {data && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card">
              <p className="text-xs text-gray-400">Temperature</p>
              <p className="text-3xl font-bold text-gray-800">{data.current.tempC}°C</p>
              <p className="text-sm text-gray-500">{data.current.condition}</p>
            </div>
            <div className="card">
              <p className="text-xs text-gray-400">Humidity</p>
              <p className="text-3xl font-bold text-gray-800">{data.current.humidity}%</p>
              <p className="text-sm text-gray-500">Relative</p>
            </div>
            <div className="card">
              <p className="text-xs text-gray-400">Wind</p>
              <p className="text-3xl font-bold text-gray-800">{data.current.windKph}</p>
              <p className="text-sm text-gray-500">km/h</p>
            </div>
          </div>

          {data.alerts.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="mb-1 text-sm font-semibold text-amber-800">Alerts</p>
              <ul className="list-inside list-disc space-y-1 text-sm text-amber-700">
                {data.alerts.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="card">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Rainfall (mm)
            </h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.daily}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip
                    labelFormatter={formatDate}
                    formatter={(v: number) => [`${v} mm`, 'Rainfall']}
                  />
                  <Bar dataKey="rainfallMm" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-400">
                  <th className="py-2 pr-4">Day</th>
                  <th className="py-2 pr-4">Condition</th>
                  <th className="py-2 pr-4">Min</th>
                  <th className="py-2 pr-4">Max</th>
                  <th className="py-2 pr-4">Rain</th>
                  <th className="py-2">Humidity</th>
                </tr>
              </thead>
              <tbody>
                {data.daily.map((d) => (
                  <tr key={d.date} className="border-b border-gray-100">
                    <td className="py-2 pr-4 font-medium text-gray-700">
                      {formatDate(d.date)}
                    </td>
                    <td className="py-2 pr-4 text-gray-600">{d.condition}</td>
                    <td className="py-2 pr-4 text-gray-600">{d.tempMin}°</td>
                    <td className="py-2 pr-4 text-gray-600">{d.tempMax}°</td>
                    <td className="py-2 pr-4 text-gray-600">{d.rainfallMm} mm</td>
                    <td className="py-2 text-gray-600">{d.humidity}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

import { DATA_MODE } from '../services/config'

/** Shows the current explicit data mode (mock or live) for transparency. */
export default function DataModeBadge() {
  const live = DATA_MODE === 'live'
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        live
          ? 'bg-amber-100 text-amber-700'
          : 'bg-gray-100 text-gray-600'
      }`}
      title={
        live
          ? 'Serving live API data. Failed requests are surfaced, not replaced with mocks.'
          : 'Serving sample data. Set VITE_DATA_MODE=live to use the backend.'
      }
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${live ? 'bg-amber-500' : 'bg-gray-400'}`}
      />
      {live ? 'Live data' : 'Sample data'}
    </span>
  )
}

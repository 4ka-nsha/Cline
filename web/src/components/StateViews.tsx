import { AlertTriangle, Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'

/** Consistent loading indicator for async data. */
export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-gray-500">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  )
}

/**
 * Consistent error view.
 *
 * Deliberately shows the real error message instead of falling back to mock
 * data, so outages are visible to the user and teammates.
 */
export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="text-sm font-semibold">Couldn't load live data</p>
        <p className="text-sm">{message}</p>
        <p className="mt-1 text-xs text-red-500">
          The app is not falling back to sample data. Check the backend or set
          the data mode back to "mock".
        </p>
      </div>
    </div>
  )
}

export function EmptyState({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
      <p className="text-sm font-semibold text-gray-700">{title}</p>
      {hint && <p className="text-sm text-gray-500">{hint}</p>}
      {children}
    </div>
  )
}

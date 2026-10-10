import {
  Bug,
  Droplets,
  Info,
  Sprout,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import type { Advisory } from '../types'
import { advisoryStyles } from '../utils/format'

const ICONS: Record<string, LucideIcon> = {
  droplets: Droplets,
  sprout: Sprout,
  bug: Bug,
  'trending-up': TrendingUp,
}

export default function AdvisoryCard({
  advisory,
}: {
  advisory: Advisory
}) {
  const styles = advisoryStyles(advisory.level)
  const Icon = (advisory.icon && ICONS[advisory.icon]) || Info

  return (
    <div
      className={`card border ${styles.ring} flex flex-col gap-2 transition hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${styles.icon}`} />
          <h3 className="font-semibold text-gray-800">{advisory.title}</h3>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${styles.badge}`}
        >
          {advisory.level}
        </span>
      </div>
      <p className="text-sm text-gray-600">{advisory.message}</p>
      {advisory.action && (
        <span className="mt-1 text-xs font-semibold text-brand-600">
          {advisory.action} →
        </span>
      )}
    </div>
  )
}

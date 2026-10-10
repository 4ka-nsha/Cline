import type { AdvisoryLevel } from '../types'

/** Format a number as Indian Rupees (INR). */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Format a plain number with Indian digit grouping. */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value)
}

/** Format an ISO date string (YYYY-MM-DD) as e.g. "Sat, 10 Oct". */
export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

/** Compute the percent difference between market price and MSP. */
export function mspDeltaPercent(price: number, msp: number): number {
  if (!msp) return 0
  return Math.round(((price - msp) / msp) * 100)
}

const ADVISORY_STYLES: Record<
  AdvisoryLevel,
  { ring: string; badge: string; icon: string }
> = {
  info: { ring: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', icon: 'text-blue-500' },
  success: { ring: 'border-green-200', badge: 'bg-green-100 text-green-700', icon: 'text-green-500' },
  warning: { ring: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', icon: 'text-amber-500' },
  danger: { ring: 'border-red-200', badge: 'bg-red-100 text-red-700', icon: 'text-red-500' },
}

export function advisoryStyles(level: AdvisoryLevel) {
  return ADVISORY_STYLES[level] ?? ADVISORY_STYLES.info
}


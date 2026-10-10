import { NavLink } from 'react-router-dom'
import {
  ClipboardList,
  LayoutDashboard,
  Sprout,
  CloudSun,
  IndianRupee,
  FlaskConical,
  Wallet,
} from 'lucide-react'
import type { ReactNode } from 'react'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/onboarding', label: 'Farm Profile', icon: ClipboardList, end: false },
  { to: '/crops', label: 'Crops & Seeds', icon: Sprout, end: false },
  { to: '/weather', label: 'Weather', icon: CloudSun, end: false },
  { to: '/market', label: 'Market & MSP', icon: IndianRupee, end: false },
  { to: '/inputs', label: 'Inputs & Pesticides', icon: FlaskConical, end: false },
  { to: '/expenses', label: 'Expense Tracker', icon: Wallet, end: false },
]

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f5f6f4]">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-white md:flex">
        <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-5">
          <Sprout className="h-7 w-7 text-brand-600" />
          <span className="text-lg font-bold text-gray-800">Farm Assistant</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                ].join(' ')
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-gray-200 p-4 text-xs text-gray-400">
          MVP · Hackathon edition
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top nav */}
        <header className="border-b border-gray-200 bg-white px-4 py-3 md:hidden">
          <div className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-brand-600" />
            <span className="font-bold text-gray-800">Farm Assistant</span>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    'flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-medium',
                    isActive
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 text-gray-600',
                  ].join(' ')
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}

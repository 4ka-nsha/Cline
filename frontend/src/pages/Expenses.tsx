import { useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { getExpenses } from '../services'
import { useAsync } from '../utils/useAsync'
import { expenseCategoryLabel, formatINR } from '../utils/format'
import type { Expense, ExpenseCategory } from '../types'
import PageHeader from '../components/PageHeader'
import DataModeBadge from '../components/DataModeBadge'
import { ErrorState, LoadingState } from '../components/StateViews'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const CATEGORIES: ExpenseCategory[] = [
  'seeds',
  'fertilizer',
  'pesticide',
  'labour',
  'irrigation',
  'equipment',
  'other',
]

const PIE_COLORS = ['#37a861', '#60a5fa', '#f59e0b', '#a78bfa', '#fb7185', '#2dd4bf', '#94a3b8']

const emptyForm = { category: 'seeds' as ExpenseCategory, description: '', amount: '' }

export default function Expenses() {
  const { data, loading, error } = useAsync((s) => getExpenses(s), [])
  const [expenses, setExpenses] = useState<Expense[] | null>(null)
  const [form, setForm] = useState(emptyForm)

  // Use local (editable) list once initialized from the service; fall back to service data.
  const list = expenses ?? data ?? []

  const summary = useMemo(() => {
    const byCategory = new Map<ExpenseCategory, number>()
    let total = 0
    for (const e of list) {
      byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.amount)
      total += e.amount
    }
    const chart = CATEGORIES.filter((c) => byCategory.has(c)).map((c) => ({
      name: expenseCategoryLabel(c),
      value: byCategory.get(c) ?? 0,
    }))
    return { total, chart }
  }, [list])

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number(form.amount)
    if (!form.description.trim() || !amount || amount <= 0) return
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      category: form.category,
      description: form.description.trim(),
      amount,
      date: new Date().toISOString().slice(0, 10),
    }
    setExpenses([newExpense, ...list])
    setForm(emptyForm)
  }

  const handleRemove = (id: string) => {
    setExpenses(list.filter((e) => e.id !== id))
  }

  return (
    <div>
      <PageHeader title="Expense Tracker" subtitle="Track spending across your farm.">
        <DataModeBadge />
      </PageHeader>

      {loading && <LoadingState label="Loading expenses…" />}
      {error && <ErrorState message={error} />}

      {!loading && !error && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Add form */}
            <form onSubmit={handleAdd} className="card">
              <h2 className="mb-3 text-sm font-semibold text-gray-700">Add expense</h2>
              <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto]">
                <input
                  className="input"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <select
                  className="input"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value as ExpenseCategory })
                  }
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {expenseCategoryLabel(c)}
                    </option>
                  ))}
                </select>
                <input
                  className="input"
                  type="number"
                  min={0}
                  placeholder="Amount ₹"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
                <button type="submit" className="btn-primary">
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>
            </form>

            {/* List */}
            <div className="card divide-y divide-gray-100">
              {list.length === 0 && (
                <p className="py-6 text-center text-sm text-gray-400">
                  No expenses yet. Add your first one above.
                </p>
              )}
              {list.map((e) => (
                <div key={e.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-800">{e.description}</p>
                    <p className="text-xs text-gray-400">
                      {expenseCategoryLabel(e.category)} · {e.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-800">
                      {formatINR(e.amount)}
                    </span>
                    <button
                      onClick={() => handleRemove(e.id)}
                      className="text-gray-300 transition hover:text-red-500"
                      aria-label="Delete expense"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary + chart */}
          <div className="space-y-6">
            <div className="card">
              <p className="text-xs text-gray-400">Total spend</p>
              <p className="text-3xl font-bold text-gray-800">{formatINR(summary.total)}</p>
            </div>

            {summary.chart.length > 0 && (
              <div className="card">
                <h2 className="mb-2 text-sm font-semibold text-gray-700">By category</h2>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={summary.chart}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                      >
                        {summary.chart.map((entry, i) => (
                          <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => formatINR(v)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}


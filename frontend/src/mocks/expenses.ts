import type { Expense, ExpenseSummary } from '../types'

export const mockExpenses: Expense[] = [
  { id: 'exp-1', category: 'seeds', description: 'Wheat seed (HD-2967)', amount: 2700, date: '2026-10-01' },
  { id: 'exp-2', category: 'fertilizer', description: 'Urea + DAP', amount: 3600, date: '2026-10-03' },
  { id: 'exp-3', category: 'labour', description: 'Ploughing & sowing', amount: 5000, date: '2026-10-04' },
  { id: 'exp-4', category: 'irrigation', description: 'Diesel for pump', amount: 1500, date: '2026-10-06' },
  { id: 'exp-5', category: 'pesticide', description: 'Mancozeb spray', amount: 900, date: '2026-10-08' },
  { id: 'exp-6', category: 'equipment', description: 'Sprayer repair', amount: 700, date: '2026-10-09' },
]

export function summarizeExpenses(expenses: Expense[]): ExpenseSummary {
  const byCategoryMap = new Map<string, number>()
  for (const e of expenses) {
    byCategoryMap.set(e.category, (byCategoryMap.get(e.category) ?? 0) + e.amount)
  }
  const byCategory = Array.from(byCategoryMap.entries())
    .map(([category, amount]) => ({
      category: category as ExpenseSummary['byCategory'][number]['category'],
      amount,
    }))
    .sort((a, b) => b.amount - a.amount)
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  return { total, byCategory }
}

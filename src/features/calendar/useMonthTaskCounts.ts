import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db/db'
import type { DayCountMap } from '@/types/stats'

/**
 * Single indexed range query per visible month, reduced client-side into a per-day map.
 * Never issues per-day queries — that's the perf trap this hook exists to avoid.
 */
export function useMonthTaskCounts(year: number, month: number): DayCountMap {
  const map = useLiveQuery(async () => {
    const start = `${year}-${String(month + 1).padStart(2, '0')}-01`
    const endMonth = month === 11 ? 0 : month + 1
    const endYear = month === 11 ? year + 1 : year
    const end = `${endYear}-${String(endMonth + 1).padStart(2, '0')}-01`
    const tasks = await db.tasks.where('date').between(start, end, true, false).toArray()

    const result: DayCountMap = new Map()
    for (const task of tasks) {
      if (task.isDeleted) continue
      const entry = result.get(task.date) ?? { date: task.date, total: 0, completed: 0 }
      entry.total += 1
      if (task.completed) entry.completed += 1
      result.set(task.date, entry)
    }
    return result
  }, [year, month])

  return map ?? new Map()
}

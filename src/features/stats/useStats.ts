import { useLiveQuery } from 'dexie-react-hooks'
import { endOfMonth, endOfWeek, isWithinInterval, startOfMonth, startOfWeek } from 'date-fns'
import { db } from '@/lib/db/db'
import { dateKey, todayKey } from '@/features/calendar/calendarMath'
import { computeStreakStats } from '@/features/stats/streakEngine'
import { useSettings } from '@/features/settings/useSettings'
import type { StatsSummary } from '@/types/stats'
import type { Task } from '@/types/task'

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function computeSummary(tasks: Task[], weekStartsOn: 0 | 1): StatsSummary {
  const today = new Date()
  const todayStr = todayKey()
  const weekInterval = { start: startOfWeek(today, { weekStartsOn }), end: endOfWeek(today, { weekStartsOn }) }
  const monthInterval = { start: startOfMonth(today), end: endOfMonth(today) }

  const completedTasks = tasks.filter((t) => t.completed)
  const total = tasks.length
  const totalCompleted = completedTasks.length

  const todayCount = completedTasks.filter((t) => t.date === todayStr).length
  const thisWeek = completedTasks.filter((t) => isWithinInterval(new Date(t.date), weekInterval)).length
  const thisMonth = completedTasks.filter((t) => isWithinInterval(new Date(t.date), monthInterval)).length

  const streaks = computeStreakStats(tasks, weekStartsOn)

  const weekdayTotals = new Array(7).fill(0) as number[]
  for (const t of completedTasks) {
    weekdayTotals[new Date(t.date).getDay()]++
  }
  const maxWeekdayCount = Math.max(0, ...weekdayTotals)
  const mostProductiveDay =
    maxWeekdayCount > 0 ? WEEKDAY_NAMES[weekdayTotals.indexOf(maxWeekdayCount)] : null

  let averagePerDay = 0
  if (totalCompleted > 0) {
    const earliestDate = completedTasks.reduce((min, t) => (t.date < min ? t.date : min), completedTasks[0].date)
    const daysTracked = Math.max(
      1,
      Math.round((new Date(dateKey(today)).getTime() - new Date(earliestDate).getTime()) / 86_400_000) + 1,
    )
    averagePerDay = totalCompleted / daysTracked
  }

  const completionPercentage = total > 0 ? (totalCompleted / total) * 100 : 0

  return {
    today: todayCount,
    thisWeek,
    thisMonth,
    total,
    longestStreak: streaks.longestStreak,
    currentStreak: streaks.currentStreak,
    mostProductiveDay,
    averagePerDay,
    completionPercentage,
  }
}

export function useStats(): StatsSummary {
  const settings = useSettings()
  const tasks = useAllTasks()
  return computeSummary(tasks, settings.weekStartsOn)
}

export function useAllTasks(): Task[] {
  return useLiveQuery(() => db.tasks.filter((t) => !t.isDeleted).toArray(), []) ?? []
}

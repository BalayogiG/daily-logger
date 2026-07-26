import { startOfWeek } from 'date-fns'
import { dateKey } from '@/features/calendar/calendarMath'
import type { WeekStartsOn } from '@/types/settings'
import type { StreakStats } from '@/types/stats'
import type { Task } from '@/types/task'

/** Dates (YYYY-MM-DD) that have at least one completed task. */
export function getActiveDateSet(tasks: Task[]): Set<string> {
  const set = new Set<string>()
  for (const task of tasks) {
    if (task.completed) set.add(task.date)
  }
  return set
}

export function computeCurrentStreak(activeDates: Set<string>, today = new Date()): number {
  const cursor = new Date(today)
  cursor.setHours(0, 0, 0, 0)

  if (!activeDates.has(dateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
  }

  let streak = 0
  while (activeDates.has(dateKey(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function computeLongestStreak(activeDates: Set<string>): number {
  if (activeDates.size === 0) return 0
  const sorted = [...activeDates].sort()

  let longest = 1
  let current = 1
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1])
    const curr = new Date(sorted[i])
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86_400_000)
    current = diffDays === 1 ? current + 1 : 1
    longest = Math.max(longest, current)
  }
  return longest
}

export function computePerfectWeeks(activeDates: Set<string>, weekStartsOn: WeekStartsOn): number {
  const weekCounts = new Map<string, number>()
  for (const date of activeDates) {
    const weekKey = dateKey(startOfWeek(new Date(date), { weekStartsOn }))
    weekCounts.set(weekKey, (weekCounts.get(weekKey) ?? 0) + 1)
  }
  return [...weekCounts.values()].filter((count) => count >= 7).length
}

export function computeStreakStats(tasks: Task[], weekStartsOn: WeekStartsOn): StreakStats {
  const activeDates = getActiveDateSet(tasks)
  return {
    currentStreak: computeCurrentStreak(activeDates),
    longestStreak: computeLongestStreak(activeDates),
    activeDays: activeDates.size,
    perfectWeeks: computePerfectWeeks(activeDates, weekStartsOn),
  }
}

export const MILESTONES = [7, 30, 100, 365]

/** Returns the milestone just crossed if `streak` exactly matches one, else null. */
export function getCrossedMilestone(streak: number): number | null {
  return MILESTONES.includes(streak) ? streak : null
}

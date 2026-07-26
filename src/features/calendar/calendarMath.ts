import { addDays, differenceInCalendarDays, endOfMonth, endOfWeek, format, isAfter, isSameDay, startOfWeek } from 'date-fns'
import type { WeekStartsOn, IntensityThresholds } from '@/types/settings'

export interface CalendarDay {
  date: string // YYYY-MM-DD
  dateObj: Date
  isCurrentMonth: boolean
  isToday: boolean
  isFuture: boolean
}

export function dateKey(d: Date): string {
  return format(d, 'yyyy-MM-dd')
}

export function todayKey(): string {
  return dateKey(new Date())
}

/** Builds a traditional month grid (weeks as rows, weekdays as columns), padded with adjacent-month days for alignment. */
export function buildMonthGrid(year: number, month: number, weekStartsOn: WeekStartsOn): CalendarDay[][] {
  const firstOfMonth = new Date(year, month, 1)
  const lastOfMonth = endOfMonth(firstOfMonth)
  const gridStart = startOfWeek(firstOfMonth, { weekStartsOn })
  const gridEnd = endOfWeek(lastOfMonth, { weekStartsOn })

  const totalDays = differenceInCalendarDays(gridEnd, gridStart) + 1
  const totalWeeks = Math.ceil(totalDays / 7)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const weeks: CalendarDay[][] = []
  let cursor = gridStart
  for (let w = 0; w < totalWeeks; w++) {
    const week: CalendarDay[] = []
    for (let d = 0; d < 7; d++) {
      const dateObj = cursor
      week.push({
        date: dateKey(dateObj),
        dateObj,
        isCurrentMonth: dateObj.getFullYear() === year && dateObj.getMonth() === month,
        isToday: isSameDay(dateObj, today),
        isFuture: isAfter(dateObj, today) && !isSameDay(dateObj, today),
      })
      cursor = addDays(cursor, 1)
    }
    weeks.push(week)
  }
  return weeks
}

export const WEEKDAY_LABELS_MON: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const WEEKDAY_LABELS_SUN: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function getWeekdayLabels(weekStartsOn: WeekStartsOn): string[] {
  return weekStartsOn === 1 ? WEEKDAY_LABELS_MON : WEEKDAY_LABELS_SUN
}

/** Derives the 0-4 color bucket from a completed-task count and the configured thresholds. */
export function getIntensityLevel(count: number, thresholds: IntensityThresholds): 0 | 1 | 2 | 3 | 4 {
  const [t1, t2, t3, t4] = thresholds
  if (count >= t4) return 4
  if (count >= t3) return 3
  if (count >= t2) return 2
  if (count >= t1) return 1
  return 0
}

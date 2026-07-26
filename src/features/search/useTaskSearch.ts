import { useMemo } from 'react'
import { endOfMonth, endOfWeek, isWithinInterval, startOfMonth, startOfWeek } from 'date-fns'
import { todayKey } from '@/features/calendar/calendarMath'
import { useAllTasks } from '@/features/stats/useStats'
import { useSettings } from '@/features/settings/useSettings'
import { useFilterStore } from '@/store/filterStore'
import type { Task } from '@/types/task'

export function useTaskSearch(): Task[] {
  const tasks = useAllTasks()
  const settings = useSettings()
  const { searchQuery, quickFilter, dateRange, tagFilter, priorityFilter } = useFilterStore()

  return useMemo(() => {
    let result = tasks

    if (quickFilter === 'today') {
      const today = todayKey()
      result = result.filter((t) => t.date === today)
    } else if (quickFilter === 'week') {
      const today = new Date()
      const interval = { start: startOfWeek(today, { weekStartsOn: settings.weekStartsOn }), end: endOfWeek(today, { weekStartsOn: settings.weekStartsOn }) }
      result = result.filter((t) => isWithinInterval(new Date(t.date), interval))
    } else if (quickFilter === 'month') {
      const today = new Date()
      const interval = { start: startOfMonth(today), end: endOfMonth(today) }
      result = result.filter((t) => isWithinInterval(new Date(t.date), interval))
    } else if (quickFilter === 'custom' && dateRange.from && dateRange.to) {
      result = result.filter((t) => t.date >= dateRange.from! && t.date <= dateRange.to!)
    }

    if (tagFilter.length > 0) {
      result = result.filter((t) => t.tags.some((tag) => tagFilter.includes(tag)))
    }

    if (priorityFilter.length > 0) {
      result = result.filter((t) => priorityFilter.includes(t.priority))
    }

    const query = searchQuery.trim().toLowerCase()
    if (query) {
      result = result.filter((t) => {
        const haystack = [t.title, t.notes ?? '', t.tags.join(' '), t.date].join(' ').toLowerCase()
        return haystack.includes(query)
      })
    }

    return result
  }, [tasks, searchQuery, quickFilter, dateRange, tagFilter, priorityFilter, settings.weekStartsOn])
}

export function useAllTags(): string[] {
  const tasks = useAllTasks()
  return useMemo(() => {
    const set = new Set<string>()
    for (const t of tasks) for (const tag of t.tags) set.add(tag)
    return [...set].sort()
  }, [tasks])
}

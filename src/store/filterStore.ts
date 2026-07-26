import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Priority } from '@/types/task'

export type QuickFilter = 'today' | 'week' | 'month' | 'custom' | null

interface DateRange {
  from: string | null // YYYY-MM-DD
  to: string | null
}

interface FilterState {
  searchQuery: string
  setSearchQuery: (query: string) => void

  quickFilter: QuickFilter
  setQuickFilter: (filter: QuickFilter) => void

  dateRange: DateRange
  setDateRange: (range: DateRange) => void

  tagFilter: string[]
  toggleTagFilter: (tag: string) => void

  priorityFilter: Priority[]
  togglePriorityFilter: (priority: Priority) => void

  clearFilters: () => void
}

const initialFilters = {
  searchQuery: '',
  quickFilter: null as QuickFilter,
  dateRange: { from: null, to: null } as DateRange,
  tagFilter: [] as string[],
  priorityFilter: [] as Priority[],
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      ...initialFilters,

      setSearchQuery: (query) => set({ searchQuery: query }),

      setQuickFilter: (filter) => set({ quickFilter: filter }),

      setDateRange: (range) => set({ dateRange: range, quickFilter: 'custom' }),

      toggleTagFilter: (tag) => {
        const current = get().tagFilter
        set({
          tagFilter: current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
        })
      },

      togglePriorityFilter: (priority) => {
        const current = get().priorityFilter
        set({
          priorityFilter: current.includes(priority)
            ? current.filter((p) => p !== priority)
            : [...current, priority],
        })
      },

      clearFilters: () => set(initialFilters),
    }),
    { name: 'daily-logger-filters' },
  ),
)

import { CalendarIcon, X } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { useFilterStore, type QuickFilter } from '@/store/filterStore'
import { useAllTags } from '@/features/search/useTaskSearch'
import type { Priority } from '@/types/task'

const QUICK_FILTERS: { value: QuickFilter; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
]

const PRIORITIES: Priority[] = ['low', 'medium', 'high']

export function FilterPanel() {
  const quickFilter = useFilterStore((s) => s.quickFilter)
  const setQuickFilter = useFilterStore((s) => s.setQuickFilter)
  const dateRange = useFilterStore((s) => s.dateRange)
  const setDateRange = useFilterStore((s) => s.setDateRange)
  const tagFilter = useFilterStore((s) => s.tagFilter)
  const toggleTagFilter = useFilterStore((s) => s.toggleTagFilter)
  const priorityFilter = useFilterStore((s) => s.priorityFilter)
  const togglePriorityFilter = useFilterStore((s) => s.togglePriorityFilter)
  const clearFilters = useFilterStore((s) => s.clearFilters)
  const allTags = useAllTags()

  const hasActiveFilters =
    quickFilter !== null || tagFilter.length > 0 || priorityFilter.length > 0

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Quick filter</p>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_FILTERS.map(({ value, label }) => (
            <Button
              key={value}
              size="sm"
              variant={quickFilter === value ? 'default' : 'outline'}
              onClick={() => setQuickFilter(quickFilter === value ? null : value)}
            >
              {label}
            </Button>
          ))}
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant={quickFilter === 'custom' ? 'default' : 'outline'} className="gap-1.5">
                <CalendarIcon className="size-3.5" />
                {quickFilter === 'custom' && dateRange.from
                  ? `${format(new Date(dateRange.from), 'MMM d')} – ${dateRange.to ? format(new Date(dateRange.to), 'MMM d') : '…'}`
                  : 'Custom'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={{
                  from: dateRange.from ? new Date(dateRange.from) : undefined,
                  to: dateRange.to ? new Date(dateRange.to) : undefined,
                }}
                onSelect={(range) =>
                  setDateRange({
                    from: range?.from ? format(range.from, 'yyyy-MM-dd') : null,
                    to: range?.to ? format(range.to, 'yyyy-MM-dd') : null,
                  })
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Priority</p>
        <div className="flex flex-wrap gap-1.5">
          {PRIORITIES.map((p) => (
            <Badge
              key={p}
              variant={priorityFilter.includes(p) ? 'default' : 'outline'}
              className="h-8 cursor-pointer px-3 capitalize"
              onClick={() => togglePriorityFilter(p)}
            >
              {p}
            </Badge>
          ))}
        </div>
      </div>

      {allTags.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Tags</p>
          <div className="flex flex-wrap gap-1.5">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={tagFilter.includes(tag) ? 'default' : 'outline'}
                className={cn('h-8 cursor-pointer px-3')}
                onClick={() => toggleTagFilter(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <Button size="sm" variant="ghost" onClick={clearFilters} className="justify-start gap-1.5 text-muted-foreground">
          <X className="size-3.5" />
          Clear filters
        </Button>
      )}
    </div>
  )
}

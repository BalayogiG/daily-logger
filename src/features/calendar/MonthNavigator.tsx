import { ChevronLeft, ChevronRight, CalendarCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUiStore } from '@/store/uiStore'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function MonthNavigator() {
  const calendarYear = useUiStore((s) => s.calendarYear)
  const calendarMonth = useUiStore((s) => s.calendarMonth)
  const goToAdjacentMonth = useUiStore((s) => s.goToAdjacentMonth)
  const jumpToCurrentMonth = useUiStore((s) => s.jumpToCurrentMonth)

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" onClick={() => goToAdjacentMonth(-1)} aria-label="Previous month">
          <ChevronLeft className="size-4" />
        </Button>
        <span className="w-40 text-center font-heading text-sm font-semibold">
          {MONTH_NAMES[calendarMonth]} {calendarYear}
        </span>
        <Button variant="ghost" size="icon-sm" onClick={() => goToAdjacentMonth(1)} aria-label="Next month">
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <Button variant="outline" size="sm" onClick={jumpToCurrentMonth} className="gap-1.5">
        <CalendarCheck className="size-3.5" />
        Today
      </Button>
    </div>
  )
}

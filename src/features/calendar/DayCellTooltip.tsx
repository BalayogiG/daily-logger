import { useRef, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DayCell } from '@/features/calendar/DayCell'
import { useIsDesktop } from '@/hooks/useMediaQuery'
import { useUiStore } from '@/store/uiStore'
import { useTasksForDate } from '@/features/tasks/useTasksForDate'
import type { CalendarDay } from '@/features/calendar/calendarMath'

interface DayCellTooltipProps {
  day: CalendarDay
  completedCount: number
  totalCount: number
  color: string
  isSelected: boolean
}

const HOVER_DELAY_MS = 150

export function DayCellTooltip({ day, completedCount, totalCount, color, isSelected }: DayCellTooltipProps) {
  const isDesktop = useIsDesktop()
  const setSelectedDate = useUiStore((s) => s.setSelectedDate)
  const openDayDetail = useUiStore((s) => s.openDayDetail)

  if (!isDesktop || !day.isCurrentMonth) {
    return (
      <DayCell
        day={day}
        completedCount={completedCount}
        totalCount={totalCount}
        color={color}
        isSelected={isSelected}
        onSelect={isDesktop ? setSelectedDate : openDayDetail}
      />
    )
  }

  return (
    <HoverPopover day={day} completedCount={completedCount} totalCount={totalCount} color={color} isSelected={isSelected} />
  )
}

function HoverPopover({ day, completedCount, totalCount, color, isSelected }: DayCellTooltipProps) {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<number | undefined>(undefined)
  const setSelectedDate = useUiStore((s) => s.setSelectedDate)
  const tasks = useTasksForDate(open ? day.date : '')

  const show = () => {
    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => setOpen(true), HOVER_DELAY_MS)
  }
  const scheduleHide = () => {
    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => setOpen(false), HOVER_DELAY_MS)
  }
  const cancelHide = () => window.clearTimeout(timeoutRef.current)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onMouseEnter={show} onMouseLeave={scheduleHide}>
        <span>
          <DayCell
            day={day}
            completedCount={completedCount}
            totalCount={totalCount}
            color={color}
            isSelected={isSelected}
            onSelect={setSelectedDate}
          />
        </span>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        onMouseEnter={cancelHide}
        onMouseLeave={scheduleHide}
        className="w-56"
      >
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-semibold">{format(parseISO(day.date), 'EEEE, MMM d')}</p>
          <p className="text-xs text-muted-foreground">
            {completedCount} of {totalCount || completedCount} task{completedCount === 1 ? '' : 's'} completed
          </p>
          {tasks.length > 0 && (
            <ul className="mt-1 flex flex-col gap-0.5 border-t border-border pt-1.5">
              {tasks.slice(0, 6).map((t) => (
                <li key={t.id} className="truncate text-xs text-foreground">
                  {t.completed ? '✓' : '○'} {t.title}
                </li>
              ))}
              {tasks.length > 6 && (
                <li className="text-xs text-muted-foreground">+{tasks.length - 6} more</li>
              )}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

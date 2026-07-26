import { memo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { CalendarDay } from '@/features/calendar/calendarMath'

interface DayCellProps {
  day: CalendarDay
  completedCount: number
  totalCount: number
  color: string
  isSelected: boolean
  onSelect: (date: string) => void
}

function DayCellImpl({ day, completedCount, totalCount, color, isSelected, onSelect }: DayCellProps) {
  const dayNumber = day.dateObj.getDate()

  if (!day.isCurrentMonth) {
    return (
      <div
        aria-hidden
        className="flex aspect-square min-h-11 items-start justify-start rounded-lg p-1.5 text-xs text-muted-foreground/30"
      >
        {dayNumber}
      </div>
    )
  }

  const disabled = day.isFuture
  const label = `${day.date}: ${completedCount} of ${totalCount || completedCount} task${completedCount === 1 ? '' : 's'} completed`

  return (
    <motion.button
      type="button"
      disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label={disabled ? `${day.date}: upcoming` : label}
      data-today={day.isToday || undefined}
      onClick={() => !disabled && onSelect(day.date)}
      initial={false}
      animate={{ backgroundColor: color }}
      transition={{ duration: 0.25 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      className={cn(
        'relative flex aspect-square min-h-11 flex-col items-start justify-start rounded-lg p-1.5 text-left text-xs font-medium transition-colors',
        disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
        day.isToday && 'ring-2 ring-offset-1 ring-offset-background ring-primary',
        isSelected && !day.isToday && 'ring-2 ring-offset-1 ring-offset-background ring-foreground/40',
      )}
    >
      <span>{dayNumber}</span>
      {completedCount > 0 && (
        <span className="absolute right-1 bottom-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-background/70 px-1 text-[10px] font-semibold leading-none text-foreground">
          {completedCount}
        </span>
      )}
    </motion.button>
  )
}

export const DayCell = memo(DayCellImpl)

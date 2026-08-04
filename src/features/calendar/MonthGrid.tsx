import { useMemo } from 'react'
import { buildMonthGrid, getIntensityLevel, getWeekdayLabels } from '@/features/calendar/calendarMath'
import { DayCellTooltip } from '@/features/calendar/DayCellTooltip'
import { WeekdayHeader } from '@/features/calendar/WeekdayHeader'
import { useMonthTaskCounts } from '@/features/calendar/useMonthTaskCounts'
import { useSettings } from '@/features/settings/useSettings'
import { useTheme } from '@/lib/theme/useTheme'
import { useUiStore } from '@/store/uiStore'

export function MonthGrid({ year, month }: { year: number; month: number }) {
  const settings = useSettings()
  const { resolvedTheme } = useTheme()
  const countMap = useMonthTaskCounts(year, month)
  const selectedDate = useUiStore((s) => s.selectedDate)

  const weeks = useMemo(() => buildMonthGrid(year, month, settings.weekStartsOn), [year, month, settings.weekStartsOn])
  const weekdayLabels = useMemo(() => getWeekdayLabels(settings.weekStartsOn), [settings.weekStartsOn])
  const colors = resolvedTheme === 'dark' ? settings.intensityColorsDark : settings.intensityColorsLight

  return (
    <div className="mx-auto flex w-full max-w-[85%] flex-col gap-1.5">
      <WeekdayHeader labels={weekdayLabels} />
      <div className="flex flex-col gap-1.5">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1.5">
            {week.map((day) => {
              const count = countMap.get(day.date)
              const completedCount = count?.completed ?? 0
              const level = getIntensityLevel(completedCount, settings.intensityThresholds)
              return (
                <DayCellTooltip
                  key={day.date}
                  day={day}
                  completedCount={completedCount}
                  totalCount={count?.total ?? 0}
                  color={colors[level]}
                  isSelected={day.date === selectedDate}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

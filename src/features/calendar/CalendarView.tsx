import { useEffect, useRef } from 'react'
import { MonthGrid } from '@/features/calendar/MonthGrid'
import { MonthNavigator } from '@/features/calendar/MonthNavigator'
import { useSwipe } from '@/hooks/useSwipe'
import { useUiStore } from '@/store/uiStore'
import { useSettings, updateSettings } from '@/features/settings/useSettings'

export function CalendarView() {
  const calendarYear = useUiStore((s) => s.calendarYear)
  const calendarMonth = useUiStore((s) => s.calendarMonth)
  const setCalendarMonth = useUiStore((s) => s.setCalendarMonth)
  const goToAdjacentMonth = useUiStore((s) => s.goToAdjacentMonth)
  const settings = useSettings()

  const appliedInitialYear = useRef(false)
  useEffect(() => {
    if (!appliedInitialYear.current) {
      appliedInitialYear.current = true
      if (settings.lastViewedYear !== calendarYear) setCalendarMonth(settings.lastViewedYear, calendarMonth)
      return
    }
    updateSettings({ lastViewedYear: calendarYear })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarYear])

  const swipeHandlers = useSwipe({
    onSwipeLeft: () => goToAdjacentMonth(1),
    onSwipeRight: () => goToAdjacentMonth(-1),
  })

  return (
    <div className="flex flex-col gap-4 p-4 md:p-0">
      <MonthNavigator />
      <div {...swipeHandlers}>
        <MonthGrid year={calendarYear} month={calendarMonth} />
      </div>
    </div>
  )
}

import { lazy, Suspense } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { AppShell } from '@/components/layout/AppShell'
import { CalendarView } from '@/features/calendar/CalendarView'
import { DayDetailSheet } from '@/features/calendar/DayDetailSheet'
import { TaskListForDay } from '@/features/tasks/TaskListForDay'
import { TaskFormModal } from '@/features/tasks/TaskFormModal'
import { MilestoneCelebration } from '@/components/feedback/MilestoneCelebration'
import { SearchBar } from '@/features/search/SearchBar'
import { FilterPanel } from '@/features/search/FilterPanel'
import { useUiStore } from '@/store/uiStore'
import { useTheme } from '@/lib/theme/useTheme'
import { useReminderScheduler } from '@/lib/notifications/useReminderScheduler'

// Calendar is the default view and stays eager; the rest lazy-load on first visit
// so Recharts (Statistics) and jsPDF-adjacent code never ship in the initial bundle.
const TaskListView = lazy(() => import('@/features/tasks/TaskListView').then((m) => ({ default: m.TaskListView })))
const StatsDashboard = lazy(() => import('@/features/stats/StatsDashboard').then((m) => ({ default: m.StatsDashboard })))
const SettingsView = lazy(() => import('@/features/settings/SettingsView').then((m) => ({ default: m.SettingsView })))

const VIEWS = {
  calendar: CalendarView,
  tasks: TaskListView,
  stats: StatsDashboard,
  settings: SettingsView,
}

function ViewFallback() {
  return <div className="p-6 text-sm text-muted-foreground">Loading…</div>
}

function App() {
  const { resolvedTheme } = useTheme()
  useReminderScheduler()
  const activeView = useUiStore((s) => s.activeView)
  const ActiveComponent = VIEWS[activeView]

  return (
    <TooltipProvider>
      <AppShell
        rightPanel={activeView === 'calendar' ? <TaskListForDay /> : undefined}
        sidebarExtra={
          activeView === 'tasks' ? (
            <div className="flex flex-col gap-4">
              <SearchBar />
              <FilterPanel />
            </div>
          ) : undefined
        }
      >
        <Suspense fallback={<ViewFallback />}>
          <ActiveComponent />
        </Suspense>
      </AppShell>
      <TaskFormModal />
      <DayDetailSheet />
      <MilestoneCelebration />
      <Toaster theme={resolvedTheme} />
    </TooltipProvider>
  )
}

export default App

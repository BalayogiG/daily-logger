import { CalendarDays, ListChecks, BarChart3, Settings, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUiStore, type ActiveView } from '@/store/uiStore'
import { Button } from '@/components/ui/button'

const NAV_ITEMS: { view: ActiveView; label: string; icon: typeof CalendarDays }[] = [
  { view: 'calendar', label: 'Calendar', icon: CalendarDays },
  { view: 'tasks', label: 'Tasks', icon: ListChecks },
  { view: 'stats', label: 'Statistics', icon: BarChart3 },
  { view: 'settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ children }: { children?: React.ReactNode }) {
  const activeView = useUiStore((s) => s.activeView)
  const setActiveView = useUiStore((s) => s.setActiveView)
  const openTaskForm = useUiStore((s) => s.openTaskForm)

  return (
    <aside className="flex h-svh w-64 shrink-0 flex-col border-r border-border bg-card/40 p-4">
      <div className="mb-6 flex items-center gap-2 px-2">
        <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold">
          DL
        </span>
        <span className="font-heading text-sm font-semibold">Daily Logger</span>
      </div>

      <Button className="mb-4 justify-start gap-2" onClick={() => openTaskForm({ mode: 'add' })}>
        <Plus className="size-4" />
        Add task
      </Button>

      <nav>
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ view, label, icon: Icon }) => {
            const isActive = activeView === view
            return (
              <li key={view}>
                <button
                  type="button"
                  onClick={() => setActiveView(view)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {children && <div className="mt-6 flex-1 overflow-y-auto">{children}</div>}
    </aside>
  )
}

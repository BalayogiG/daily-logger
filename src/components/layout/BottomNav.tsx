import { CalendarDays, ListChecks, BarChart3, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUiStore, type ActiveView } from '@/store/uiStore'

const NAV_ITEMS: { view: ActiveView; label: string; icon: typeof CalendarDays }[] = [
  { view: 'calendar', label: 'Calendar', icon: CalendarDays },
  { view: 'tasks', label: 'Tasks', icon: ListChecks },
  { view: 'stats', label: 'Stats', icon: BarChart3 },
  { view: 'settings', label: 'Settings', icon: Settings },
]

export function BottomNav() {
  const activeView = useUiStore((s) => s.activeView)
  const setActiveView = useUiStore((s) => s.setActiveView)

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/80"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="flex items-stretch justify-around">
        {NAV_ITEMS.map(({ view, label, icon: Icon }) => {
          const isActive = activeView === view
          return (
            <li key={view} className="flex-1">
              <button
                type="button"
                onClick={() => setActiveView(view)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex min-h-[44px] w-full flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="size-5" strokeWidth={isActive ? 2.5 : 2} />
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

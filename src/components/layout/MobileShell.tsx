import type { ReactNode } from 'react'
import { BottomNav } from '@/components/layout/BottomNav'
import { FloatingAddButton } from '@/components/layout/FloatingAddButton'
import { useUiStore } from '@/store/uiStore'

const TITLES: Record<string, string> = {
  calendar: 'Calendar',
  tasks: 'Tasks',
  stats: 'Statistics',
  settings: 'Settings',
}

export function MobileShell({ children }: { children: ReactNode }) {
  const activeView = useUiStore((s) => s.activeView)
  const showFab = activeView === 'calendar' || activeView === 'tasks'

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header
        className="sticky top-0 z-30 border-b border-border bg-background/95 px-4 py-2.5 backdrop-blur-sm supports-backdrop-filter:bg-background/80"
        style={{ paddingTop: 'calc(0.625rem + env(safe-area-inset-top))' }}
      >
        <div className="mb-1 flex items-center gap-1.5">
          <span className="flex size-5 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground">
            DL
          </span>
          <span className="text-xs font-medium text-muted-foreground">Daily Logger</span>
        </div>
        <h1 className="font-heading text-lg font-semibold">{TITLES[activeView]}</h1>
      </header>

      <main className="flex-1 overflow-x-hidden pb-24">{children}</main>

      {showFab && <FloatingAddButton />}
      <BottomNav />
    </div>
  )
}

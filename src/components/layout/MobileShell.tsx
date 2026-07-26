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
        className="sticky top-0 z-30 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-sm supports-backdrop-filter:bg-background/80"
        style={{ paddingTop: 'calc(0.75rem + env(safe-area-inset-top))' }}
      >
        <h1 className="font-heading text-lg font-semibold">{TITLES[activeView]}</h1>
      </header>

      <main className="flex-1 overflow-x-hidden pb-24">{children}</main>

      {showFab && <FloatingAddButton />}
      <BottomNav />
    </div>
  )
}

import type { ReactNode } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'

export function DesktopShell({
  sidebarExtra,
  rightPanel,
  children,
}: {
  sidebarExtra?: ReactNode
  rightPanel?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex h-svh bg-background text-foreground">
      <Sidebar>{sidebarExtra}</Sidebar>
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl p-6">{children}</div>
      </main>
      {rightPanel && (
        <aside className="w-80 shrink-0 overflow-y-auto border-l border-border bg-card/40 p-4">
          {rightPanel}
        </aside>
      )}
    </div>
  )
}

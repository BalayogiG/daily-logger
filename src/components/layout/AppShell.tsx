import type { ReactNode } from 'react'
import { useIsDesktop } from '@/hooks/useMediaQuery'
import { MobileShell } from '@/components/layout/MobileShell'
import { DesktopShell } from '@/components/layout/DesktopShell'

export function AppShell({
  sidebarExtra,
  rightPanel,
  children,
}: {
  sidebarExtra?: ReactNode
  rightPanel?: ReactNode
  children: ReactNode
}) {
  const isDesktop = useIsDesktop()

  if (isDesktop) {
    return (
      <DesktopShell sidebarExtra={sidebarExtra} rightPanel={rightPanel}>
        {children}
      </DesktopShell>
    )
  }

  return <MobileShell>{children}</MobileShell>
}

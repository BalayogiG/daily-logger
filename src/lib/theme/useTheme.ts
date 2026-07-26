import { useEffect } from 'react'
import { useSettings } from '@/features/settings/useSettings'
import { useMediaQuery } from '@/hooks/useMediaQuery'

/** Resolves settings.theme (light/dark/system) and syncs the `.dark` class on <html>. */
export function useTheme() {
  const settings = useSettings()
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

  const resolvedTheme = settings.theme === 'system' ? (prefersDark ? 'dark' : 'light') : settings.theme

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', resolvedTheme === 'dark')
  }, [resolvedTheme])

  return { theme: settings.theme, resolvedTheme }
}

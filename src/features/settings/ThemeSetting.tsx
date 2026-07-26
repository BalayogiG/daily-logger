import { Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSettings, updateSettings } from '@/features/settings/useSettings'
import type { ThemeMode } from '@/types/settings'

const OPTIONS: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

export function ThemeSetting() {
  const settings = useSettings()

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">Theme</span>
      <div className="flex gap-2">
        {OPTIONS.map(({ value, label, icon: Icon }) => {
          const isActive = settings.theme === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => updateSettings({ theme: value })}
              className={cn(
                'flex min-h-[44px] flex-1 flex-col items-center justify-center gap-1 rounded-xl border px-3 py-2 text-xs font-medium transition-colors',
                isActive
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

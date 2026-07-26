import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useSettings, updateSettings } from '@/features/settings/useSettings'

export function WeekStartSetting() {
  const settings = useSettings()

  return (
    <div className="flex items-center justify-between">
      <Label>Week starts on</Label>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={settings.weekStartsOn === 1 ? 'default' : 'outline'}
          onClick={() => updateSettings({ weekStartsOn: 1 })}
        >
          Monday
        </Button>
        <Button
          size="sm"
          variant={settings.weekStartsOn === 0 ? 'default' : 'outline'}
          onClick={() => updateSettings({ weekStartsOn: 0 })}
        >
          Sunday
        </Button>
      </div>
    </div>
  )
}

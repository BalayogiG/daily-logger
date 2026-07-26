import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { useSettings, updateSettings } from '@/features/settings/useSettings'

export function ReminderSetting() {
  const settings = useSettings()

  const onToggle = async (checked: boolean) => {
    if (checked) {
      if (typeof Notification === 'undefined') {
        toast.error('Notifications are not supported in this browser')
        return
      }
      const result = await Notification.requestPermission()
      if (result !== 'granted') {
        toast.error('Notification permission was not granted')
        return
      }
    }
    updateSettings({ reminderEnabled: checked })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <Label htmlFor="reminder-toggle">Daily reminder</Label>
          <span className="text-xs text-muted-foreground">Notifies while the app is open in a tab</span>
        </div>
        <Switch id="reminder-toggle" checked={settings.reminderEnabled} onCheckedChange={onToggle} />
      </div>
      {settings.reminderEnabled && (
        <Input
          type="time"
          value={settings.reminderTime}
          onChange={(e) => updateSettings({ reminderTime: e.target.value })}
          className="h-8 w-32"
        />
      )}
    </div>
  )
}

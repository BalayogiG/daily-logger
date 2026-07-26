import { useEffect } from 'react'
import { useSettings } from '@/features/settings/useSettings'
import { clearReminder, scheduleReminder } from '@/lib/notifications/reminderScheduler'

export function useReminderScheduler() {
  const settings = useSettings()

  useEffect(() => {
    const notificationsSupported = typeof Notification !== 'undefined'
    if (settings.reminderEnabled && notificationsSupported && Notification.permission === 'granted') {
      scheduleReminder(settings.reminderTime)
    } else {
      clearReminder()
    }
    return clearReminder
  }, [settings.reminderEnabled, settings.reminderTime])
}

let timeoutId: number | undefined

function msUntil(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number)
  const now = new Date()
  const target = new Date(now)
  target.setHours(h, m, 0, 0)
  if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 1)
  return target.getTime() - now.getTime()
}

function fireNotification() {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
  new Notification('Daily Logger', {
    body: "Don't forget to log today's tasks!",
    icon: `${import.meta.env.BASE_URL}icons/icon-192.png`,
  })
}

/** Best-effort, foreground-only reminder: reschedules itself daily while the app stays open. */
export function scheduleReminder(timeStr: string) {
  clearReminder()
  timeoutId = window.setTimeout(() => {
    fireNotification()
    scheduleReminder(timeStr)
  }, msUntil(timeStr))
}

export function clearReminder() {
  if (timeoutId !== undefined) {
    window.clearTimeout(timeoutId)
    timeoutId = undefined
  }
}

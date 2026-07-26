import { db } from '@/lib/db/db'
import { downloadBlob, dateStamp } from '@/lib/download'

/** Also serves as the local backup file — same shape, same function. */
export async function exportJson() {
  const [tasks, settings] = await Promise.all([db.tasks.toArray(), db.settings.get('app-settings')])
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    tasks,
    settings,
  }
  downloadBlob(JSON.stringify(payload, null, 2), 'application/json', `daily-logger-backup-${dateStamp()}.json`)
}

import { db } from '@/lib/db/db'
import { backupSchema, type Backup } from '@/features/export/backupSchema'

export async function parseBackupFile(file: File): Promise<Backup> {
  const text = await file.text()
  const json = JSON.parse(text)
  return backupSchema.parse(json)
}

/** Replaces all local data with the backup contents. Caller is responsible for confirming with the user first. */
export async function restoreBackup(backup: Backup) {
  await db.transaction('rw', db.tasks, db.settings, async () => {
    await db.tasks.clear()
    if (backup.tasks.length > 0) await db.tasks.bulkAdd(backup.tasks)
    if (backup.settings) {
      await db.settings.clear()
      await db.settings.add(backup.settings)
    }
  })
}

import { db } from '@/lib/db/db'

const RETENTION_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

/**
 * Hard-deletes soft-deleted tasks past the retention window. Kept generous so other devices have
 * plenty of time to observe the tombstone via sync before it's purged locally — purging too soon
 * on one device risks that device's next sync never having "seen" the deletion propagate elsewhere.
 */
export async function purgeTombstones() {
  const cutoff = new Date(Date.now() - RETENTION_MS).toISOString()
  const staleIds = await db.tasks.filter((t) => t.isDeleted && !!t.deletedAt && t.deletedAt < cutoff).primaryKeys()
  if (staleIds.length > 0) await db.tasks.bulkDelete(staleIds)
}

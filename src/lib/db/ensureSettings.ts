import { db } from '@/lib/db/db'
import { DEFAULT_SETTINGS } from '@/types/settings'

/**
 * Ensures the singleton settings row exists. Safe to call multiple times, including
 * concurrently — `add()` is atomic, so a losing concurrent call just gets a ConstraintError
 * (row already created by the winner) rather than corrupting anything.
 */
export async function ensureSettings() {
  try {
    await db.settings.add(DEFAULT_SETTINGS)
  } catch (err) {
    if (!(err instanceof Error) || err.name !== 'ConstraintError') throw err
  }
}

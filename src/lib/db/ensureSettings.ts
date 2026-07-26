import { db } from '@/lib/db/db'
import { DEFAULT_SETTINGS } from '@/types/settings'

/** Ensures the singleton settings row exists. Safe to call multiple times. */
export async function ensureSettings() {
  const existing = await db.settings.get('app-settings')
  if (!existing) {
    await db.settings.add(DEFAULT_SETTINGS)
  }
}

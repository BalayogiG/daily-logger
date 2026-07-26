import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db/db'
import { DEFAULT_SETTINGS, type AppSettings } from '@/types/settings'

export function useSettings(): AppSettings {
  const settings = useLiveQuery(() => db.settings.get('app-settings'), [])
  return settings ?? DEFAULT_SETTINGS
}

export async function updateSettings(patch: Partial<Omit<AppSettings, 'key'>>) {
  const existing = await db.settings.get('app-settings')
  if (existing) {
    await db.settings.update('app-settings', patch)
  } else {
    await db.settings.add({ ...DEFAULT_SETTINGS, ...patch })
  }
}

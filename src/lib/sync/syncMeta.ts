import { db } from '@/lib/db/db'
import type { GitHubSyncConfig, SyncCursor } from '@/types/sync'

export async function getSyncConfig(): Promise<GitHubSyncConfig | null> {
  const record = await db.syncMeta.get('github-config')
  return record?.key === 'github-config' ? record : null
}

export async function setSyncConfig(config: Omit<GitHubSyncConfig, 'key'>): Promise<void> {
  await db.syncMeta.put({ key: 'github-config', ...config })
}

export async function clearSyncConfig(): Promise<void> {
  await db.syncMeta.delete('github-config')
}

export async function getSyncCursor(): Promise<SyncCursor> {
  const record = await db.syncMeta.get('sync-cursor')
  return record?.key === 'sync-cursor' ? record : { key: 'sync-cursor' }
}

export async function setSyncCursor(patch: Partial<Omit<SyncCursor, 'key'>>): Promise<void> {
  const existing = await getSyncCursor()
  await db.syncMeta.put({ ...existing, ...patch })
}

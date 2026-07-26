import { useLiveQuery } from 'dexie-react-hooks'
import { getSyncConfig, getSyncCursor } from '@/lib/sync/syncMeta'
import { useSyncStore } from '@/features/sync/syncStore'
import type { GitHubSyncConfig } from '@/types/sync'

export interface SyncStatus {
  config: GitHubSyncConfig | null
  isSyncing: boolean
  lastSyncedAt?: string
  lastError?: string
}

export function useSyncStatus(): SyncStatus {
  const isSyncing = useSyncStore((s) => s.isSyncing)
  const config = useLiveQuery(() => getSyncConfig(), []) ?? null
  const cursor = useLiveQuery(() => getSyncCursor(), [])

  return {
    config,
    isSyncing,
    lastSyncedAt: cursor?.lastSyncedAt,
    lastError: cursor?.lastError,
  }
}

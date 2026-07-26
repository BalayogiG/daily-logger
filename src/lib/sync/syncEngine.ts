import { db } from '@/lib/db/db'
import { buildDatabase, parseDatabase } from '@/lib/sync/sqlite'
import { getFile, putFile, bytesToBase64, base64ToBytes, GitHubApiError } from '@/lib/sync/githubApi'
import { isGitHubReachable } from '@/lib/sync/reachability'
import { getSyncConfig, setSyncCursor } from '@/lib/sync/syncMeta'
import { useSyncStore } from '@/features/sync/syncStore'
import type { GitHubSyncConfig } from '@/types/sync'
import type { Task } from '@/types/task'
import type { AppSettings } from '@/types/settings'

const MAX_RETRIES = 3

export type SyncResult =
  | { status: 'not-configured' }
  | { status: 'offline' }
  | { status: 'success'; syncedAt: string }
  | { status: 'error'; message: string }

export async function runSync(): Promise<SyncResult> {
  const config = await getSyncConfig()
  if (!config) return { status: 'not-configured' }

  if (!(await isGitHubReachable())) {
    await setSyncCursor({ lastError: 'Offline' })
    return { status: 'offline' }
  }

  useSyncStore.getState().setSyncing(true)
  try {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      const outcome = await attemptSync(config)
      if (outcome === 'done') {
        const syncedAt = new Date().toISOString()
        await setSyncCursor({ lastSyncedAt: syncedAt, lastError: undefined })
        return { status: 'success', syncedAt }
      }
      // 'retry': another device committed since we read — re-fetch and merge again.
    }
    throw new Error('Could not sync after multiple attempts — try again shortly')
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown sync error'
    await setSyncCursor({ lastError: message })
    return { status: 'error', message }
  } finally {
    useSyncStore.getState().setSyncing(false)
  }
}

/** Last-write-wins merge by id/updatedAt — produces the single reconciled dataset for both sides. */
function mergeById<T extends { id: string; updatedAt: string }>(local: T[], remote: T[]): T[] {
  const merged = new Map<string, T>()
  for (const item of local) merged.set(item.id, item)
  for (const item of remote) {
    const existing = merged.get(item.id)
    if (!existing || item.updatedAt > existing.updatedAt) merged.set(item.id, item)
  }
  return [...merged.values()]
}

function mergeSettings(local: AppSettings | null, remote: AppSettings | null): AppSettings | null {
  if (!local) return remote
  if (!remote) return local
  return remote.updatedAt > local.updatedAt ? remote : local
}

async function attemptSync(config: GitHubSyncConfig): Promise<'done' | 'retry'> {
  const remoteFile = await getFile(config)
  const remote = remoteFile
    ? await parseDatabase(base64ToBytes(remoteFile.contentBase64))
    : { tasks: [] as Task[], settings: null as AppSettings | null }

  const localTasks = await db.tasks.toArray()
  const localSettings = (await db.settings.get('app-settings')) ?? null

  const mergedTasks = mergeById(localTasks, remote.tasks)
  const mergedSettings = mergeSettings(localSettings, remote.settings)

  // Write the reconciled dataset back into Dexie so this device picks up anything newer from remote.
  // bulkPut on rows that are unchanged from local is a harmless no-op — dataset is small enough not to matter.
  await db.transaction('rw', db.tasks, db.settings, async () => {
    if (mergedTasks.length > 0) await db.tasks.bulkPut(mergedTasks)
    if (mergedSettings) await db.settings.put(mergedSettings)
  })

  const bytes = await buildDatabase({ tasks: mergedTasks, settings: mergedSettings })
  const contentBase64 = bytesToBase64(bytes)

  try {
    await putFile(config, contentBase64, remoteFile?.sha, 'Sync from Daily Logger')
    return 'done'
  } catch (err) {
    if (err instanceof GitHubApiError && err.status === 409) return 'retry'
    throw err
  }
}

export interface GitHubSyncConfig {
  key: 'github-config'
  owner: string
  repo: string
  path: string
  token: string
}

export interface SyncCursor {
  key: 'sync-cursor'
  lastSyncedAt?: string
  lastError?: string
}

export type SyncMetaRecord = GitHubSyncConfig | SyncCursor

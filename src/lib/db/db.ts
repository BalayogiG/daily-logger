import Dexie, { type EntityTable } from 'dexie'
import type { Task } from '@/types/task'
import type { AppSettings } from '@/types/settings'
import type { SyncMetaRecord } from '@/types/sync'

export class AppDatabase extends Dexie {
  tasks!: EntityTable<Task, 'id'>
  settings!: EntityTable<AppSettings, 'key'>
  /** Local-only: sync connection config + cursors. Never pushed to the remote. */
  syncMeta!: EntityTable<SyncMetaRecord, 'key'>

  constructor() {
    super('daily-logger')
    this.version(1).stores({
      tasks: 'id, date, completed, priority, completedAt, *tags',
      settings: '&key',
    })
    this.version(2)
      .stores({
        tasks: 'id, date, completed, priority, completedAt, isDeleted, updatedAt, *tags',
        settings: '&key',
        syncMeta: '&key',
      })
      .upgrade(async (tx) => {
        await tx
          .table('tasks')
          .toCollection()
          .modify((task) => {
            // Must be set explicitly — Dexie excludes `undefined` indexed values from equality/range queries.
            task.isDeleted = false
            task.deletedAt = undefined
          })
        const settings = await tx.table('settings').get('app-settings')
        if (settings && !settings.updatedAt) {
          await tx.table('settings').update('app-settings', { updatedAt: new Date().toISOString() })
        }
      })
  }
}

export const db = new AppDatabase()

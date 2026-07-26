import Dexie, { type EntityTable } from 'dexie'
import type { Task } from '@/types/task'
import type { AppSettings } from '@/types/settings'

export class AppDatabase extends Dexie {
  tasks!: EntityTable<Task, 'id'>
  settings!: EntityTable<AppSettings, 'key'>

  constructor() {
    super('daily-logger')
    this.version(1).stores({
      tasks: 'id, date, completed, priority, completedAt, *tags',
      settings: '&key',
    })
  }
}

export const db = new AppDatabase()

import initSqlJs, { type Database } from 'sql.js'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import type { Task } from '@/types/task'
import type { AppSettings } from '@/types/settings'

export interface SyncDataset {
  tasks: Task[]
  settings: AppSettings | null
}

let sqlPromise: ReturnType<typeof initSqlJs> | null = null

function loadSql() {
  if (!sqlPromise) sqlPromise = initSqlJs({ locateFile: () => wasmUrl })
  return sqlPromise
}

// Each row's body is stored as JSON so this schema doesn't need to change every time a
// Task/AppSettings field is added — `updatedAt` is the only column the sync engine ever
// queries on directly, everything else is round-tripped as opaque data.
const SCHEMA_SQL = `
  CREATE TABLE tasks (id TEXT PRIMARY KEY, updatedAt TEXT NOT NULL, data TEXT NOT NULL);
  CREATE TABLE settings (key TEXT PRIMARY KEY, updatedAt TEXT NOT NULL, data TEXT NOT NULL);
`

export async function buildDatabase(dataset: SyncDataset): Promise<Uint8Array> {
  const SQL = await loadSql()
  const db = new SQL.Database()
  db.run(SCHEMA_SQL)

  const insertTask = db.prepare('INSERT INTO tasks (id, updatedAt, data) VALUES (?, ?, ?)')
  for (const task of dataset.tasks) {
    insertTask.run([task.id, task.updatedAt, JSON.stringify(task)])
  }
  insertTask.free()

  if (dataset.settings) {
    db.run('INSERT INTO settings (key, updatedAt, data) VALUES (?, ?, ?)', [
      dataset.settings.key,
      dataset.settings.updatedAt,
      JSON.stringify(dataset.settings),
    ])
  }

  const bytes = db.export()
  db.close()
  return bytes
}

export async function parseDatabase(bytes: Uint8Array): Promise<SyncDataset> {
  const SQL = await loadSql()
  const db = new SQL.Database(bytes)
  try {
    return { tasks: readAll<Task>(db, 'tasks'), settings: readAll<AppSettings>(db, 'settings')[0] ?? null }
  } finally {
    db.close()
  }
}

function readAll<T>(db: Database, table: 'tasks' | 'settings'): T[] {
  const result = db.exec(`SELECT data FROM ${table}`)
  if (result.length === 0) return []
  return result[0].values.map(([data]) => JSON.parse(data as string) as T)
}

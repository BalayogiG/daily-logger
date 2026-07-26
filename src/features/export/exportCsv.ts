import Papa from 'papaparse'
import { db } from '@/lib/db/db'
import { downloadBlob, dateStamp } from '@/lib/download'

export async function exportCsv() {
  const tasks = await db.tasks.toArray()
  const rows = tasks
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((t) => ({
      date: t.date,
      title: t.title,
      description: t.description ?? '',
      completed: t.completed ? 'yes' : 'no',
      completedAt: t.completedAt ?? '',
      priority: t.priority,
      tags: t.tags.join(';'),
      notes: t.notes ?? '',
    }))
  const csv = Papa.unparse(rows)
  downloadBlob(csv, 'text/csv', `daily-logger-tasks-${dateStamp()}.csv`)
}

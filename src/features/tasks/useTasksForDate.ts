import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db/db'
import type { Task } from '@/types/task'

export function useTasksForDate(date: string): Task[] {
  const tasks = useLiveQuery(
    () =>
      db.tasks
        .where('date')
        .equals(date)
        .filter((t) => !t.isDeleted)
        .sortBy('createdAt'),
    [date],
  )
  return tasks ?? []
}

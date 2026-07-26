import { db } from '@/lib/db/db'
import type { Priority, Task } from '@/types/task'

const SAMPLE_TITLES = [
  'Finished literature review',
  'Gym workout',
  'Fixed authentication bug',
  'Read 20 pages',
  'Wrote unit tests',
  'Reviewed pull request',
  'Meal prep for the week',
  'Practiced guitar',
  'Cleaned inbox to zero',
  'Went for a run',
  'Updated project docs',
  'Paid bills',
  'Called a friend',
  'Refactored auth module',
  'Studied Spanish',
]

const SAMPLE_TAGS = ['work', 'health', 'learning', 'personal', 'code', 'chores']
const PRIORITIES: Priority[] = ['low', 'medium', 'high']

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function toDateKey(d: Date) {
  return d.toISOString().slice(0, 10)
}

/** Dev-only helper: generates ~a year of pseudo-random completed tasks. */
export async function seedDemoData(days = 365) {
  const now = new Date()
  const tasks: Task[] = []

  for (let i = 0; i < days; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateKey = toDateKey(date)

    // Weighted random: most days 0-3 tasks, occasional bursts up to 8
    const roll = Math.random()
    const count = roll < 0.3 ? 0 : roll < 0.6 ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 6) + 2

    for (let t = 0; t < count; t++) {
      const createdAt = new Date(date)
      createdAt.setHours(9 + t, 0, 0, 0)
      const id = crypto.randomUUID()
      tasks.push({
        id,
        title: randomItem(SAMPLE_TITLES),
        description: undefined,
        completed: true,
        completedAt: createdAt.toISOString(),
        priority: randomItem(PRIORITIES),
        tags: Math.random() < 0.6 ? [randomItem(SAMPLE_TAGS)] : [],
        notes: undefined,
        date: dateKey,
        createdAt: createdAt.toISOString(),
        updatedAt: createdAt.toISOString(),
        isDeleted: false,
      })
    }
  }

  await db.tasks.bulkAdd(tasks)
  return tasks.length
}

export async function clearAllTasks() {
  await db.tasks.clear()
}

if (import.meta.env.DEV) {
  // Expose for manual invocation via browser devtools console during development.
  ;(window as unknown as Record<string, unknown>).__seedDemoData = seedDemoData
  ;(window as unknown as Record<string, unknown>).__clearAllTasks = clearAllTasks
}

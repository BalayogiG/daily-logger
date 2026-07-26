import { db } from '@/lib/db/db'
import { computeCurrentStreak, getActiveDateSet, getCrossedMilestone } from '@/features/stats/streakEngine'
import { useUiStore } from '@/store/uiStore'
import type { TaskFormValues } from '@/features/tasks/taskFormSchema'

function nowIso() {
  return new Date().toISOString()
}

async function checkMilestone() {
  const tasks = (await db.tasks.toArray()).filter((t) => !t.isDeleted)
  const streak = computeCurrentStreak(getActiveDateSet(tasks))
  const milestone = getCrossedMilestone(streak)
  if (milestone) {
    useUiStore.getState().setCelebrationMilestone(milestone)
  }
}

export async function addTask(values: TaskFormValues) {
  const timestamp = nowIso()
  await db.tasks.add({
    id: crypto.randomUUID(),
    title: values.title,
    description: values.description || undefined,
    completed: values.completed,
    completedAt: values.completed ? (values.completedAt ?? timestamp) : undefined,
    priority: values.priority,
    tags: values.tags,
    notes: values.notes || undefined,
    date: values.date,
    createdAt: timestamp,
    updatedAt: timestamp,
    isDeleted: false,
  })
  if (values.completed) await checkMilestone()
}

export async function updateTask(id: string, values: TaskFormValues) {
  await db.tasks.update(id, {
    title: values.title,
    description: values.description || undefined,
    completed: values.completed,
    completedAt: values.completed ? (values.completedAt ?? nowIso()) : undefined,
    priority: values.priority,
    tags: values.tags,
    notes: values.notes || undefined,
    date: values.date,
    updatedAt: nowIso(),
  })
  if (values.completed) await checkMilestone()
}

export async function deleteTask(id: string) {
  const timestamp = nowIso()
  await db.tasks.update(id, { isDeleted: true, deletedAt: timestamp, updatedAt: timestamp })
}

export async function toggleTaskCompleted(id: string) {
  const task = await db.tasks.get(id)
  if (!task) return
  const completed = !task.completed
  await db.tasks.update(id, {
    completed,
    completedAt: completed ? nowIso() : undefined,
    updatedAt: nowIso(),
  })
  if (completed) await checkMilestone()
}

export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  completedAt?: string
  priority: Priority
  tags: string[]
  notes?: string
  /** YYYY-MM-DD, the day this task belongs to */
  date: string
  createdAt: string
  updatedAt: string
  /** Soft-delete tombstone — hard delete only happens via the periodic purge, so sync can propagate the deletion. */
  isDeleted: boolean
  deletedAt?: string
}

export type TaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'deletedAt'>

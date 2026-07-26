import { format, parseISO } from 'date-fns'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TaskItem } from '@/features/tasks/TaskItem'
import { useTasksForDate } from '@/features/tasks/useTasksForDate'
import { useUiStore } from '@/store/uiStore'
import type { Task } from '@/types/task'

export function TaskListForDay() {
  const selectedDate = useUiStore((s) => s.selectedDate)
  const openTaskForm = useUiStore((s) => s.openTaskForm)
  const tasks = useTasksForDate(selectedDate)
  const completedCount = tasks.filter((t) => t.completed).length

  const handleEdit = (task: Task) => openTaskForm({ mode: 'edit', taskId: task.id, date: task.date })

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="font-heading text-sm font-semibold">{format(parseISO(selectedDate), 'EEEE, MMM d')}</h2>
        <p className="text-xs text-muted-foreground">
          {completedCount} of {tasks.length} completed
        </p>
      </div>

      <Button
        size="sm"
        variant="outline"
        className="justify-start gap-1.5"
        onClick={() => openTaskForm({ mode: 'add', date: selectedDate })}
      >
        <Plus className="size-3.5" />
        Add task
      </Button>

      <div className="flex flex-col gap-0.5">
        {tasks.length === 0 && (
          <p className="py-6 text-center text-xs text-muted-foreground">No tasks yet for this day.</p>
        )}
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onEdit={handleEdit} />
        ))}
      </div>
    </div>
  )
}

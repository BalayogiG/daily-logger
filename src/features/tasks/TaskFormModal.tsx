import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db/db'
import { ResponsiveModal } from '@/components/layout/ResponsiveModal'
import { TaskForm } from '@/features/tasks/TaskForm'
import { useUiStore } from '@/store/uiStore'

export function TaskFormModal() {
  const isOpen = useUiStore((s) => s.isTaskFormOpen)
  const mode = useUiStore((s) => s.taskFormMode)
  const editingTaskId = useUiStore((s) => s.editingTaskId)
  const selectedDate = useUiStore((s) => s.selectedDate)
  const closeTaskForm = useUiStore((s) => s.closeTaskForm)

  const existingTask = useLiveQuery(
    () => (editingTaskId ? db.tasks.get(editingTaskId) : undefined),
    [editingTaskId],
  )

  const isReady = mode === 'add' || !!existingTask

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={(open) => !open && closeTaskForm()}
      title={mode === 'edit' ? 'Edit task' : 'Add task'}
    >
      {isOpen && isReady && (
        <TaskForm
          key={mode === 'edit' ? existingTask?.id : 'add'}
          mode={mode}
          date={selectedDate}
          existingTask={mode === 'edit' ? existingTask : undefined}
          onDone={closeTaskForm}
        />
      )}
    </ResponsiveModal>
  )
}

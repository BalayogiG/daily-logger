import { format, parseISO } from 'date-fns'
import { Plus } from 'lucide-react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { useIsDesktop } from '@/hooks/useMediaQuery'
import { useUiStore } from '@/store/uiStore'
import { useTasksForDate } from '@/features/tasks/useTasksForDate'
import { TaskItem } from '@/features/tasks/TaskItem'
import type { Task } from '@/types/task'

/** Mobile-only bottom sheet shown when tapping a day cell. No-ops on desktop (hover popover handles that). */
export function DayDetailSheet() {
  const isDesktop = useIsDesktop()
  const isOpen = useUiStore((s) => s.isDayDetailOpen)
  const closeDayDetail = useUiStore((s) => s.closeDayDetail)
  const selectedDate = useUiStore((s) => s.selectedDate)
  const openTaskForm = useUiStore((s) => s.openTaskForm)
  const tasks = useTasksForDate(selectedDate)

  if (isDesktop) return null

  const completedCount = tasks.filter((t) => t.completed).length
  const handleEdit = (task: Task) => {
    closeDayDetail()
    openTaskForm({ mode: 'edit', taskId: task.id, date: task.date })
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && closeDayDetail()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{format(parseISO(selectedDate), 'EEEE, MMM d')}</DrawerTitle>
          <DrawerDescription>
            {completedCount} of {tasks.length} completed
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-2 overflow-y-auto px-4 pb-6">
          <Button
            size="sm"
            variant="outline"
            className="min-h-11 justify-start gap-1.5"
            onClick={() => {
              closeDayDetail()
              openTaskForm({ mode: 'add', date: selectedDate })
            }}
          >
            <Plus className="size-3.5" />
            Add task
          </Button>

          {tasks.length === 0 && (
            <p className="py-6 text-center text-xs text-muted-foreground">No tasks yet for this day.</p>
          )}
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onEdit={handleEdit} />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

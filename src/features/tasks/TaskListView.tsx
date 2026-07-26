import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { TaskItem } from '@/features/tasks/TaskItem'
import { SearchBar } from '@/features/search/SearchBar'
import { FilterPanel } from '@/features/search/FilterPanel'
import { useTaskSearch } from '@/features/search/useTaskSearch'
import { useIsDesktop } from '@/hooks/useMediaQuery'
import { useUiStore } from '@/store/uiStore'
import type { Task } from '@/types/task'

function groupByDate(tasks: Task[]) {
  const groups = new Map<string, Task[]>()
  for (const task of tasks) {
    const list = groups.get(task.date) ?? []
    list.push(task)
    groups.set(task.date, list)
  }
  return [...groups.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1))
}

export function TaskListView() {
  const isDesktop = useIsDesktop()
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const openTaskForm = useUiStore((s) => s.openTaskForm)
  const tasks = useTaskSearch()
  const grouped = groupByDate(tasks)

  const handleEdit = (task: Task) => openTaskForm({ mode: 'edit', taskId: task.id, date: task.date })

  return (
    <div className="flex flex-col gap-5 p-4 md:p-0">
      {!isDesktop && (
        <div className="flex gap-2">
          <div className="flex-1">
            <SearchBar />
          </div>
          <Button
            variant="outline"
            size="icon"
            aria-label="Filters"
            className="min-h-11 min-w-11"
            onClick={() => setFilterSheetOpen(true)}
          >
            <SlidersHorizontal className="size-4" />
          </Button>
        </div>
      )}

      {grouped.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No tasks match your search or filters.
        </p>
      )}
      {grouped.map(([date, dayTasks]) => (
        <div key={date}>
          <h3 className="mb-1.5 text-xs font-semibold text-muted-foreground">
            {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
          </h3>
          <div className="flex flex-col gap-0.5">
            {dayTasks.map((task) => (
              <TaskItem key={task.id} task={task} onEdit={handleEdit} />
            ))}
          </div>
        </div>
      ))}

      <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
        <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto rounded-t-xl">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-6">
            <FilterPanel />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

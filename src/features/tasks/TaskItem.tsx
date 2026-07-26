import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { toggleTaskCompleted } from '@/features/tasks/useTaskMutations'
import type { Task } from '@/types/task'

const PRIORITY_STYLES: Record<Task['priority'], string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  high: 'bg-red-500/15 text-red-600 dark:text-red-400',
}

export function TaskItem({ task, onEdit }: { task: Task; onEdit: (task: Task) => void }) {
  return (
    <div className="group flex items-start gap-3 rounded-lg border border-transparent px-2 py-2 hover:border-border hover:bg-muted/40">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          toggleTaskCompleted(task.id)
        }}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        className={cn(
          'relative mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors after:absolute after:-inset-2.5 after:content-[""]',
          task.completed ? 'border-primary bg-primary' : 'border-muted-foreground/40',
        )}
      >
        <AnimatePresence>
          {task.completed && (
            <motion.span
              key="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              <Check className="size-3.5 text-primary-foreground" strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
        {task.completed && (
          <motion.span
            key="ripple"
            initial={{ scale: 0.5, opacity: 0.5 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 rounded-full bg-primary"
          />
        )}
      </button>

      <button type="button" onClick={() => onEdit(task)} className="flex-1 text-left">
        <p className={cn('text-sm font-medium', task.completed && 'text-muted-foreground line-through')}>
          {task.title}
        </p>
        {(task.tags.length > 0 || task.priority !== 'medium') && (
          <div className="mt-1 flex flex-wrap items-center gap-1">
            <Badge className={cn('h-4.5 px-1.5 text-[10px]', PRIORITY_STYLES[task.priority])} variant="ghost">
              {task.priority}
            </Badge>
            {task.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="h-4.5 px-1.5 text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </button>
    </div>
  )
}

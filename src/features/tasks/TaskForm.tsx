import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TagInput } from '@/features/tasks/TagInput'
import { taskFormDefaults, taskFormSchema, type TaskFormValues } from '@/features/tasks/taskFormSchema'
import { addTask, deleteTask, updateTask } from '@/features/tasks/useTaskMutations'
import type { Task } from '@/types/task'

function timeFromIso(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function isoFromDateAndTime(dateStr: string, timeStr: string) {
  const [h, m] = (timeStr || '00:00').split(':').map(Number)
  const [y, mo, da] = dateStr.split('-').map(Number)
  return new Date(y, mo - 1, da, h, m).toISOString()
}

function currentTime() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

interface TaskFormProps {
  mode: 'add' | 'edit'
  date: string
  existingTask?: Task
  onDone: () => void
}

export function TaskForm({ mode, date, existingTask, onDone }: TaskFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: existingTask
      ? {
          title: existingTask.title,
          description: existingTask.description ?? '',
          completed: existingTask.completed,
          priority: existingTask.priority,
          tags: existingTask.tags,
          notes: existingTask.notes ?? '',
          date: existingTask.date,
          completedAt: existingTask.completedAt,
        }
      : taskFormDefaults(date),
  })

  const completed = watch('completed')
  const completedAt = watch('completedAt')

  useEffect(() => {
    if (completed && !completedAt) {
      setValue('completedAt', isoFromDateAndTime(watch('date'), currentTime()))
    }
    if (!completed) {
      setValue('completedAt', undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed])

  const onSubmit = async (values: TaskFormValues) => {
    try {
      if (mode === 'edit' && existingTask) {
        await updateTask(existingTask.id, values)
        toast.success('Task updated')
      } else {
        await addTask(values)
        toast.success('Task added')
      }
      onDone()
    } catch {
      toast.error('Something went wrong saving the task')
    }
  }

  const onDelete = async () => {
    if (!existingTask) return
    await deleteTask(existingTask.id)
    toast.success('Task deleted')
    onDone()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" autoFocus {...register('title')} placeholder="Finished literature review" />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} placeholder="Optional details" rows={2} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" {...register('date')} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Priority</Label>
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Tags</Label>
        <Controller
          control={control}
          name="tags"
          render={({ field }) => <TagInput value={field.value} onChange={field.onChange} />}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-input px-3 py-2.5">
        <div className="flex flex-col">
          <Label htmlFor="completed">Completed</Label>
          {completed && (
            <Input
              type="time"
              value={timeFromIso(completedAt)}
              onChange={(e) => setValue('completedAt', isoFromDateAndTime(watch('date'), e.target.value))}
              className="mt-1.5 h-7 w-28 text-xs"
            />
          )}
        </div>
        <Controller
          control={control}
          name="completed"
          render={({ field }) => (
            <Switch id="completed" checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" {...register('notes')} placeholder="Optional notes" rows={2} />
      </div>

      <div className="flex gap-2 pt-1">
        {mode === 'edit' && (
          <Button type="button" variant="destructive" onClick={onDelete} className="mr-auto">
            Delete
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="ml-auto">
          {mode === 'edit' ? 'Save changes' : 'Add task'}
        </Button>
      </div>
    </form>
  )
}

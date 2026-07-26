import { z } from 'zod'

export const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  completed: z.boolean(),
  priority: z.enum(['low', 'medium', 'high']),
  tags: z.array(z.string().min(1)).max(20),
  notes: z.string().max(2000).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  completedAt: z.string().optional(),
})

export type TaskFormValues = z.infer<typeof taskFormSchema>

export const taskFormDefaults = (date: string): TaskFormValues => ({
  title: '',
  description: '',
  completed: false,
  priority: 'medium',
  tags: [],
  notes: '',
  date,
  completedAt: undefined,
})

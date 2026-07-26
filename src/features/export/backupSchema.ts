import { z } from 'zod'

const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  completed: z.boolean(),
  completedAt: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  tags: z.array(z.string()),
  notes: z.string().optional(),
  date: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

const settingsSchema = z.object({
  key: z.literal('app-settings'),
  theme: z.enum(['light', 'dark', 'system']),
  weekStartsOn: z.union([z.literal(0), z.literal(1)]),
  intensityThresholds: z.tuple([z.number(), z.number(), z.number(), z.number()]),
  intensityColorsLight: z.tuple([z.string(), z.string(), z.string(), z.string(), z.string()]),
  intensityColorsDark: z.tuple([z.string(), z.string(), z.string(), z.string(), z.string()]),
  reminderEnabled: z.boolean(),
  reminderTime: z.string(),
  lastViewedYear: z.number(),
})

export const backupSchema = z.object({
  version: z.number(),
  exportedAt: z.string(),
  tasks: z.array(taskSchema),
  settings: settingsSchema.optional(),
})

export type Backup = z.infer<typeof backupSchema>

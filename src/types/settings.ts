export type ThemeMode = 'light' | 'dark' | 'system'

export type WeekStartsOn = 0 | 1 // 0 = Sunday, 1 = Monday

/** Lower bounds for buckets 1-4 (bucket 0 is always count === 0). e.g. [1,2,4,7] */
export type IntensityThresholds = [number, number, number, number]

/** 5 colors, bucket 0 (no tasks) through bucket 4 (highest intensity) */
export type IntensityColors = [string, string, string, string, string]

export interface AppSettings {
  key: 'app-settings'
  theme: ThemeMode
  weekStartsOn: WeekStartsOn
  intensityThresholds: IntensityThresholds
  intensityColorsLight: IntensityColors
  intensityColorsDark: IntensityColors
  reminderEnabled: boolean
  reminderTime: string // 'HH:mm'
  lastViewedYear: number
  updatedAt: string
}

export const DEFAULT_INTENSITY_THRESHOLDS: IntensityThresholds = [1, 2, 4, 7]

export const DEFAULT_INTENSITY_COLORS: IntensityColors = [
  '#ebedf0', // 0 tasks - light gray
  '#9be9a8', // 1 task - light green
  '#40c463', // 2-3 tasks - medium green
  '#30a14e', // 4-6 tasks - dark green
  '#216e39', // 7+ tasks - very dark green
]

export const DEFAULT_INTENSITY_COLORS_DARK: IntensityColors = [
  '#161b22', // 0 tasks
  '#0e4429', // 1 task
  '#006d32', // 2-3 tasks
  '#26a641', // 4-6 tasks
  '#39d353', // 7+ tasks
]

export const DEFAULT_SETTINGS: AppSettings = {
  key: 'app-settings',
  theme: 'system',
  weekStartsOn: 1,
  intensityThresholds: DEFAULT_INTENSITY_THRESHOLDS,
  intensityColorsLight: DEFAULT_INTENSITY_COLORS,
  intensityColorsDark: DEFAULT_INTENSITY_COLORS_DARK,
  reminderEnabled: false,
  reminderTime: '20:00',
  lastViewedYear: new Date().getFullYear(),
  updatedAt: new Date().toISOString(),
}

export interface DayCount {
  date: string // YYYY-MM-DD
  total: number
  completed: number
}

export type DayCountMap = Map<string, DayCount>

export interface StreakStats {
  currentStreak: number
  longestStreak: number
  activeDays: number
  perfectWeeks: number
}

export interface StatsSummary {
  today: number
  thisWeek: number
  thisMonth: number
  total: number
  longestStreak: number
  currentStreak: number
  mostProductiveDay: string | null // weekday name
  averagePerDay: number
  completionPercentage: number
}

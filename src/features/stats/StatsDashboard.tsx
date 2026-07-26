import { CheckCircle2, CalendarDays, CalendarRange, ListChecks, Flame, Trophy, TrendingUp, Percent, Star } from 'lucide-react'
import { StatCard } from '@/features/stats/StatCard'
import { WeeklyBarChart } from '@/features/stats/WeeklyBarChart'
import { BreakdownChart } from '@/features/stats/BreakdownChart'
import { useStats } from '@/features/stats/useStats'

export function StatsDashboard() {
  const stats = useStats()

  const cards = [
    { label: 'Today', value: stats.today, icon: CheckCircle2 },
    { label: 'This week', value: stats.thisWeek, icon: CalendarDays },
    { label: 'This month', value: stats.thisMonth, icon: CalendarRange },
    { label: 'Total tasks', value: stats.total, icon: ListChecks },
    { label: 'Current streak', value: stats.currentStreak, icon: Flame, accent: 'text-orange-500' },
    { label: 'Longest streak', value: stats.longestStreak, icon: Trophy, accent: 'text-amber-500' },
    { label: 'Avg tasks/day', value: stats.averagePerDay, icon: TrendingUp, decimals: 1 },
    { label: 'Completion rate', value: stats.completionPercentage, icon: Percent, decimals: 0, suffix: '%' },
  ]

  return (
    <div className="flex flex-col gap-4 p-4 md:p-0">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
        <div className="col-span-2 flex flex-col justify-center gap-1 rounded-xl bg-card p-4 ring-1 ring-foreground/10 md:col-span-4">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Star className="size-4" />
            Most productive day
          </div>
          <p className="font-heading text-xl font-semibold">{stats.mostProductiveDay ?? '—'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <WeeklyBarChart />
        <BreakdownChart />
      </div>
    </div>
  )
}

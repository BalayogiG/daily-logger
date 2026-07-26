import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useSettings } from '@/features/settings/useSettings'
import { useAllTasks } from '@/features/stats/useStats'
import { getWeekdayLabels } from '@/features/calendar/calendarMath'

export function WeeklyBarChart() {
  const settings = useSettings()
  const tasks = useAllTasks()
  const labels = getWeekdayLabels(settings.weekStartsOn)

  const data = useMemo(() => {
    const totals = new Array(7).fill(0) as number[]
    for (const task of tasks) {
      if (!task.completed) continue
      const jsDay = new Date(task.date).getDay() // 0=Sun..6=Sat
      const index = settings.weekStartsOn === 1 ? (jsDay + 6) % 7 : jsDay
      totals[index]++
    }
    return labels.map((label, i) => ({ day: label, tasks: totals[i] }))
  }, [tasks, labels, settings.weekStartsOn])

  return (
    <Card className="p-4">
      <CardHeader className="px-0">
        <CardTitle className="text-sm">Tasks by weekday</CardTitle>
      </CardHeader>
      <CardContent className="h-56 px-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: 'var(--muted)' }}
              contentStyle={{
                background: 'var(--popover)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                fontSize: 12,
                color: 'var(--popover-foreground)',
              }}
            />
            <Bar dataKey="tasks" fill="var(--primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

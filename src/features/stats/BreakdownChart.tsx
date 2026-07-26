import { useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useAllTasks } from '@/features/stats/useStats'
import type { Priority } from '@/types/task'

const PRIORITY_COLORS: Record<Priority, string> = {
  low: '#3b82f6',
  medium: '#f59e0b',
  high: '#ef4444',
}

export function BreakdownChart() {
  const tasks = useAllTasks()

  const data = useMemo(() => {
    const counts: Record<Priority, number> = { low: 0, medium: 0, high: 0 }
    for (const task of tasks) {
      if (task.completed) counts[task.priority]++
    }
    return (Object.entries(counts) as [Priority, number][])
      .filter(([, count]) => count > 0)
      .map(([priority, count]) => ({ name: priority, value: count }))
  }, [tasks])

  return (
    <Card className="p-4">
      <CardHeader className="px-0">
        <CardTitle className="text-sm">Completed by priority</CardTitle>
      </CardHeader>
      <CardContent className="h-56 px-0">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No completed tasks yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={PRIORITY_COLORS[entry.name as Priority]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--popover)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontSize: 12,
                  color: 'var(--popover-foreground)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

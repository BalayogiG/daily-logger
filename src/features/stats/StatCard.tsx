import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { AnimatedNumber } from '@/features/stats/AnimatedNumber'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: number
  icon: LucideIcon
  decimals?: number
  suffix?: string
  accent?: string
}

export function StatCard({ label, value, icon: Icon, decimals = 0, suffix = '', accent }: StatCardProps) {
  return (
    <Card className="gap-1.5 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Icon className={cn('size-4 text-muted-foreground', accent)} />
      </div>
      <p className="font-heading text-2xl font-semibold tabular-nums">
        <AnimatedNumber value={value} decimals={decimals} suffix={suffix} />
      </p>
    </Card>
  )
}

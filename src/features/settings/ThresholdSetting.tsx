import { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useSettings, updateSettings } from '@/features/settings/useSettings'
import type { IntensityThresholds } from '@/types/settings'

const BUCKET_LABELS = ['1 task starts at', '2–3 tasks starts at', '4–6 tasks starts at', '7+ tasks starts at']

export function ThresholdSetting() {
  const settings = useSettings()
  const [drafts, setDrafts] = useState<IntensityThresholds>(settings.intensityThresholds)

  useEffect(() => setDrafts(settings.intensityThresholds), [settings.intensityThresholds])

  const commit = (index: number, raw: string) => {
    const value = Math.max(1, Number(raw) || 1)
    const next = [...drafts] as IntensityThresholds
    next[index] = value
    setDrafts(next)
    updateSettings({ intensityThresholds: next })
  }

  return (
    <div className="flex flex-col gap-3">
      <Label>Intensity thresholds</Label>
      <div className="grid grid-cols-2 gap-3">
        {BUCKET_LABELS.map((label, i) => (
          <div key={label} className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{label}</span>
            <Input
              type="number"
              min={1}
              value={drafts[i]}
              onChange={(e) => commit(i, e.target.value)}
              className="h-8 w-20"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

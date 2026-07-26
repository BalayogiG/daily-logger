import { RotateCcw } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useSettings, updateSettings } from '@/features/settings/useSettings'
import { DEFAULT_INTENSITY_COLORS, DEFAULT_INTENSITY_COLORS_DARK, type IntensityColors } from '@/types/settings'

function PaletteRow({
  label,
  colors,
  onChange,
  onReset,
}: {
  label: string
  colors: IntensityColors
  onChange: (colors: IntensityColors) => void
  onReset: () => void
}) {
  const setColor = (index: number, value: string) => {
    const next = [...colors] as IntensityColors
    next[index] = value
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Button variant="ghost" size="icon-xs" onClick={onReset} aria-label={`Reset ${label} colors`}>
          <RotateCcw className="size-3" />
        </Button>
      </div>
      <div className="flex gap-2">
        {colors.map((color, i) => (
          <label
            key={i}
            className="relative size-8 cursor-pointer overflow-hidden rounded-md ring-1 ring-inset ring-border"
            style={{ backgroundColor: color }}
          >
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(i, e.target.value)}
              className="absolute inset-0 size-full cursor-pointer opacity-0"
            />
          </label>
        ))}
      </div>
    </div>
  )
}

export function ColorPaletteSetting() {
  const settings = useSettings()

  return (
    <div className="flex flex-col gap-3">
      <Label>Color palette</Label>
      <PaletteRow
        label="Light theme"
        colors={settings.intensityColorsLight}
        onChange={(colors) => updateSettings({ intensityColorsLight: colors })}
        onReset={() => updateSettings({ intensityColorsLight: DEFAULT_INTENSITY_COLORS })}
      />
      <PaletteRow
        label="Dark theme"
        colors={settings.intensityColorsDark}
        onChange={(colors) => updateSettings({ intensityColorsDark: colors })}
        onReset={() => updateSettings({ intensityColorsDark: DEFAULT_INTENSITY_COLORS_DARK })}
      />
    </div>
  )
}

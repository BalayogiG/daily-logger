import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ThemeSetting } from '@/features/settings/ThemeSetting'
import { ColorPaletteSetting } from '@/features/settings/ColorPaletteSetting'
import { ThresholdSetting } from '@/features/settings/ThresholdSetting'
import { WeekStartSetting } from '@/features/settings/WeekStartSetting'
import { ReminderSetting } from '@/features/settings/ReminderSetting'
import { ExportPanel } from '@/features/export/ExportPanel'

export function SettingsView() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-0">
      <Card className="flex flex-col gap-4 p-4">
        <ThemeSetting />
        <ColorPaletteSetting />
        <WeekStartSetting />
        <ThresholdSetting />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <ReminderSetting />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Export &amp; backup</CardTitle>
        </CardHeader>
        <CardContent>
          <ExportPanel />
        </CardContent>
      </Card>
    </div>
  )
}

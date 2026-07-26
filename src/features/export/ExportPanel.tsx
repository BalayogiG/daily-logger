import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { FileJson, FileSpreadsheet, FileText, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { exportJson } from '@/features/export/exportJson'
import { parseBackupFile, restoreBackup } from '@/features/export/importBackup'

// Dynamically imported so the heavy papaparse/jspdf libraries only load when actually used.
const loadCsv = () => import('@/features/export/exportCsv').then((m) => m.exportCsv())
const loadPdf = () => import('@/features/export/exportPdf').then((m) => m.exportPdf())

export function ExportPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const run = async (key: string, fn: () => Promise<void>, successMessage: string) => {
    setBusy(key)
    try {
      await fn()
      toast.success(successMessage)
    } catch {
      toast.error('Something went wrong, please try again')
    } finally {
      setBusy(null)
    }
  }

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    try {
      const backup = await parseBackupFile(file)
      const confirmed = window.confirm(
        `This will replace all local data with the ${backup.tasks.length} task(s) from this backup. This cannot be undone. Continue?`,
      )
      if (!confirmed) return
      await restoreBackup(backup)
      toast.success('Backup restored')
    } catch {
      toast.error('That file could not be read as a valid backup')
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-col gap-1 py-3"
          disabled={busy !== null}
          onClick={() => run('csv', loadCsv, 'CSV exported')}
        >
          <FileSpreadsheet className="size-4" />
          CSV
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-col gap-1 py-3"
          disabled={busy !== null}
          onClick={() => run('json', exportJson, 'JSON exported')}
        >
          <FileJson className="size-4" />
          JSON
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-col gap-1 py-3"
          disabled={busy !== null}
          onClick={() => run('pdf', loadPdf, 'PDF report generated')}
        >
          <FileText className="size-4" />
          PDF
        </Button>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-dashed border-border px-3 py-2.5">
        <div>
          <p className="text-xs font-medium">Import / restore backup</p>
          <p className="text-xs text-muted-foreground">Replaces local data from a JSON backup file</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => fileInputRef.current?.click()}>
          <Upload className="size-3.5" />
          Import
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={onFileSelected}
        />
      </div>
    </div>
  )
}

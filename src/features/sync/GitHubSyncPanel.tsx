import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getFile } from '@/lib/sync/githubApi'
import { setSyncConfig, clearSyncConfig } from '@/lib/sync/syncMeta'
import { useSyncStatus } from '@/features/sync/useSyncStatus'

// Dynamically imported so sql.js only loads once the user actually triggers a sync.
const loadRunSync = () => import('@/lib/sync/syncEngine').then((m) => m.runSync)

function formatLastSynced(iso?: string) {
  if (!iso) return 'Never synced'
  return `Last synced ${new Date(iso).toLocaleString()}`
}

export function GitHubSyncPanel() {
  const status = useSyncStatus()
  const [form, setForm] = useState({ owner: '', repo: '', path: 'data.sqlite', token: '' })
  const [connecting, setConnecting] = useState(false)

  const onConnect = async () => {
    const path = form.path.trim() || 'data.sqlite'
    if (!form.owner.trim() || !form.repo.trim() || !form.token.trim()) {
      toast.error('Owner, repo, and token are required')
      return
    }
    setConnecting(true)
    try {
      await getFile({ owner: form.owner.trim(), repo: form.repo.trim(), path, token: form.token.trim() })
      await setSyncConfig({ owner: form.owner.trim(), repo: form.repo.trim(), path, token: form.token.trim() })
      toast.success('Connected to GitHub')
    } catch {
      toast.error('Could not reach that repo — check owner, repo, and token')
    } finally {
      setConnecting(false)
    }
  }

  const onDisconnect = async () => {
    await clearSyncConfig()
    toast.success('Disconnected')
  }

  const onSyncNow = async () => {
    const runSync = await loadRunSync()
    const result = await runSync()
    if (result.status === 'success') toast.success('Synced')
    else if (result.status === 'offline') toast.error('Offline — try again when connected')
    else if (result.status === 'error') toast.error(result.message)
  }

  if (!status.config) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-xs text-muted-foreground">
          Sync tasks across your devices via a private GitHub repo. Create the repo, then a{' '}
          <span className="font-medium">fine-grained personal access token</span> scoped only to it with
          Contents: Read and write permission.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="gh-owner">Owner</Label>
            <Input
              id="gh-owner"
              className="h-8"
              value={form.owner}
              onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
              placeholder="your-username"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="gh-repo">Repo</Label>
            <Input
              id="gh-repo"
              className="h-8"
              value={form.repo}
              onChange={(e) => setForm((f) => ({ ...f, repo: e.target.value }))}
              placeholder="daily-logger-data"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="gh-path">File path</Label>
          <Input
            id="gh-path"
            className="h-8"
            value={form.path}
            onChange={(e) => setForm((f) => ({ ...f, path: e.target.value }))}
            placeholder="data.sqlite"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="gh-token">Personal access token</Label>
          <Input
            id="gh-token"
            className="h-8"
            type="password"
            autoComplete="off"
            value={form.token}
            onChange={(e) => setForm((f) => ({ ...f, token: e.target.value }))}
            placeholder="github_pat_..."
          />
        </div>
        <Button size="sm" onClick={onConnect} disabled={connecting}>
          {connecting ? 'Connecting…' : 'Connect'}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-xs font-medium">
            {status.config.owner}/{status.config.repo}
          </span>
          <span className="text-xs text-muted-foreground">
            {status.lastError ? `Sync error: ${status.lastError}` : formatLastSynced(status.lastSyncedAt)}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={onDisconnect}>
          Disconnect
        </Button>
      </div>
      <Button size="sm" onClick={onSyncNow} disabled={status.isSyncing}>
        {status.isSyncing ? 'Syncing…' : 'Sync now'}
      </Button>
    </div>
  )
}

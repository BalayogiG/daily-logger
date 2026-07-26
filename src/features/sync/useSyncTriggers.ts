import { useEffect } from 'react'

const SYNC_INTERVAL_MS = 3 * 60 * 1000 // while the tab is visible

// Dynamically imported so sql.js (~650KB wasm + glue) only loads once a sync is actually
// attempted, matching this codebase's existing lazy-loading convention for heavy libs (see
// ExportPanel's CSV/PDF loaders) — most sessions never touch sync.
function triggerSync() {
  import('@/lib/sync/syncEngine').then((m) => m.runSync())
}

function syncIfVisible() {
  if (document.visibilityState === 'visible') triggerSync()
}

/**
 * Triggers a sync on app start, whenever the tab regains focus, when the browser regains
 * connectivity, and on a periodic interval while visible. `runSync()` is a no-op (cheap, no
 * network call) if GitHub sync hasn't been configured yet, so this is safe to always mount.
 */
export function useSyncTriggers() {
  useEffect(() => {
    triggerSync()

    document.addEventListener('visibilitychange', syncIfVisible)
    window.addEventListener('online', syncIfVisible)
    const interval = window.setInterval(syncIfVisible, SYNC_INTERVAL_MS)

    return () => {
      document.removeEventListener('visibilitychange', syncIfVisible)
      window.removeEventListener('online', syncIfVisible)
      window.clearInterval(interval)
    }
  }, [])
}

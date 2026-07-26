import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ensureSettings } from '@/lib/db/ensureSettings'
import { purgeTombstones } from '@/lib/db/purgeTombstones'

if (import.meta.env.DEV) {
  import('@/lib/db/seed')
}

ensureSettings()
purgeTombstones()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

import { create } from 'zustand'

interface SyncUiState {
  isSyncing: boolean
  setSyncing: (value: boolean) => void
}

/** Ephemeral "is a sync in flight right now" flag — not persisted, unlike syncMeta's cursor. */
export const useSyncStore = create<SyncUiState>((set) => ({
  isSyncing: false,
  setSyncing: (value) => set({ isSyncing: value }),
}))

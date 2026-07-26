import { Plus } from 'lucide-react'
import { useUiStore } from '@/store/uiStore'

export function FloatingAddButton() {
  const openTaskForm = useUiStore((s) => s.openTaskForm)

  return (
    <button
      type="button"
      onClick={() => openTaskForm({ mode: 'add' })}
      aria-label="Add task"
      className="fixed right-4 bottom-20 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-95"
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
      <Plus className="size-6" strokeWidth={2.5} />
    </button>
  )
}

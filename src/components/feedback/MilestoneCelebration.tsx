import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useUiStore } from '@/store/uiStore'

export function MilestoneCelebration() {
  const milestone = useUiStore((s) => s.celebrationMilestone)
  const setCelebrationMilestone = useUiStore((s) => s.setCelebrationMilestone)

  useEffect(() => {
    if (milestone == null) return
    const timer = setTimeout(() => setCelebrationMilestone(null), 2600)
    return () => clearTimeout(timer)
  }, [milestone, setCelebrationMilestone])

  return (
    <AnimatePresence>
      {milestone != null && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-100 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex flex-col items-center gap-1 rounded-2xl bg-popover px-8 py-6 text-center shadow-xl ring-1 ring-foreground/10"
          >
            <span className="text-4xl">🔥</span>
            <p className="font-heading text-lg font-semibold">{milestone}-day streak!</p>
            <p className="text-xs text-muted-foreground">Keep it going</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { useRef } from 'react'
import type { TouchEvent } from 'react'

interface SwipeHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}

const SWIPE_THRESHOLD_PX = 50

export function useSwipe({ onSwipeLeft, onSwipeRight }: SwipeHandlers) {
  const startX = useRef<number | null>(null)

  const onTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0].clientX
  }

  const onTouchEnd = (e: TouchEvent) => {
    if (startX.current === null) return
    const deltaX = e.changedTouches[0].clientX - startX.current
    if (deltaX <= -SWIPE_THRESHOLD_PX) onSwipeLeft?.()
    else if (deltaX >= SWIPE_THRESHOLD_PX) onSwipeRight?.()
    startX.current = null
  }

  return { onTouchStart, onTouchEnd }
}

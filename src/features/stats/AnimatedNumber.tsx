import { useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

export function AnimatedNumber({ value, decimals = 0, suffix = '' }: { value: number; decimals?: number; suffix?: string }) {
  const spring = useSpring(0, { stiffness: 120, damping: 20 })

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  const display = useTransform(spring, (v) => `${v.toFixed(decimals)}${suffix}`)

  return <motion.span>{display}</motion.span>
}

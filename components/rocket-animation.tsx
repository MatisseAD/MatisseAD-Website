"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface RocketAnimationProps {
  isVisible: boolean
}

export function RocketAnimation({ isVisible }: RocketAnimationProps) {
  const [showExplosion, setShowExplosion] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    if (isVisible) {
      // Start explosion after rocket reaches center
      const explosionTimer = setTimeout(() => {
        setShowExplosion(true)

        // Generate random particles
        const newParticles = Array.from({ length: 20 }, (_, i) => ({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        }))
        setParticles(newParticles)
      }, 2000)

      // Clean up after animation
      const cleanupTimer = setTimeout(() => {
        setShowExplosion(false)
        setParticles([])
      }, 4000)

      return () => {
        clearTimeout(explosionTimer)
        clearTimeout(cleanupTimer)
      }
    } else {
      // Reset state when not visible
      setShowExplosion(false)
      setParticles([])
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Rocket */}
      <AnimatePresence>
        <motion.div
          initial={{ x: -100, y: window.innerHeight / 2, rotate: 45 }}
          animate={{
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            rotate: 45,
          }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute text-6xl"
          style={{ zIndex: 10000 }}
        >
          🚀
        </motion.div>
      </AnimatePresence>

      {/* Explosion Effect */}
      <AnimatePresence>
        {showExplosion && (
          <>
            {/* Main explosion */}
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute text-8xl"
              style={{
                left: window.innerWidth / 2 - 50,
                top: window.innerHeight / 2 - 50,
                zIndex: 10001,
              }}
            >
              💥
            </motion.div>

            {/* Screen shake effect */}
            <motion.div
              animate={{
                x: [0, -10, 10, -10, 10, 0],
                y: [0, -5, 5, -5, 5, 0],
              }}
              transition={{ duration: 0.5, repeat: 3 }}
              className="fixed inset-0 bg-red-500/20"
              style={{ zIndex: 9999 }}
            />

            {/* Particles */}
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                  scale: 1,
                  opacity: 1,
                }}
                animate={{
                  x: particle.x,
                  y: particle.y,
                  scale: 0,
                  opacity: 0,
                }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute text-2xl"
                style={{ zIndex: 10000 }}
              >
                ✨
              </motion.div>
            ))}

            {/* Glitch effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0, 1, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="fixed inset-0 bg-gradient-to-r from-red-500/30 via-transparent to-blue-500/30"
              style={{
                zIndex: 9998,
                mixBlendMode: "difference",
              }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Star, Heart } from "lucide-react"

export function EasterEgg() {
  const [isActive, setIsActive] = useState(false)
  const [sequence, setSequence] = useState<string[]>([])

  // Konami Code: ↑↑↓↓←→←→BA
  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ]

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const newSequence = [...sequence, event.code].slice(-konamiCode.length)
      setSequence(newSequence)

      if (newSequence.length === konamiCode.length && newSequence.every((key, index) => key === konamiCode[index])) {
        setIsActive(true)
        setTimeout(() => setIsActive(false), 3000)
        setSequence([])
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [sequence])

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="mx-auto w-24 h-24 relative"
            >
              <Zap className="absolute inset-0 m-auto w-16 h-16 text-yellow-400" />
              <div className="absolute inset-0 border-4 border-yellow-400/50 rounded-full animate-ping"></div>
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent"
            >
              🎮 KONAMI CODE ACTIVATED! 🎮
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground"
            >
              You found the secret! 🕹️✨
            </motion.p>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center gap-4"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.1,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 2,
                  }}
                >
                  <Star className="w-8 h-8 text-yellow-400" />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Confetti Effect */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: -50,
                rotate: 0,
              }}
              animate={{
                y: window.innerHeight + 50,
                rotate: 360,
              }}
              transition={{
                duration: 3,
                delay: Math.random() * 2,
                ease: "linear",
              }}
              className="absolute"
            >
              <Heart className="w-4 h-4 text-pink-400" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

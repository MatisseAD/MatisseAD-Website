"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Volume2, VolumeX, Music, Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { trackUserInteraction } from "@/lib/monitoring"

export function MusicPlayer() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([0.3])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsEnabled(localStorage.getItem("audio-enabled") === "true")
      const savedVolume = localStorage.getItem("audio-volume")
      if (savedVolume) {
        setVolume([Number.parseFloat(savedVolume)])
      }
    }
  }, [])

  const toggleMusic = () => {
    const newEnabled = !isEnabled
    setIsEnabled(newEnabled)
    setIsPlaying(newEnabled)

    if (typeof window !== "undefined") {
      localStorage.setItem("audio-enabled", newEnabled.toString())
    }

    trackUserInteraction("music_toggle", newEnabled ? "enabled" : "disabled")
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
    trackUserInteraction("music_play_pause", isPlaying ? "pause" : "play")
  }

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume)
    if (typeof window !== "undefined") {
      localStorage.setItem("audio-volume", newVolume[0].toString())
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-24 left-20 z-40"
    >
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            className="absolute bottom-16 left-0 mb-2"
          >
            <Card className="p-4 bg-background/90 backdrop-blur-md border-2 min-w-[200px]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Background Music</span>
                  <Button variant="ghost" size="sm" onClick={togglePlayPause} disabled={!isEnabled}>
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <VolumeX className="w-4 h-4" />
                    <Slider
                      value={volume}
                      onValueChange={handleVolumeChange}
                      max={1}
                      step={0.1}
                      className="flex-1"
                      disabled={!isEnabled}
                    />
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">Volume: {Math.round(volume[0] * 100)}%</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={toggleMusic}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        variant="outline"
        size="icon"
        className={`h-12 w-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
          isEnabled ? "bg-primary text-primary-foreground" : "bg-background/90 backdrop-blur-md"
        }`}
        aria-label="Toggle background music"
      >
        <Music className={`h-5 w-5 ${isPlaying ? "animate-pulse" : ""}`} />
      </Button>
    </motion.div>
  )
}

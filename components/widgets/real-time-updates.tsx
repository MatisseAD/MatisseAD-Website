"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Wifi, WifiOff, Activity, Users, Eye, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { trackUserInteraction } from "@/lib/monitoring"

interface LiveStats {
  activeUsers: number
  totalViews: number
  githubStars: number
  lastUpdate: string
  isConnected: boolean
}

export function RealTimeUpdates() {
  const [stats, setStats] = useState<LiveStats>({
    activeUsers: 0,
    totalViews: 0,
    githubStars: 0,
    lastUpdate: new Date().toISOString(),
    isConnected: false,
  })

  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting")

  useEffect(() => {
    // Simulate WebSocket connection for real-time updates
    let interval: NodeJS.Timeout

    const connectWebSocket = () => {
      setConnectionStatus("connecting")

      // Simulate connection delay
      setTimeout(() => {
        setConnectionStatus("connected")
        setStats((prev) => ({ ...prev, isConnected: true }))

        // Start real-time updates simulation
        interval = setInterval(() => {
          setStats((prev) => ({
            ...prev,
            activeUsers: Math.floor(Math.random() * 50) + 10,
            totalViews: prev.totalViews + Math.floor(Math.random() * 5) + 1,
            githubStars: prev.githubStars + (Math.random() > 0.95 ? 1 : 0),
            lastUpdate: new Date().toISOString(),
          }))
        }, 3000)

        trackUserInteraction("websocket_connected", "real_time_updates")
      }, 1500)
    }

    connectWebSocket()

    // Simulate occasional disconnections
    const disconnectInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        setConnectionStatus("disconnected")
        setStats((prev) => ({ ...prev, isConnected: false }))
        clearInterval(interval)

        setTimeout(() => {
          connectWebSocket()
        }, 2000)
      }
    }, 30000)

    return () => {
      clearInterval(interval)
      clearInterval(disconnectInterval)
    }
  }, [])

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <Wifi className="w-4 h-4 text-green-500" />
      case "connecting":
        return <Activity className="w-4 h-4 text-yellow-500 animate-pulse" />
      case "disconnected":
        return <WifiOff className="w-4 h-4 text-red-500" />
    }
  }

  const getConnectionBadge = () => {
    switch (connectionStatus) {
      case "connected":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Live</Badge>
      case "connecting":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Connecting</Badge>
        )
      case "disconnected":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Offline</Badge>
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="theme-transition">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {getConnectionIcon()}
              Live Analytics
            </CardTitle>
            {getConnectionBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              key={stats.activeUsers}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
              className="text-center p-3 bg-muted/50 rounded-lg"
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="w-4 h-4 text-green-500" />
                <span className="text-xs text-muted-foreground">Active</span>
              </div>
              <div className="text-xl font-bold text-green-500">{stats.activeUsers}</div>
            </motion.div>

            <motion.div
              key={stats.totalViews}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
              className="text-center p-3 bg-muted/50 rounded-lg"
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                <Eye className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-muted-foreground">Views</span>
              </div>
              <div className="text-xl font-bold text-blue-500">{stats.totalViews.toLocaleString()}</div>
            </motion.div>
          </div>

          <motion.div
            key={stats.githubStars}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3 }}
            className="text-center p-3 bg-muted/50 rounded-lg"
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-xs text-muted-foreground">GitHub Stars</span>
            </div>
            <div className="text-xl font-bold text-yellow-500">{stats.githubStars}</div>
          </motion.div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Last updated: {new Date(stats.lastUpdate).toLocaleTimeString()}
            </p>
          </div>

          <AnimatePresence>
            {connectionStatus === "disconnected" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-center p-2 bg-red-100 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
              >
                <p className="text-xs text-red-600 dark:text-red-400">Connection lost. Attempting to reconnect...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

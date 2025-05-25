"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Activity, Zap, Clock, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { trackPerformance } from "@/lib/monitoring"

interface PerformanceMetrics {
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  ttfb: number // Time to First Byte
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Collect Web Vitals
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()

      entries.forEach((entry) => {
        if (entry.entryType === "paint") {
          if (entry.name === "first-contentful-paint") {
            trackPerformance("fcp", entry.startTime)
          }
        }

        if (entry.entryType === "largest-contentful-paint") {
          trackPerformance("lcp", entry.startTime)
        }

        if (entry.entryType === "first-input") {
          trackPerformance("fid", (entry as any).processingStart - entry.startTime)
        }

        if (entry.entryType === "layout-shift") {
          if (!(entry as any).hadRecentInput) {
            trackPerformance("cls", (entry as any).value)
          }
        }
      })
    })

    observer.observe({ entryTypes: ["paint", "largest-contentful-paint", "first-input", "layout-shift"] })

    // Get navigation timing
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.requestStart
      trackPerformance("ttfb", ttfb)
    }

    // Simulate metrics for demo (replace with real Web Vitals)
    setTimeout(() => {
      setMetrics({
        fcp: 1200,
        lcp: 2100,
        fid: 45,
        cls: 0.08,
        ttfb: 180,
      })
    }, 2000)

    return () => observer.disconnect()
  }, [])

  const getScoreColor = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return "text-green-500"
    if (value <= thresholds[1]) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreProgress = (value: number, max: number) => {
    return Math.min((value / max) * 100, 100)
  }

  if (!metrics) {
    return (
      <Card className="theme-transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Performance Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="theme-transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* First Contentful Paint */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">First Contentful Paint</span>
              </div>
              <span className={`text-sm font-mono ${getScoreColor(metrics.fcp, [1800, 3000])}`}>{metrics.fcp}ms</span>
            </div>
            <Progress value={getScoreProgress(metrics.fcp, 4000)} className="h-2" />
          </div>

          {/* Largest Contentful Paint */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Largest Contentful Paint</span>
              </div>
              <span className={`text-sm font-mono ${getScoreColor(metrics.lcp, [2500, 4000])}`}>{metrics.lcp}ms</span>
            </div>
            <Progress value={getScoreProgress(metrics.lcp, 6000)} className="h-2" />
          </div>

          {/* First Input Delay */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">First Input Delay</span>
              </div>
              <span className={`text-sm font-mono ${getScoreColor(metrics.fid, [100, 300])}`}>{metrics.fid}ms</span>
            </div>
            <Progress value={getScoreProgress(metrics.fid, 500)} className="h-2" />
          </div>

          {/* Cumulative Layout Shift */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">Cumulative Layout Shift</span>
              </div>
              <span className={`text-sm font-mono ${getScoreColor(metrics.cls * 1000, [100, 250])}`}>
                {metrics.cls.toFixed(3)}
              </span>
            </div>
            <Progress value={getScoreProgress(metrics.cls * 1000, 500)} className="h-2" />
          </div>

          {/* Time to First Byte */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Time to First Byte</span>
              </div>
              <span className={`text-sm font-mono ${getScoreColor(metrics.ttfb, [800, 1800])}`}>{metrics.ttfb}ms</span>
            </div>
            <Progress value={getScoreProgress(metrics.ttfb, 3000)} className="h-2" />
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">Powered by Vercel Speed Insights</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

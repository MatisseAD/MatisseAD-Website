"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, TrendingUp, Globe, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface AnalyticsData {
  pageViews: { date: string; views: number }[]
  topCountries: { country: string; flag: string; percentage: number }[]
  deviceTypes: { type: string; percentage: number }[]
  averageSessionTime: string
  bounceRate: number
  conversionRate: number
}

export function AdvancedAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    // Simulate analytics data (replace with real Vercel Analytics API)
    setTimeout(() => {
      setAnalytics({
        pageViews: [
          { date: "Mon", views: 245 },
          { date: "Tue", views: 312 },
          { date: "Wed", views: 189 },
          { date: "Thu", views: 421 },
          { date: "Fri", views: 356 },
          { date: "Sat", views: 298 },
          { date: "Sun", views: 267 },
        ],
        topCountries: [
          { country: "United States", flag: "🇺🇸", percentage: 35 },
          { country: "France", flag: "🇫🇷", percentage: 28 },
          { country: "Germany", flag: "🇩🇪", percentage: 18 },
          { country: "United Kingdom", flag: "🇬🇧", percentage: 12 },
          { country: "Canada", flag: "🇨🇦", percentage: 7 },
        ],
        deviceTypes: [
          { type: "Desktop", percentage: 65 },
          { type: "Mobile", percentage: 30 },
          { type: "Tablet", percentage: 5 },
        ],
        averageSessionTime: "3m 42s",
        bounceRate: 24,
        conversionRate: 8.5,
      })
    }, 1000)
  }, [])

  if (!analytics) {
    return (
      <Card className="theme-transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Advanced Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-muted rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const maxViews = Math.max(...analytics.pageViews.map((d) => d.views))

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="theme-transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Advanced Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Page Views Chart */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Weekly Page Views
            </h4>
            <div className="flex items-end gap-2 h-24">
              {analytics.pageViews.map((day, index) => (
                <motion.div
                  key={day.date}
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.views / maxViews) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex-1 bg-primary/20 rounded-t flex flex-col justify-end items-center relative group"
                >
                  <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background border rounded px-2 py-1 text-xs">
                    {day.views}
                  </div>
                  <span className="text-xs text-muted-foreground mb-1">{day.date}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                <span className="text-xs text-muted-foreground">Avg. Session</span>
              </div>
              <div className="font-bold text-primary">{analytics.averageSessionTime}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span className="text-xs text-muted-foreground">Bounce Rate</span>
              </div>
              <div className="font-bold text-primary">{analytics.bounceRate}%</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1">
                <BarChart3 className="w-3 h-3" />
                <span className="text-xs text-muted-foreground">Conversion</span>
              </div>
              <div className="font-bold text-primary">{analytics.conversionRate}%</div>
            </div>
          </div>

          {/* Top Countries */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Top Countries
            </h4>
            <div className="space-y-2">
              {analytics.topCountries.map((country, index) => (
                <motion.div
                  key={country.country}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-lg">{country.flag}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{country.country}</span>
                      <span className="text-xs text-muted-foreground">{country.percentage}%</span>
                    </div>
                    <Progress value={country.percentage} className="h-1" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Device Types */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Device Types</h4>
            <div className="space-y-2">
              {analytics.deviceTypes.map((device, index) => (
                <motion.div
                  key={device.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">{device.type}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={device.percentage} className="w-16 h-2" />
                    <span className="text-xs text-muted-foreground w-8">{device.percentage}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-center pt-2 border-t">
            <p className="text-xs text-muted-foreground">Powered by Vercel Analytics</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

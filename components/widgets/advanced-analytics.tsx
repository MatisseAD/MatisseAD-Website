"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, TrendingUp, Globe, Clock, Users, Eye, MousePointer, Smartphone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface AnalyticsData {
  pageViews: { date: string; views: number; uniqueViews: number }[]
  topCountries: { country: string; flag: string; percentage: number; sessions: number }[]
  deviceTypes: { type: string; percentage: number; sessions: number; avgTime: string }[]
  topPages: { path: string; views: number; avgTime: string; bounceRate: number }[]
  hourlyData: { hour: string; visitors: number; pageViews: number }[]
  conversionFunnel: { step: string; users: number; conversionRate: number }[]
  averageSessionTime: string
  bounceRate: number
  conversionRate: number
  totalSessions: number
  newVsReturning: { new: number; returning: number }
}

export function AdvancedAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d")

  useEffect(() => {
    // Simulate enhanced analytics data
    setTimeout(() => {
      setAnalytics({
        pageViews: [
          { date: "Lun", views: 1245, uniqueViews: 892 },
          { date: "Mar", views: 1567, uniqueViews: 1123 },
          { date: "Mer", views: 1189, uniqueViews: 856 },
          { date: "Jeu", views: 1821, uniqueViews: 1345 },
          { date: "Ven", views: 1456, uniqueViews: 1087 },
          { date: "Sam", views: 1298, uniqueViews: 934 },
          { date: "Dim", views: 1067, uniqueViews: 789 },
        ],
        topCountries: [
          { country: "France", flag: "🇫🇷", percentage: 35.2, sessions: 1247 },
          { country: "États-Unis", flag: "🇺🇸", percentage: 28.1, sessions: 995 },
          { country: "Allemagne", flag: "🇩🇪", percentage: 18.3, sessions: 648 },
          { country: "Royaume-Uni", flag: "🇬🇧", percentage: 12.4, sessions: 439 },
          { country: "Canada", flag: "🇨🇦", percentage: 6.0, sessions: 213 },
        ],
        deviceTypes: [
          { type: "Desktop", percentage: 65.2, sessions: 2310, avgTime: "5m 23s" },
          { type: "Mobile", percentage: 29.8, sessions: 1056, avgTime: "3m 45s" },
          { type: "Tablette", percentage: 5.0, sessions: 177, avgTime: "4m 12s" },
        ],
        topPages: [
          { path: "/", views: 5432, avgTime: "4m 32s", bounceRate: 23.4 },
          { path: "/projects", views: 3210, avgTime: "6m 15s", bounceRate: 18.7 },
          { path: "/timeline", views: 2105, avgTime: "3m 48s", bounceRate: 31.2 },
          { path: "/contact", views: 1800, avgTime: "2m 23s", bounceRate: 45.6 },
        ],
        hourlyData: [
          { hour: "00h", visitors: 45, pageViews: 123 },
          { hour: "06h", visitors: 89, pageViews: 234 },
          { hour: "12h", visitors: 234, pageViews: 567 },
          { hour: "18h", visitors: 189, pageViews: 445 },
        ],
        conversionFunnel: [
          { step: "Visiteurs", users: 3542, conversionRate: 100 },
          { step: "Pages vues", users: 2876, conversionRate: 81.2 },
          { step: "Engagement", users: 1543, conversionRate: 43.6 },
          { step: "Contact", users: 234, conversionRate: 6.6 },
        ],
        averageSessionTime: "4m 32s",
        bounceRate: 24.3,
        conversionRate: 8.7,
        totalSessions: 3542,
        newVsReturning: { new: 67.3, returning: 32.7 },
      })
      setIsLoading(false)
    }, 1000)
  }, [selectedTimeframe])

  if (isLoading) {
    return (
      <Card className="theme-transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analytics Avancées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-muted rounded"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-20 bg-muted rounded"></div>
              <div className="h-20 bg-muted rounded"></div>
              <div className="h-20 bg-muted rounded"></div>
            </div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const maxViews = Math.max(...analytics!.pageViews.map((d) => d.views))

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="theme-transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analytics Avancées
          </CardTitle>
          <div className="flex gap-2">
            {["24h", "7d", "30d", "90d"].map((timeframe) => (
              <Badge
                key={timeframe}
                variant={selectedTimeframe === timeframe ? "default" : "outline"}
                className="cursor-pointer text-xs"
                onClick={() => setSelectedTimeframe(timeframe)}
              >
                {timeframe}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enhanced Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="w-3 h-3" />
                <span className="text-xs text-muted-foreground">Sessions</span>
              </div>
              <div className="font-bold text-primary">{analytics.totalSessions.toLocaleString()}</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-3 h-3" />
                <span className="text-xs text-muted-foreground">Durée Moy.</span>
              </div>
              <div className="font-bold text-primary">{analytics.averageSessionTime}</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3" />
                <span className="text-xs text-muted-foreground">Rebond</span>
              </div>
              <div className="font-bold text-primary">{analytics.bounceRate}%</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MousePointer className="w-3 h-3" />
                <span className="text-xs text-muted-foreground">Conversion</span>
              </div>
              <div className="font-bold text-primary">{analytics.conversionRate}%</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Eye className="w-3 h-3" />
                <span className="text-xs text-muted-foreground">Nouveaux</span>
              </div>
              <div className="font-bold text-primary">{analytics.newVsReturning.new}%</div>
            </div>
          </div>

          {/* Enhanced Page Views Chart */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Vues de Pages (7 derniers jours)
            </h4>
            <div className="flex items-end gap-2 h-32">
              {analytics.pageViews.map((day, index) => (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.views / maxViews) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="w-full bg-primary/20 rounded-t relative group flex flex-col justify-end"
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.uniqueViews / day.views) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                      className="w-full bg-primary/60 rounded-t"
                    />
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background border rounded px-2 py-1 text-xs whitespace-nowrap">
                      <div>Total: {day.views}</div>
                      <div>Unique: {day.uniqueViews}</div>
                    </div>
                  </motion.div>
                  <span className="text-xs text-muted-foreground">{day.date}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-primary/60 rounded"></div>
                <span>Vues uniques</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-primary/20 rounded"></div>
                <span>Vues totales</span>
              </div>
            </div>
          </div>

          {/* Top Pages Performance */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Performance des Pages</h4>
            <div className="space-y-2">
              {analytics.topPages.map((page, index) => (
                <motion.div
                  key={page.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{page.path}</span>
                    <Badge variant="secondary" className="text-xs">
                      {page.views.toLocaleString()} vues
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground">Temps moyen</span>
                      <div className="font-medium">{page.avgTime}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Taux de rebond</span>
                      <div className="font-medium">{page.bounceRate}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Performance</span>
                      <Progress value={100 - page.bounceRate} className="h-1 mt-1" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Enhanced Device Types */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Types d'Appareils
              </h4>
              <div className="space-y-3">
                {analytics.deviceTypes.map((device, index) => (
                  <motion.div
                    key={device.type}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{device.type}</span>
                      <Badge variant="outline" className="text-xs">
                        {device.sessions} sessions
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>Part du trafic</span>
                        <span className="font-medium">{device.percentage}%</span>
                      </div>
                      <Progress value={device.percentage} className="h-2" />
                      <div className="text-xs text-muted-foreground">Temps moyen: {device.avgTime}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Top Pays
              </h4>
              <div className="space-y-3">
                {analytics.topCountries.map((country, index) => (
                  <motion.div
                    key={country.country}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                  >
                    <span className="text-lg">{country.flag}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{country.country}</span>
                        <span className="text-xs text-muted-foreground">{country.sessions} sessions</span>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">{country.percentage}%</span>
                      </div>
                      <Progress value={country.percentage} className="h-1" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Données mises à jour toutes les 5 minutes • Dernière mise à jour: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

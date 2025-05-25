"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Globe, MapPin, Clock, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface VisitorData {
  country: string
  city: string
  flag: string
  count: number
  lastVisit: string
  percentage: number
  trend: "up" | "down" | "stable"
  coordinates: { lat: number; lng: number }
}

interface VisitorStats {
  totalVisitors: number
  uniqueCountries: number
  averageSessionTime: string
  bounceRate: number
  topReferrers: string[]
}

export function VisitorMap() {
  const [visitors, setVisitors] = useState<VisitorData[]>([])
  const [stats, setStats] = useState<VisitorStats | null>(null)
  const [currentVisitor, setCurrentVisitor] = useState<VisitorData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate enhanced visitor data
    const mockVisitors: VisitorData[] = [
      {
        country: "France",
        city: "Paris",
        flag: "🇫🇷",
        count: 1247,
        lastVisit: "2 minutes ago",
        percentage: 35.2,
        trend: "up",
        coordinates: { lat: 48.8566, lng: 2.3522 },
      },
      {
        country: "United States",
        city: "New York",
        flag: "🇺🇸",
        count: 892,
        lastVisit: "5 minutes ago",
        percentage: 25.1,
        trend: "up",
        coordinates: { lat: 40.7128, lng: -74.006 },
      },
      {
        country: "Germany",
        city: "Berlin",
        flag: "🇩🇪",
        count: 634,
        lastVisit: "10 minutes ago",
        percentage: 17.8,
        trend: "stable",
        coordinates: { lat: 52.52, lng: 13.405 },
      },
      {
        country: "United Kingdom",
        city: "London",
        flag: "🇬🇧",
        count: 421,
        lastVisit: "15 minutes ago",
        percentage: 11.9,
        trend: "down",
        coordinates: { lat: 51.5074, lng: -0.1278 },
      },
      {
        country: "Canada",
        city: "Toronto",
        flag: "🇨🇦",
        count: 356,
        lastVisit: "20 minutes ago",
        percentage: 10.0,
        trend: "up",
        coordinates: { lat: 43.6532, lng: -79.3832 },
      },
    ]

    const mockStats: VisitorStats = {
      totalVisitors: 3550,
      uniqueCountries: 47,
      averageSessionTime: "4m 32s",
      bounceRate: 23.4,
      topReferrers: ["Google", "GitHub", "Direct", "Twitter", "LinkedIn"],
    }

    setTimeout(() => {
      setVisitors(mockVisitors)
      setStats(mockStats)
      setIsLoading(false)
    }, 1000)

    // Get current visitor location with enhanced data
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            setCurrentVisitor({
              country: "France",
              city: "Votre Position",
              flag: "📍",
              count: 1,
              lastVisit: "Maintenant",
              percentage: 0,
              trend: "stable",
              coordinates: { lat: position.coords.latitude, lng: position.coords.longitude },
            })
          } catch (error) {
            console.warn("Failed to get location:", error)
          }
        },
        (error) => {
          console.warn("Geolocation denied:", error)
        },
      )
    }
  }, [])

  if (isLoading) {
    return (
      <Card className="theme-transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Carte des Visiteurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-16 bg-muted rounded"></div>
              <div className="h-16 bg-muted rounded"></div>
              <div className="h-16 bg-muted rounded"></div>
            </div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="theme-transition">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Carte des Visiteurs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enhanced Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats?.totalVisitors.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Visiteurs Totaux</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats?.uniqueCountries}</div>
            <div className="text-xs text-muted-foreground">Pays Uniques</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats?.averageSessionTime}</div>
            <div className="text-xs text-muted-foreground">Session Moyenne</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats?.bounceRate}%</div>
            <div className="text-xs text-muted-foreground">Taux de Rebond</div>
          </div>
        </div>

        {/* Current Visitor */}
        {currentVisitor && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-primary/10 rounded-lg border border-primary/20"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentVisitor.flag}</span>
              <div className="flex-1">
                <p className="font-medium text-sm flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  Vous êtes ici !
                </p>
                <p className="text-xs text-muted-foreground">{currentVisitor.city}</p>
                <p className="text-xs text-muted-foreground">
                  Lat: {currentVisitor.coordinates.lat.toFixed(4)}, Lng: {currentVisitor.coordinates.lng.toFixed(4)}
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {currentVisitor.lastVisit}
              </Badge>
            </div>
          </motion.div>
        )}

        {/* Enhanced Visitor List */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Top Pays par Visiteurs
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {visitors.map((visitor, index) => (
              <motion.div
                key={visitor.country}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{visitor.flag}</span>
                    <div>
                      <p className="text-sm font-medium">{visitor.city}</p>
                      <p className="text-xs text-muted-foreground">{visitor.country}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {visitor.count.toLocaleString()}
                      </Badge>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          visitor.trend === "up"
                            ? "bg-green-500"
                            : visitor.trend === "down"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                        }`}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{visitor.lastVisit}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Part du trafic</span>
                    <span className="font-medium">{visitor.percentage}%</span>
                  </div>
                  <Progress value={visitor.percentage} className="h-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Top Referrers */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Sources de Trafic</h4>
          <div className="flex flex-wrap gap-2">
            {stats?.topReferrers.map((referrer, index) => (
              <Badge key={referrer} variant="outline" className="text-xs">
                {referrer}
              </Badge>
            ))}
          </div>
        </div>

        <div className="text-center pt-3 border-t">
          <p className="text-xs text-muted-foreground">
            Données mises à jour en temps réel • Dernière mise à jour: il y a 30s
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

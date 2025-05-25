"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface VisitorData {
  country: string
  city: string
  flag: string
  count: number
  lastVisit: string
}

export function VisitorMap() {
  const [visitors, setVisitors] = useState<VisitorData[]>([])
  const [totalVisitors, setTotalVisitors] = useState(0)
  const [currentVisitor, setCurrentVisitor] = useState<VisitorData | null>(null)

  useEffect(() => {
    // Simulate visitor data (in production, use a real geolocation service)
    const mockVisitors: VisitorData[] = [
      { country: "France", city: "Paris", flag: "🇫🇷", count: 45, lastVisit: "2 minutes ago" },
      { country: "United States", city: "New York", flag: "🇺🇸", count: 32, lastVisit: "5 minutes ago" },
      { country: "Germany", city: "Berlin", flag: "🇩🇪", count: 28, lastVisit: "10 minutes ago" },
      { country: "United Kingdom", city: "London", flag: "🇬🇧", count: 21, lastVisit: "15 minutes ago" },
      { country: "Canada", city: "Toronto", flag: "🇨🇦", count: 18, lastVisit: "20 minutes ago" },
      { country: "Japan", city: "Tokyo", flag: "🇯🇵", count: 15, lastVisit: "25 minutes ago" },
    ]

    setVisitors(mockVisitors)
    setTotalVisitors(mockVisitors.reduce((sum, v) => sum + v.count, 0))

    // Get current visitor location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // In production, use a real IP geolocation service
            setCurrentVisitor({
              country: "France",
              city: "Your Location",
              flag: "📍",
              count: 1,
              lastVisit: "Now",
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

  return (
    <Card className="theme-transition">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Visitor Map
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{totalVisitors}</div>
            <div className="text-xs text-muted-foreground">Total Visitors</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{visitors.length}</div>
            <div className="text-xs text-muted-foreground">Countries</div>
          </div>
        </div>

        {currentVisitor && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-primary/10 rounded-lg border border-primary/20"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{currentVisitor.flag}</span>
              <div>
                <p className="font-medium text-sm">You are here!</p>
                <p className="text-xs text-muted-foreground">{currentVisitor.city}</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Recent Visitors</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {visitors.map((visitor, index) => (
              <motion.div
                key={visitor.country}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{visitor.flag}</span>
                  <div>
                    <p className="text-sm font-medium">{visitor.city}</p>
                    <p className="text-xs text-muted-foreground">{visitor.country}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="text-xs">
                    {visitor.count}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{visitor.lastVisit}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

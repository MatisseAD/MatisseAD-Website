"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Activity, Users, Globe, BarChart3, Wrench, Server, Clock, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface SystemMetrics {
  uptime: string
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  activeConnections: number
  totalRequests: number
  errorRate: number
  responseTime: number
}

interface ConnectionData {
  timestamp: string
  ip: string
  country: string
  userAgent: string
  page: string
  duration: number
  status: "active" | "completed"
}

export function AdminDashboard() {
  // Enhanced Maintenance Mode Control with API integration
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [maintenanceState, setMaintenanceState] = useState<any>(null)

  // Load maintenance status from API
  useEffect(() => {
    const loadMaintenanceStatus = async () => {
      try {
        const response = await fetch("/api/maintenance")
        const data = await response.json()
        setMaintenanceMode(data.isMaintenanceActivated)
        setMaintenanceState(data)
      } catch (error) {
        console.error("Failed to load maintenance status:", error)
      }
    }

    loadMaintenanceStatus()
  }, [])

  const toggleMaintenanceMode = async () => {
    try {
      const newStatus = !maintenanceMode

      const response = await fetch("/api/maintenance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isMaintenanceActivated: newStatus,
          updatedBy: "admin",
        }),
      })

      if (response.ok) {
        setMaintenanceMode(newStatus)

        // Update localStorage for immediate UI feedback
        if (typeof window !== "undefined") {
          const state = {
            isMaintenanceActivated: newStatus,
            lastUpdated: new Date().toISOString(),
            updatedBy: "admin",
          }
          localStorage.setItem("maintenanceMode", JSON.stringify(state))

          // Trigger storage event for other tabs
          window.dispatchEvent(
            new StorageEvent("storage", {
              key: "maintenanceMode",
              newValue: JSON.stringify(state),
            }),
          )
        }

        console.log("Maintenance mode:", newStatus)
      }
    } catch (error) {
      console.error("Failed to toggle maintenance mode:", error)
    }
  }
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null)
  const [connections, setConnections] = useState<ConnectionData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load initial data
    const loadDashboardData = async () => {
      // Simulate API calls
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSystemMetrics({
        uptime: "7d 14h 32m",
        cpuUsage: 23,
        memoryUsage: 67,
        diskUsage: 45,
        activeConnections: 127,
        totalRequests: 45892,
        errorRate: 0.2,
        responseTime: 245,
      })

      setConnections([
        {
          timestamp: "2024-01-15 14:32:15",
          ip: "192.168.1.100",
          country: "France",
          userAgent: "Chrome 120.0",
          page: "/",
          duration: 245,
          status: "active",
        },
        {
          timestamp: "2024-01-15 14:31:45",
          ip: "10.0.0.50",
          country: "United States",
          userAgent: "Firefox 121.0",
          page: "/projects",
          duration: 180,
          status: "completed",
        },
        {
          timestamp: "2024-01-15 14:30:22",
          ip: "172.16.0.25",
          country: "Germany",
          userAgent: "Safari 17.2",
          page: "/timeline",
          duration: 320,
          status: "active",
        },
      ])

      setIsLoading(false)
    }

    loadDashboardData()

    // Set up real-time updates
    const interval = setInterval(() => {
      if (systemMetrics) {
        setSystemMetrics((prev) =>
          prev
            ? {
                ...prev,
                activeConnections: prev.activeConnections + Math.floor(Math.random() * 10 - 5),
                totalRequests: prev.totalRequests + Math.floor(Math.random() * 5),
                cpuUsage: Math.max(0, Math.min(100, prev.cpuUsage + Math.floor(Math.random() * 20 - 10))),
                responseTime: Math.max(100, prev.responseTime + Math.floor(Math.random() * 100 - 50)),
              }
            : null,
        )
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [systemMetrics])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Maintenance Mode Control */}
      <Card className="border-2 border-orange-200 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-orange-500" />
            Mode Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{maintenanceMode ? "Mode maintenance activé" : "Site en ligne"}</p>
              <p className="text-sm text-muted-foreground">
                {maintenanceMode
                  ? "Les visiteurs verront la page de maintenance"
                  : "Le site est accessible aux visiteurs"}
              </p>
              {maintenanceState && (
                <p className="text-xs text-muted-foreground mt-1">
                  Dernière mise à jour: {new Date(maintenanceState.lastUpdated).toLocaleString("fr-FR")}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={maintenanceMode ? "destructive" : "default"}>
                {maintenanceMode ? "Maintenance" : "En ligne"}
              </Badge>
              <Switch checked={maintenanceMode} onCheckedChange={toggleMaintenanceMode} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connexions Actives</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemMetrics?.activeConnections}</div>
              <p className="text-xs text-muted-foreground">+12% par rapport à hier</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Requêtes Totales</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemMetrics?.totalRequests.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+5.2% ce mois</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temps de Réponse</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemMetrics?.responseTime}ms</div>
              <p className="text-xs text-muted-foreground">-15ms depuis hier</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux d'Erreur</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemMetrics?.errorRate}%</div>
              <p className="text-xs text-muted-foreground">Excellent état</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* System Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              Ressources Système
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">CPU</span>
                <span className="text-sm font-medium">{systemMetrics?.cpuUsage}%</span>
              </div>
              <Progress value={systemMetrics?.cpuUsage} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Mémoire</span>
                <span className="text-sm font-medium">{systemMetrics?.memoryUsage}%</span>
              </div>
              <Progress value={systemMetrics?.memoryUsage} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Disque</span>
                <span className="text-sm font-medium">{systemMetrics?.diskUsage}%</span>
              </div>
              <Progress value={systemMetrics?.diskUsage} className="h-2" />
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Uptime: {systemMetrics?.uptime}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Connexions en Temps Réel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {connections.map((connection, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          connection.status === "active" ? "bg-green-500 animate-pulse" : "bg-gray-400"
                        }`}
                      />
                      <span className="text-sm font-medium">{connection.ip}</span>
                      <Badge variant="outline" className="text-xs">
                        {connection.country}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {connection.page} • {connection.userAgent} • {connection.duration}s
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{connection.timestamp.split(" ")[1]}</div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <Activity className="w-4 h-4 mr-2" />
              Redémarrer les Services
            </Button>
            <Button variant="outline" className="justify-start">
              <BarChart3 className="w-4 h-4 mr-2" />
              Exporter les Logs
            </Button>
            <Button variant="outline" className="justify-start">
              <Globe className="w-4 h-4 mr-2" />
              Vider le Cache
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Info, GitCommit, Globe, Clock, Code, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getVercelEnv, type DeploymentInfo } from "@/lib/vercel-config"

export function DeploymentInfo() {
  const [deploymentInfo, setDeploymentInfo] = useState<DeploymentInfo | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [buildTime, setBuildTime] = useState<string>("")

  useEffect(() => {
    const info = getVercelEnv()
    setDeploymentInfo(info)
    setBuildTime(new Date(info.buildTime).toLocaleString())
  }, [])

  if (!deploymentInfo) return null

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case "production":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "preview":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "development":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-6 right-24 z-40"
    >
      <Card className="bg-background/90 backdrop-blur-md border-2 min-w-[280px]">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="w-4 h-4" />
              Deployment Info
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-6 w-6 p-0">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Environment:</span>
            <Badge className={getEnvironmentColor(deploymentInfo.environment)}>{deploymentInfo.environment}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Region:</span>
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              <span className="text-sm font-mono">{deploymentInfo.region}</span>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-3 border-t pt-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Commit:</span>
                  <div className="flex items-center gap-1">
                    <GitCommit className="w-3 h-3" />
                    <span className="text-xs font-mono">{deploymentInfo.commitSha.slice(0, 7)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Version:</span>
                  <div className="flex items-center gap-1">
                    <Code className="w-3 h-3" />
                    <span className="text-sm font-mono">{deploymentInfo.version}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Built:</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">{buildTime}</span>
                  </div>
                </div>

                {deploymentInfo.environment === "production" && (
                  <div className="text-center pt-2">
                    <Badge variant="outline" className="text-xs">
                      🚀 Live Production
                    </Badge>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

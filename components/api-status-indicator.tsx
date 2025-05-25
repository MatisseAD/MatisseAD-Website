"use client"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertTriangle, CheckCircle, Clock, Wifi, WifiOff } from "lucide-react"

interface ApiStatusIndicatorProps {
  apiStatus: {
    github: "success" | "error" | "rate-limited"
    modrinth: "success" | "error" | "rate-limited"
  }
  lastUpdated: Date | null
  retryCount: number
}

export function ApiStatusIndicator({ apiStatus, lastUpdated, retryCount }: ApiStatusIndicatorProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-3 h-3 text-green-500" />
      case "rate-limited":
        return <Clock className="w-3 h-3 text-yellow-500" />
      case "error":
        return <AlertTriangle className="w-3 h-3 text-red-500" />
      default:
        return <WifiOff className="w-3 h-3 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return "Connected"
      case "rate-limited":
        return "Rate Limited"
      case "error":
        return "Error"
      default:
        return "Unknown"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "rate-limited":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1">
              <Wifi className="w-3 h-3" />
              <span>API Status:</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {getStatusIcon(apiStatus.github)}
                <span>GitHub: {getStatusText(apiStatus.github)}</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(apiStatus.modrinth)}
                <span>Modrinth: {getStatusText(apiStatus.modrinth)}</span>
              </div>
              {lastUpdated && (
                <div className="text-xs text-muted-foreground mt-2">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}
              {retryCount > 0 && <div className="text-xs text-muted-foreground">Retries: {retryCount}</div>}
            </div>
          </TooltipContent>
        </Tooltip>

        <Badge variant="outline" className={`${getStatusColor(apiStatus.github)} text-xs`}>
          <span className="flex items-center gap-1">
            {getStatusIcon(apiStatus.github)}
            GH
          </span>
        </Badge>

        <Badge variant="outline" className={`${getStatusColor(apiStatus.modrinth)} text-xs`}>
          <span className="flex items-center gap-1">
            {getStatusIcon(apiStatus.modrinth)}
            MR
          </span>
        </Badge>
      </div>
    </TooltipProvider>
  )
}

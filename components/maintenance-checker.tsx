"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useMaintenanceMode } from "./maintenance-provider"
import MaintenancePage from "@/app/maintenance/page"

interface MaintenanceCheckerProps {
  children: React.ReactNode
}

export function MaintenanceChecker({ children }: MaintenanceCheckerProps) {
  const { isMaintenanceActivated } = useMaintenanceMode()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't render anything during SSR to avoid hydration mismatch
  if (!isClient) {
    return <>{children}</>
  }

  // Allow access to admin page even during maintenance
  if (pathname === "/admin") {
    return <>{children}</>
  }

  // Show maintenance page if maintenance mode is activated
  if (isMaintenanceActivated) {
    return <MaintenancePage />
  }

  // Normal operation
  return <>{children}</>
}

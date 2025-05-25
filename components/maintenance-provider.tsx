"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  getMaintenanceStatus,
  setMaintenanceStatus,
  getMaintenanceState,
  type MaintenanceState,
} from "@/lib/maintenance"

interface MaintenanceContextType {
  isMaintenanceActivated: boolean
  maintenanceState: MaintenanceState | null
  setMaintenanceMode: (activated: boolean, updatedBy?: string) => Promise<void>
  refreshMaintenanceStatus: () => void
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined)

export function useMaintenanceMode() {
  const context = useContext(MaintenanceContext)
  if (context === undefined) {
    throw new Error("useMaintenanceMode must be used within a MaintenanceProvider")
  }
  return context
}

interface MaintenanceProviderProps {
  children: ReactNode
}

export function MaintenanceProvider({ children }: MaintenanceProviderProps) {
  const [isMaintenanceActivated, setIsMaintenanceActivated] = useState(false)
  const [maintenanceState, setMaintenanceState] = useState<MaintenanceState | null>(null)

  const refreshMaintenanceStatus = () => {
    const status = getMaintenanceStatus()
    const state = getMaintenanceState()
    setIsMaintenanceActivated(status)
    setMaintenanceState(state)
  }

  const setMaintenanceMode = async (activated: boolean, updatedBy = "admin") => {
    try {
      // Update local storage
      setMaintenanceStatus(activated, updatedBy)

      // Update API
      await fetch("/api/maintenance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isMaintenanceActivated: activated,
          updatedBy,
        }),
      })

      // Refresh local state
      refreshMaintenanceStatus()
    } catch (error) {
      console.error("Failed to update maintenance mode:", error)
    }
  }

  useEffect(() => {
    // Load initial state
    refreshMaintenanceStatus()

    // Listen for storage changes (from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "maintenanceMode") {
        refreshMaintenanceStatus()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return (
    <MaintenanceContext.Provider
      value={{
        isMaintenanceActivated,
        maintenanceState,
        setMaintenanceMode,
        refreshMaintenanceStatus,
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  )
}

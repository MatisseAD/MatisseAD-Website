// Maintenance mode utilities
export interface MaintenanceState {
  isMaintenanceActivated: boolean
  lastUpdated: string
  updatedBy: string
}

// Get maintenance status from localStorage (client-side)
export function getMaintenanceStatus(): boolean {
  if (typeof window === "undefined") return false

  try {
    const stored = localStorage.getItem("maintenanceMode")
    if (!stored) return false

    const data: MaintenanceState = JSON.parse(stored)
    return data.isMaintenanceActivated
  } catch {
    return false
  }
}

// Set maintenance status in localStorage (client-side)
export function setMaintenanceStatus(isActivated: boolean, updatedBy = "admin"): void {
  if (typeof window === "undefined") return

  const state: MaintenanceState = {
    isMaintenanceActivated: isActivated,
    lastUpdated: new Date().toISOString(),
    updatedBy,
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

// Get full maintenance state
export function getMaintenanceState(): MaintenanceState | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem("maintenanceMode")
    if (!stored) return null

    return JSON.parse(stored)
  } catch {
    return null
  }
}

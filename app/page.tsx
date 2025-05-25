import { ToastProvider } from "@/components/toast-provider"
import { MaintenanceProvider } from "@/components/maintenance-provider"
import { MaintenanceChecker } from "@/components/maintenance-checker"
import Component from "@/minecraft-dev-profile"

export default function Page() {
  return (
    <MaintenanceProvider>
      <ToastProvider>
        <MaintenanceChecker>
          <Component />
        </MaintenanceChecker>
      </ToastProvider>
    </MaintenanceProvider>
  )
}

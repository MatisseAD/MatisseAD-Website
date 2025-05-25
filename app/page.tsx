import { ToastProvider } from "@/components/toast-provider"
import Component from "@/minecraft-dev-profile"

export default function Page() {
  return (
    <ToastProvider>
      <Component />
    </ToastProvider>
  )
}

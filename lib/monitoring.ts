import { track } from "@vercel/analytics"

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, string | number | boolean>
}

export function trackEvent(event: AnalyticsEvent) {
  try {
    track(event.name, event.properties)
  } catch (error) {
    console.warn("Analytics tracking failed:", error)
  }
}

export function trackError(error: Error, context?: Record<string, any>) {
  try {
    track("error", {
      message: error.message,
      stack: error.stack?.slice(0, 500),
      ...context,
    })
  } catch (e) {
    console.warn("Error tracking failed:", e)
  }
}

export function trackPerformance(metric: string, value: number, unit = "ms") {
  try {
    track("performance", {
      metric,
      value,
      unit,
    })
  } catch (error) {
    console.warn("Performance tracking failed:", error)
  }
}

export function trackUserInteraction(action: string, element?: string) {
  try {
    track("user_interaction", {
      action,
      element,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.warn("Interaction tracking failed:", error)
  }
}

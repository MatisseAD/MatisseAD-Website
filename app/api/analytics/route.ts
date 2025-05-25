import { NextResponse } from "next/server"
import { trackEvent } from "@/lib/monitoring"

export async function POST(request: Request) {
  try {
    const { event, properties } = await request.json()

    // Validate event data
    if (!event || typeof event !== "string") {
      return NextResponse.json({ error: "Invalid event name" }, { status: 400 })
    }

    // Track the event
    trackEvent({ name: event, properties })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Return basic analytics data (replace with real Vercel Analytics API)
    const analyticsData = {
      pageViews: 12547,
      uniqueVisitors: 8932,
      averageSessionTime: "3m 42s",
      bounceRate: 24.5,
      topPages: [
        { path: "/", views: 5432 },
        { path: "/projects", views: 3210 },
        { path: "/timeline", views: 2105 },
        { path: "/contact", views: 1800 },
      ],
      topCountries: [
        { country: "United States", percentage: 35 },
        { country: "France", percentage: 28 },
        { country: "Germany", percentage: 18 },
        { country: "United Kingdom", percentage: 12 },
        { country: "Canada", percentage: 7 },
      ],
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error("Analytics fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}

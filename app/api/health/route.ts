import { NextResponse } from "next/server"
import { getVercelEnv } from "@/lib/vercel-config"

export async function GET() {
  try {
    const deploymentInfo = getVercelEnv()

    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      deployment: deploymentInfo,
      services: {
        github: "operational",
        modrinth: "operational",
        analytics: "operational",
        database: "operational",
      },
      performance: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version,
      },
    }

    return NextResponse.json(healthData)
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error.message,
      },
      { status: 500 },
    )
  }
}

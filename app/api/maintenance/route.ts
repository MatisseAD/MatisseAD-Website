import { type NextRequest, NextResponse } from "next/server"

// In a real application, this would be stored in a database
// For this demo, we'll use a simple in-memory store
let maintenanceState = {
  isMaintenanceActivated: false,
  lastUpdated: new Date().toISOString(),
  updatedBy: "system",
}

export async function GET() {
  return NextResponse.json(maintenanceState)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { isMaintenanceActivated, updatedBy = "admin" } = body

    if (typeof isMaintenanceActivated !== "boolean") {
      return NextResponse.json({ error: "isMaintenanceActivated must be a boolean" }, { status: 400 })
    }

    maintenanceState = {
      isMaintenanceActivated,
      lastUpdated: new Date().toISOString(),
      updatedBy,
    }

    return NextResponse.json({
      success: true,
      state: maintenanceState,
    })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

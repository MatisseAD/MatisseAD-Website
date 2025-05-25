import { NextResponse } from "next/server"
import { apiClient } from "@/lib/api-client"

export async function GET() {
  try {
    const user = await apiClient.get(`https://api.modrinth.com/v2/user/Matisse`, {
      retryOptions: {
        maxRetries: 3,
        baseDelay: 1000,
        maxDelay: 8000,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Modrinth user API error:", error)

    if (error.status === 404) {
      return NextResponse.json({ error: "Modrinth user not found" }, { status: 404 })
    }

    if (error.status === 429) {
      return NextResponse.json({ error: "Modrinth API rate limit exceeded", retryAfter: 60 }, { status: 429 })
    }

    return NextResponse.json({ error: "Failed to fetch Modrinth user", details: error.message }, { status: 500 })
  }
}

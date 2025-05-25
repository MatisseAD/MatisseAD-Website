import { NextResponse } from "next/server"
import { apiClient } from "@/lib/api-client"

export async function GET() {
  try {
    // First get the user to get their ID
    const user = await apiClient.get(`https://api.modrinth.com/v2/user/Matisse`, {
      retryOptions: {
        maxRetries: 2,
        baseDelay: 500,
        maxDelay: 4000,
      },
    })

    if (!user.id) {
      console.error("Modrinth user has no ID")
      return NextResponse.json([], { status: 200 })
    }

    // Then get the projects using the user ID
    const projects = await apiClient.get(`https://api.modrinth.com/v2/user/${user.id}/projects`, {
      retryOptions: {
        maxRetries: 3,
        baseDelay: 1000,
        maxDelay: 8000,
      },
    })

    // Ensure we always return an array
    if (!Array.isArray(projects)) {
      console.warn("Modrinth API returned non-array response:", projects)
      return NextResponse.json([], { status: 200 })
    }

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Modrinth projects API error:", error)

    // Handle specific error cases gracefully
    if (error.status === 429) {
      console.warn("Modrinth API rate limit exceeded, returning empty array")
      return NextResponse.json([], {
        status: 200,
        headers: { "X-Rate-Limited": "true" },
      })
    }

    if (error.status === 404) {
      console.warn("Modrinth user/projects not found, returning empty array")
      return NextResponse.json([], { status: 200 })
    }

    // Always return empty array on error to prevent UI crashes
    return NextResponse.json([], {
      status: 200,
      headers: { "X-Error": "true" },
    })
  }
}

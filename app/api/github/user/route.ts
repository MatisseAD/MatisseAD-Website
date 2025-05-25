import { NextResponse } from "next/server"
import { apiClient } from "@/lib/api-client"

export async function GET() {
  try {
    const user = await apiClient.get(`https://api.github.com/users/MatisseAD`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      retryOptions: {
        maxRetries: 3,
        baseDelay: 1000,
        maxDelay: 8000,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("GitHub user API error:", error)

    // Handle specific error cases
    if (error.status === 403) {
      return NextResponse.json({ error: "GitHub API rate limit exceeded", retryAfter: 3600 }, { status: 429 })
    }

    if (error.status === 404) {
      return NextResponse.json({ error: "GitHub user not found" }, { status: 404 })
    }

    return NextResponse.json({ error: "Failed to fetch GitHub user", details: error.message }, { status: 500 })
  }
}

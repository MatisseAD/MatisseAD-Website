import { NextResponse } from "next/server"
import { apiClient } from "@/lib/api-client"

export async function GET() {
  try {
    const repos = await apiClient.get(`https://api.github.com/users/MatisseAD/repos?sort=updated&per_page=10`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      retryOptions: {
        maxRetries: 3,
        baseDelay: 1000,
        maxDelay: 8000,
      },
    })

    // Ensure we always return an array
    if (!Array.isArray(repos)) {
      console.warn("GitHub API returned non-array response:", repos)
      return NextResponse.json([], { status: 200 })
    }

    return NextResponse.json(repos)
  } catch (error) {
    console.error("GitHub repos API error:", error)

    // Handle specific error cases gracefully
    if (error.status === 403) {
      console.warn("GitHub API rate limit exceeded, returning empty array")
      return NextResponse.json([], {
        status: 200,
        headers: { "X-Rate-Limited": "true" },
      })
    }

    if (error.status === 404) {
      console.warn("GitHub user not found, returning empty array")
      return NextResponse.json([], { status: 200 })
    }

    // Always return empty array on error to prevent UI crashes
    return NextResponse.json([], {
      status: 200,
      headers: { "X-Error": "true" },
    })
  }
}

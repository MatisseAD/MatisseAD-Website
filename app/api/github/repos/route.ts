import { NextResponse } from "next/server"
import { fetchGitHubRepos } from "@/lib/api"

export async function GET() {
  try {
    const repos = await fetchGitHubRepos("MatisseAD")
    // Ensure we always return an array
    return NextResponse.json(Array.isArray(repos) ? repos : [])
  } catch (error) {
    console.error("GitHub repos API error:", error)
    // Return empty array on error instead of error object
    return NextResponse.json([])
  }
}

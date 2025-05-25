import { NextResponse } from "next/server"
import { fetchGitHubRepos } from "@/lib/api"

export async function GET() {
  try {
    const repos = await fetchGitHubRepos("MatisseAD")
    return NextResponse.json(repos)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch GitHub repositories" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { fetchGitHubUser } from "@/lib/api"

export async function GET() {
  try {
    const user = await fetchGitHubUser("MatisseAD")
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch GitHub user" }, { status: 500 })
  }
}

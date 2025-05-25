import { NextResponse } from "next/server"
import { fetchModrinthUser, fetchModrinthProjects } from "@/lib/api"

export async function GET() {
  try {
    const user = await fetchModrinthUser("Matisse")
    const projects = await fetchModrinthProjects(user.id)
    // Ensure we always return an array
    return NextResponse.json(Array.isArray(projects) ? projects : [])
  } catch (error) {
    console.error("Modrinth projects API error:", error)
    // Return empty array on error instead of error object
    return NextResponse.json([])
  }
}

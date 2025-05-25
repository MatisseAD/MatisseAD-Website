import { NextResponse } from "next/server"
import { fetchModrinthUser, fetchModrinthProjects } from "@/lib/api"

export async function GET() {
  try {
    const user = await fetchModrinthUser("Matisse")
    const projects = await fetchModrinthProjects(user.id)
    return NextResponse.json(projects)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch Modrinth projects" }, { status: 500 })
  }
}

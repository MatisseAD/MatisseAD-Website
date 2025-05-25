import { NextResponse } from "next/server"
import { fetchModrinthUser } from "@/lib/api"

export async function GET() {
  try {
    const user = await fetchModrinthUser("Matisse")
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch Modrinth user" }, { status: 500 })
  }
}

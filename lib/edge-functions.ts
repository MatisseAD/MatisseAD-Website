import { type NextRequest, NextResponse } from "next/server"
import { getFeatureFlags } from "./vercel-config"

export async function middleware(request: NextRequest) {
  const flags = await getFeatureFlags()

  // Maintenance mode check
  if (flags.maintenanceMode && !request.nextUrl.pathname.startsWith("/maintenance")) {
    return NextResponse.redirect(new URL("/maintenance", request.url))
  }

  // Add security headers
  const response = NextResponse.next()

  response.headers.set("X-Robots-Tag", "index, follow")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "origin-when-cross-origin")

  // Add feature flags to response headers for client-side access
  response.headers.set("X-Feature-Flags", JSON.stringify(flags))

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

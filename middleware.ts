import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  // Add security headers
  const response = NextResponse.next()

  // Security headers
  response.headers.set("X-Robots-Tag", "index, follow")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "origin-when-cross-origin")
  response.headers.set("X-XSS-Protection", "1; mode=block")

  // Performance headers
  response.headers.set("X-DNS-Prefetch-Control", "on")

  // Add deployment info
  response.headers.set("X-Deployment-Region", process.env.VERCEL_REGION || "unknown")
  response.headers.set("X-Deployment-Env", process.env.VERCEL_ENV || "development")

  // Cache control for static assets
  if (request.nextUrl.pathname.startsWith("/_next/static/")) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable")
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/api/((?!auth).)*"],
}

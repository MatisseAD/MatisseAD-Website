"use client"

import Link from "next/link"
import { Home, ArrowLeft, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Animated 404 */}
        <div className="relative">
          <h1 className="text-9xl font-bold text-primary/20 select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <Zap className="w-24 h-24 text-primary animate-pulse" />
              <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-3xl">Page Not Found</CardTitle>
            <CardDescription className="text-lg">
              Looks like this page went mining and never came back! 🏗️
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist. It might have been moved, deleted, or you might have mistyped
              the URL.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link href="/">
                  <Home className="w-4 h-4" />
                  Back to Home
                </Link>
              </Button>

              <Button variant="outline" size="lg" className="gap-2" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-3">Quick Links:</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <Link href="/" className="text-primary hover:underline">
                  🏠 Home
                </Link>
                <Link href="https://github.com/MatisseAD" className="text-primary hover:underline">
                  💻 GitHub
                </Link>
                <Link href="https://modrinth.com/user/Matisse" className="text-primary hover:underline">
                  🎮 Modrinth
                </Link>
                <Link href="mailto:contact@example.com" className="text-primary hover:underline">
                  📧 Contact
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Minecraft-themed decoration */}
        <div className="flex justify-center gap-4 opacity-50">
          <div className="w-8 h-8 bg-green-500 rounded-sm"></div>
          <div className="w-8 h-8 bg-brown-500 rounded-sm"></div>
          <div className="w-8 h-8 bg-gray-500 rounded-sm"></div>
          <div className="w-8 h-8 bg-blue-500 rounded-sm"></div>
        </div>
      </div>
    </div>
  )
}

import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { FloatingThemeToggle } from "@/components/floating-theme-toggle"

export const metadata: Metadata = {
  title: "Minecraft Developer Profile",
  description: "Professional profile for a Java Minecraft plugin developer",
  generator: "v0.dev",
  keywords: ["minecraft", "java", "plugin", "developer", "modrinth", "github"],
  authors: [{ name: "MatisseAD" }],
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('minecraft-dev-theme') === 'dark' || 
                    (!localStorage.getItem('minecraft-dev-theme') && 
                     window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider defaultTheme="system" storageKey="minecraft-dev-theme">
          {children}
          <FloatingThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  )
}

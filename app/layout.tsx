import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { FloatingThemeToggle } from "@/components/floating-theme-toggle"
import { LoadingScreen } from "@/components/loading-screen"
import { CustomCursor } from "@/components/custom-cursor"
import { ScrollProgress } from "@/components/scroll-progress"
import { BackToTop } from "@/components/back-to-top"
import { Terminal } from "@/components/terminal"
import { EasterEgg } from "@/components/easter-egg"
import { ToastProvider } from "@/components/toast-provider"
import { StickyNav } from "@/components/navigation/sticky-nav"
import { ParticleBackground } from "@/components/effects/particle-background"
import { MusicPlayer } from "@/components/widgets/music-player"
import { Suspense } from "react"
import { DeploymentInfo } from "@/components/widgets/deployment-info"

export const metadata: Metadata = {
  title: "MatisseAD - Minecraft Developer Profile",
  description: "Professional profile for a Java Minecraft plugin developer specializing in Spigot/Paper development",
  generator: "v0.dev",
  keywords: ["minecraft", "java", "plugin", "developer", "modrinth", "github", "spigot", "paper"],
  authors: [{ name: "MatisseAD" }],
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  openGraph: {
    title: "MatisseAD - Minecraft Developer",
    description: "Professional Minecraft plugin developer with expertise in Java, Spigot, and Paper development",
    type: "website",
    locale: "en_US",
    siteName: "MatisseAD Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "MatisseAD - Minecraft Developer",
    description: "Professional Minecraft plugin developer",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
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
      <body className="min-h-screen bg-background font-sans antialiased overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <ToastProvider>
            <LoadingScreen />
            <ParticleBackground />
            <ScrollProgress />
            <CustomCursor />
            <StickyNav />
            <Suspense>{children}</Suspense>
            <FloatingThemeToggle />
            <BackToTop />
            <MusicPlayer />
            <Terminal />
            <EasterEgg />
            <DeploymentInfo />
          </ToastProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

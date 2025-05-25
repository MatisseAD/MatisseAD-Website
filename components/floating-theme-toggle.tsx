"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

export function FloatingThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("light")
    } else {
      // If system, toggle to opposite of current actual theme
      setTheme(actualTheme === "light" ? "dark" : "light")
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-xl border-2 bg-background/90 backdrop-blur-md hover:bg-background transition-all duration-300 hover:scale-110 focus:scale-110 group"
      aria-label={`Switch to ${actualTheme === "light" ? "dark" : "light"} mode`}
    >
      <div className="relative">
        <Sun
          className={`h-6 w-6 text-yellow-500 transition-all duration-500 ${
            actualTheme === "light" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
          }`}
        />
        <Moon
          className={`absolute inset-0 h-6 w-6 text-blue-400 transition-all duration-500 ${
            actualTheme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

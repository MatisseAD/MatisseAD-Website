"use client"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme()

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg border-2 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 hover:scale-110 focus:scale-110"
            aria-label={`Current theme: ${theme}. Click to change theme.`}
          >
            {actualTheme === "light" ? (
              <Sun className="h-5 w-5 text-yellow-500 transition-all duration-300" />
            ) : (
              <Moon className="h-5 w-5 text-blue-400 transition-all duration-300" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[160px] bg-background/95 backdrop-blur-sm border-2">
          <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer focus:bg-accent/50">
            <Sun className="mr-2 h-4 w-4 text-yellow-500" />
            <span>Light</span>
            {theme === "light" && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer focus:bg-accent/50">
            <Moon className="mr-2 h-4 w-4 text-blue-400" />
            <span>Dark</span>
            {theme === "dark" && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer focus:bg-accent/50">
            <Monitor className="mr-2 h-4 w-4 text-gray-500" />
            <span>System</span>
            {theme === "system" && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

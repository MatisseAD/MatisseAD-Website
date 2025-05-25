"use client"

import type * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export type Theme = "light" | "dark" | "system"

export type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme?: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: undefined,
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "vite-ui-theme" }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme | null
    setTheme(storedTheme || defaultTheme)
  }, [defaultTheme, storageKey])

  useEffect(() => {
    if (theme === "system") {
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.remove("light")
    } else if (theme !== "system") {
      document.documentElement.classList.add(theme)
      document.documentElement.classList.remove(theme === "dark" ? "light" : "dark")
    }
    localStorage.setItem(storageKey, theme)
  }, [theme, storageKey])

  return <ThemeProviderContext.Provider value={{ theme, setTheme }}>{children}</ThemeProviderContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}

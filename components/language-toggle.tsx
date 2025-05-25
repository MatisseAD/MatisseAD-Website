"use client"

import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { useLanguage } from "./language-provider"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "fr" : "en"
    setLanguage(newLanguage)
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleLanguage}
      className="fixed bottom-6 right-24 z-40 h-12 w-12 rounded-full shadow-lg bg-background/90 backdrop-blur-md hover:bg-background transition-all duration-300 hover:scale-110"
      title={language === "en" ? "Switch to French" : "Passer en anglais"}
    >
      <Globe className="h-5 w-5" />
      <span className="sr-only">{language === "en" ? "Switch to French" : "Passer en anglais"}</span>
      <span className="absolute -top-1 -right-1 text-xs font-bold bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
        {language.toUpperCase()}
      </span>
    </Button>
  )
}

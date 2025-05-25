"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Language = "en" | "fr"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.projects": "Projects",
    "nav.timeline": "Timeline",
    "nav.contact": "Contact",

    // Hero Section
    "hero.title": "Minecraft Plugin Developer",
    "hero.description":
      "Passionate Java developer specializing in Minecraft plugin development. Creating innovative plugins that enhance gameplay experiences for thousands of players worldwide.",
    "hero.contact": "Contact",
    "hero.github": "GitHub",
    "hero.modrinth": "Modrinth",
    "hero.downloads": "downloads",
    "hero.since": "Since",

    // Stats
    "stats.github": "GitHub Stats",
    "stats.modrinth": "Modrinth Stats",
    "stats.repositories": "Repositories",
    "stats.stars": "Total Stars",
    "stats.followers": "Followers",
    "stats.following": "Following",
    "stats.projects": "Projects",
    "stats.downloads": "Downloads",
    "stats.rating": "Avg Rating",
    "stats.recent_repos": "Recent Repositories",
    "stats.recent_projects": "Recent Projects",
    "stats.no_repos": "No repositories found",
    "stats.no_projects": "No projects found",
    "stats.github_unavailable": "GitHub data unavailable",
    "stats.modrinth_unavailable": "Modrinth data unavailable",

    // Projects
    "projects.github_title": "GitHub Repositories",
    "projects.github_desc": "Recent public repositories from GitHub",
    "projects.modrinth_title": "Modrinth Projects",
    "projects.modrinth_desc": "Minecraft plugins and mods published on Modrinth",
    "projects.view_repo": "View Repository",
    "projects.view_project": "View Project",
    "projects.updated": "Updated",
    "projects.no_description": "No description available",
    "projects.no_categories": "No categories",

    // Quick Actions
    "actions.title": "Quick Actions",
    "actions.refresh": "Refresh Data",
    "actions.github_profile": "GitHub Profile",
    "actions.modrinth_profile": "Modrinth Profile",

    // Contact
    "contact.title": "Get In Touch",
    "contact.description": "Have a project in mind or want to collaborate? Let's build something amazing together!",

    // Terminal
    "terminal.welcome": "Welcome to MatisseAD Terminal",
    "terminal.type_help": 'Type "help" for available commands',
    "terminal.command_not_found": "Command not found",
    "terminal.available_commands": "Available commands:",
    "terminal.help_desc": "Show this help message",
    "terminal.clear_desc": "Clear the terminal",
    "terminal.about_desc": "About this website",
    "terminal.contact_desc": "Contact information",
    "terminal.projects_desc": "List projects",
    "terminal.hack_desc": "Launch rocket attack",
    "terminal.game_desc": "Play Minesweeper",
    "terminal.lang_desc": "Language information",
    "terminal.about_text": "This is the portfolio website of MatisseAD, a Minecraft plugin developer.",
    "terminal.contact_text": "Email: contact@matissead.dev",
    "terminal.current_lang": "Current language: English",
    "terminal.hack_init": "Initializing hack sequence...",
    "terminal.hack_bypass": "Bypassing security protocols...",
    "terminal.hack_launch": "Launching rocket attack!",
    "terminal.hack_complete": "System compromised! 🚀",
    "terminal.game_redirect": "Redirecting to Minesweeper game...",

    // Alerts
    "alert.rate_limited": "Some APIs are rate limited. Data may be incomplete. Please try again later.",
    "alert.data_unavailable":
      "Some profile data couldn't be loaded. This might be due to API rate limits or network issues.",
    "alert.try_again": "Try Again",
    "alert.retry": "Retry",
    "alert.failed_load": "Failed to load profile data",

    // Toasts
    "toast.refreshing": "Refreshing data...",
    "toast.refreshing_desc": "Fetching latest information from GitHub and Modrinth",
    "toast.contact_copied": "Contact info copied!",
    "toast.contact_copied_desc": "Email address copied to clipboard",

    // Game
    "game.title": "Minesweeper",
    "game.back_home": "Back to Home",
    "game.difficulty": "Difficulty",
    "game.easy": "Easy",
    "game.medium": "Medium",
    "game.hard": "Hard",
    "game.new_game": "New Game",
    "game.mines": "Mines",
    "game.time": "Time",
    "game.won": "You Won!",
    "game.lost": "Game Over!",
    "game.play_again": "Play Again",
  },
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.about": "À propos",
    "nav.projects": "Projets",
    "nav.timeline": "Chronologie",
    "nav.contact": "Contact",

    // Hero Section
    "hero.title": "Développeur de Plugins Minecraft",
    "hero.description":
      "Développeur Java passionné spécialisé dans le développement de plugins Minecraft. Création de plugins innovants qui améliorent l'expérience de jeu pour des milliers de joueurs dans le monde.",
    "hero.contact": "Contact",
    "hero.github": "GitHub",
    "hero.modrinth": "Modrinth",
    "hero.downloads": "téléchargements",
    "hero.since": "Depuis",

    // Stats
    "stats.github": "Stats GitHub",
    "stats.modrinth": "Stats Modrinth",
    "stats.repositories": "Dépôts",
    "stats.stars": "Total Étoiles",
    "stats.followers": "Abonnés",
    "stats.following": "Abonnements",
    "stats.projects": "Projets",
    "stats.downloads": "Téléchargements",
    "stats.rating": "Note Moyenne",
    "stats.recent_repos": "Dépôts Récents",
    "stats.recent_projects": "Projets Récents",
    "stats.no_repos": "Aucun dépôt trouvé",
    "stats.no_projects": "Aucun projet trouvé",
    "stats.github_unavailable": "Données GitHub indisponibles",
    "stats.modrinth_unavailable": "Données Modrinth indisponibles",

    // Projects
    "projects.github_title": "Dépôts GitHub",
    "projects.github_desc": "Dépôts publics récents de GitHub",
    "projects.modrinth_title": "Projets Modrinth",
    "projects.modrinth_desc": "Plugins et mods Minecraft publiés sur Modrinth",
    "projects.view_repo": "Voir le Dépôt",
    "projects.view_project": "Voir le Projet",
    "projects.updated": "Mis à jour",
    "projects.no_description": "Aucune description disponible",
    "projects.no_categories": "Aucune catégorie",

    // Quick Actions
    "actions.title": "Actions Rapides",
    "actions.refresh": "Actualiser les Données",
    "actions.github_profile": "Profil GitHub",
    "actions.modrinth_profile": "Profil Modrinth",

    // Contact
    "contact.title": "Entrer en Contact",
    "contact.description":
      "Vous avez un projet en tête ou souhaitez collaborer ? Construisons quelque chose d'incroyable ensemble !",

    // Terminal
    "terminal.welcome": "Bienvenue dans le Terminal MatisseAD",
    "terminal.type_help": 'Tapez "help" pour les commandes disponibles',
    "terminal.command_not_found": "Commande introuvable",
    "terminal.available_commands": "Commandes disponibles :",
    "terminal.help_desc": "Afficher ce message d'aide",
    "terminal.clear_desc": "Effacer le terminal",
    "terminal.about_desc": "À propos de ce site",
    "terminal.contact_desc": "Informations de contact",
    "terminal.projects_desc": "Lister les projets",
    "terminal.hack_desc": "Lancer une attaque de fusée",
    "terminal.game_desc": "Jouer au Démineur",
    "terminal.lang_desc": "Informations sur la langue",
    "terminal.about_text": "Ceci est le site portfolio de MatisseAD, un développeur de plugins Minecraft.",
    "terminal.contact_text": "Email : contact@matissead.dev",
    "terminal.current_lang": "Langue actuelle : Français",
    "terminal.hack_init": "Initialisation de la séquence de hack...",
    "terminal.hack_bypass": "Contournement des protocoles de sécurité...",
    "terminal.hack_launch": "Lancement de l'attaque de fusée !",
    "terminal.hack_complete": "Système compromis ! 🚀",
    "terminal.game_redirect": "Redirection vers le jeu Démineur...",

    // Alerts
    "alert.rate_limited":
      "Certaines APIs sont limitées. Les données peuvent être incomplètes. Veuillez réessayer plus tard.",
    "alert.data_unavailable":
      "Certaines données de profil n'ont pas pu être chargées. Cela peut être dû aux limites d'API ou à des problèmes réseau.",
    "alert.try_again": "Réessayer",
    "alert.retry": "Réessayer",
    "alert.failed_load": "Échec du chargement des données de profil",

    // Toasts
    "toast.refreshing": "Actualisation des données...",
    "toast.refreshing_desc": "Récupération des dernières informations de GitHub et Modrinth",
    "toast.contact_copied": "Infos de contact copiées !",
    "toast.contact_copied_desc": "Adresse email copiée dans le presse-papiers",

    // Game
    "game.title": "Démineur",
    "game.back_home": "Retour à l'Accueil",
    "game.difficulty": "Difficulté",
    "game.easy": "Facile",
    "game.medium": "Moyen",
    "game.hard": "Difficile",
    "game.new_game": "Nouvelle Partie",
    "game.mines": "Mines",
    "game.time": "Temps",
    "game.won": "Vous avez gagné !",
    "game.lost": "Partie terminée !",
    "game.play_again": "Rejouer",
  },
}

async function detectUserLocation(): Promise<Language> {
  try {
    // Try to get user's location via geolocation API
    if (navigator.geolocation) {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              // Use a geolocation service to get country from coordinates
              const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`,
              )
              const data = await response.json()

              // If user is in France, use French, otherwise English
              if (data.countryCode === "FR") {
                resolve("fr")
              } else {
                resolve("en")
              }
            } catch {
              resolve("en") // Default to English on error
            }
          },
          () => {
            // If geolocation fails, try to detect via browser language
            const browserLang = navigator.language.toLowerCase()
            if (browserLang.startsWith("fr")) {
              resolve("fr")
            } else {
              resolve("en")
            }
          },
        )
      })
    } else {
      // Fallback to browser language
      const browserLang = navigator.language.toLowerCase()
      return browserLang.startsWith("fr") ? "fr" : "en"
    }
  } catch {
    return "en" // Default to English
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeLanguage = async () => {
      // Check if user has a saved preference
      const savedLang = localStorage.getItem("minecraft-dev-language") as Language

      if (savedLang && (savedLang === "en" || savedLang === "fr")) {
        setLanguage(savedLang)
      } else {
        // Detect user's location and set language accordingly
        const detectedLang = await detectUserLocation()
        setLanguage(detectedLang)
        localStorage.setItem("minecraft-dev-language", detectedLang)
      }

      setIsInitialized(true)
    }

    initializeLanguage()
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("minecraft-dev-language", lang)

    // Force a re-render to update all components
    window.dispatchEvent(new Event("languagechange"))
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  // Don't render children until language is initialized
  if (!isInitialized) {
    return null
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

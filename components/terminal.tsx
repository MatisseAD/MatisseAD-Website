"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TerminalIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Command {
  input: string
  output: string[]
  timestamp: Date
}

export function Terminal() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<Command[]>([])
  const [currentPath, setCurrentPath] = useState("~/matisse-dev")
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const commands = {
    help: {
      output: [
        "Available commands:",
        "  help          - Show this help message",
        "  about         - About MatisseAD",
        "  skills        - List technical skills",
        "  projects      - Show recent projects",
        "  contact       - Contact information",
        "  github        - Open GitHub profile",
        "  modrinth      - Open Modrinth profile",
        "  clear         - Clear terminal",
        "  exit          - Close terminal",
      ],
    },
    about: {
      output: [
        "MatisseAD - Minecraft Plugin Developer",
        "",
        "Passionate Java developer specializing in Minecraft plugin development.",
        "Creating innovative plugins that enhance gameplay experiences",
        "for thousands of players worldwide.",
        "",
        "Location: France",
        "Experience: 3+ years in Minecraft development",
        "Favorite IDE: IntelliJ IDEA",
      ],
    },
    skills: {
      output: [
        "Technical Skills:",
        "",
        "Languages:",
        "  ● Java (Advanced)",
        "  ● JavaScript/TypeScript (Intermediate)",
        "  ● SQL (Intermediate)",
        "",
        "Frameworks & Tools:",
        "  ● Spigot/Paper API",
        "  ● Maven/Gradle",
        "  ● Git/GitHub",
        "  ● MySQL/SQLite",
        "  ● Redis",
        "",
        "Minecraft Development:",
        "  ● Plugin Architecture",
        "  ● Event Handling",
        "  ● Database Integration",
        "  ● Performance Optimization",
      ],
    },
    projects: {
      output: [
        "Recent Projects:",
        "",
        "🔧 EssentialsX Contributions",
        "   └─ Core plugin improvements and bug fixes",
        "",
        "⚡ Custom Economy Plugin",
        "   └─ Advanced economy system with shop integration",
        "",
        "🛡️ Anti-Cheat System",
        "   └─ Lightweight cheat detection for small servers",
        "",
        "🎮 Minigame Framework",
        "   └─ Reusable framework for creating minigames",
      ],
    },
    contact: {
      output: [
        "Contact Information:",
        "",
        "GitHub: https://github.com/MatisseAD",
        "Modrinth: https://modrinth.com/user/Matisse",
        "Discord: Available on request",
        "",
        "Feel free to reach out for collaborations!",
      ],
    },
    github: {
      output: ["Opening GitHub profile..."],
      action: () => window.open("https://github.com/MatisseAD", "_blank"),
    },
    modrinth: {
      output: ["Opening Modrinth profile..."],
      action: () => window.open("https://modrinth.com/user/Matisse", "_blank"),
    },
    clear: {
      output: [],
      action: () => setHistory([]),
    },
    exit: {
      output: ["Goodbye! 👋"],
      action: () => setTimeout(() => setIsOpen(false), 1000),
    },
  }

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase()
    const command = commands[trimmedCmd as keyof typeof commands]

    if (command) {
      const newCommand: Command = {
        input: cmd,
        output: command.output,
        timestamp: new Date(),
      }

      setHistory((prev) => [...prev, newCommand])

      if (command.action) {
        command.action()
      }
    } else if (trimmedCmd === "") {
      // Empty command, just add to history
      setHistory((prev) => [...prev, { input: cmd, output: [], timestamp: new Date() }])
    } else {
      const newCommand: Command = {
        input: cmd,
        output: [`Command not found: ${cmd}`, "Type 'help' for available commands."],
        timestamp: new Date(),
      }
      setHistory((prev) => [...prev, newCommand])
    }

    setInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(input)
    }
  }

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="icon"
        className="fixed bottom-6 left-6 z-40 h-12 w-12 rounded-full shadow-lg bg-background/90 backdrop-blur-md hover:bg-background transition-all duration-300 hover:scale-110"
        aria-label="Open terminal"
      >
        <TerminalIcon className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl h-96 max-h-[80vh]"
            >
              <Card className="h-full bg-black/90 border-green-500/50 text-green-400 font-mono overflow-hidden">
                {/* Terminal Header */}
                <div className="flex items-center justify-between p-3 border-b border-green-500/30 bg-black/50">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-sm text-green-300">MatisseAD Terminal</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-green-400 hover:text-green-300 hover:bg-green-500/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Terminal Content */}
                <div
                  ref={terminalRef}
                  className="flex-1 p-4 overflow-y-auto h-full bg-black/80"
                  style={{ height: "calc(100% - 60px)" }}
                >
                  {/* Welcome Message */}
                  {history.length === 0 && (
                    <div className="mb-4">
                      <p className="text-green-300">Welcome to MatisseAD Terminal v1.0</p>
                      <p className="text-green-400">Type 'help' to see available commands.</p>
                      <p className="text-green-500 mb-2">{">"} Initializing developer profile...</p>
                    </div>
                  )}

                  {/* Command History */}
                  {history.map((cmd, index) => (
                    <div key={index} className="mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-green-300">{currentPath}</span>
                        <span className="text-green-400">$</span>
                        <span className="text-white">{cmd.input}</span>
                      </div>
                      {cmd.output.map((line, lineIndex) => (
                        <div key={lineIndex} className="text-green-400 ml-4">
                          {line}
                        </div>
                      ))}
                    </div>
                  ))}

                  {/* Current Input */}
                  <div className="flex items-center gap-2">
                    <span className="text-green-300">{currentPath}</span>
                    <span className="text-green-400">$</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 bg-transparent text-white outline-none border-none"
                      placeholder="Type a command..."
                    />
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                      className="text-green-400"
                    >
                      █
                    </motion.span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

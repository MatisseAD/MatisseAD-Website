"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Code, Zap, Trophy, Star } from "lucide-react"

interface TimelineEvent {
  id: string
  title: string
  description: string
  date: string
  type: "project" | "achievement" | "milestone"
  technologies?: string[]
  icon: React.ReactNode
}

const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    title: "Started Minecraft Development",
    description: "Began learning Java and Spigot API development. Created first basic plugins for personal server.",
    date: "2021",
    type: "milestone",
    technologies: ["Java", "Spigot API"],
    icon: <Code className="w-4 h-4" />,
  },
  {
    id: "2",
    title: "First Public Plugin Release",
    description:
      "Released first plugin on Modrinth. Gained initial community feedback and started building reputation.",
    date: "2022",
    type: "achievement",
    technologies: ["Java", "MySQL", "Maven"],
    icon: <Zap className="w-4 h-4" />,
  },
  {
    id: "3",
    title: "Advanced Economy System",
    description: "Developed complex economy plugin with shop integration, player trading, and advanced features.",
    date: "2023",
    type: "project",
    technologies: ["Java", "Redis", "MySQL", "Paper API"],
    icon: <Trophy className="w-4 h-4" />,
  },
  {
    id: "4",
    title: "Open Source Contributions",
    description: "Started contributing to major Minecraft projects like EssentialsX and other community plugins.",
    date: "2024",
    type: "achievement",
    technologies: ["Java", "Git", "GitHub Actions"],
    icon: <Star className="w-4 h-4" />,
  },
  {
    id: "5",
    title: "Professional Portfolio",
    description: "Built modern web portfolio showcasing projects and skills. Integrated with GitHub and Modrinth APIs.",
    date: "2025",
    type: "project",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    icon: <Code className="w-4 h-4" />,
  },
]

export function Timeline() {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "project":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "achievement":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "milestone":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Card className="theme-transition">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2 theme-transition">
          <Calendar className="w-6 h-6" />
          Development Journey
        </CardTitle>
        <CardDescription className="theme-transition">My path as a Minecraft plugin developer</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border theme-transition"></div>

          <div className="space-y-8">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative flex items-start gap-6"
              >
                {/* Timeline Dot */}
                <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-background border-2 border-primary rounded-full theme-transition">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full text-primary-foreground">
                    {event.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <Card className="border-2 theme-transition hover:shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg theme-transition">{event.title}</CardTitle>
                          <CardDescription className="theme-transition">{event.date}</CardDescription>
                        </div>
                        <Badge className={`${getTypeColor(event.type)} theme-transition`}>{event.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-muted-foreground theme-transition">{event.description}</p>
                      {event.technologies && (
                        <div className="flex flex-wrap gap-1">
                          {event.technologies.map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs theme-transition">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { MessageCircle, Users, Wifi } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DiscordData {
  name: string
  members: number
  online: number
  inviteUrl: string
  icon?: string
}

export function DiscordWidget() {
  const [discordData, setDiscordData] = useState<DiscordData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate Discord API call (replace with real Discord widget API)
    const fetchDiscordData = async () => {
      try {
        // In production, use Discord's widget API
        // const response = await fetch('https://discord.com/api/guilds/YOUR_GUILD_ID/widget.json')

        // Mock data for demonstration
        setTimeout(() => {
          setDiscordData({
            name: "MatisseAD's Server",
            members: 1247,
            online: 89,
            inviteUrl: "https://discord.gg/your-invite",
          })
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Failed to fetch Discord data:", error)
        setIsLoading(false)
      }
    }

    fetchDiscordData()
  }, [])

  if (isLoading) {
    return (
      <Card className="theme-transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Discord Server
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!discordData) {
    return (
      <Card className="theme-transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Discord Server
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Discord widget unavailable</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="theme-transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-indigo-500" />
            Discord Server
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{discordData.name}</h3>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">{discordData.online} online</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{discordData.members} members</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-green-500">{discordData.online}</div>
              <div className="text-xs text-muted-foreground">Online</div>
            </div>
            <div>
              <div className="text-xl font-bold text-primary">{discordData.members}</div>
              <div className="text-xs text-muted-foreground">Members</div>
            </div>
          </div>

          <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700">
            <a href={discordData.inviteUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4 mr-2" />
              Join Server
            </a>
          </Button>

          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <Wifi className="w-3 h-3" />
            <span>Live status</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

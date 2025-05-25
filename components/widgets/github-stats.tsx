"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Github } from "lucide-react"
import Image from "next/image"

export function GitHubStats() {
  const username = "MatisseAD"

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="theme-transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            GitHub Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* GitHub Stats Card */}
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={`https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=dark&hide_border=true&bg_color=00000000&text_color=ffffff&icon_color=3b82f6&title_color=3b82f6`}
              alt="GitHub Stats"
              width={400}
              height={200}
              className="w-full h-auto"
              unoptimized
            />
          </div>

          {/* Most Used Languages */}
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=dark&hide_border=true&bg_color=00000000&text_color=ffffff&title_color=3b82f6`}
              alt="Most Used Languages"
              width={400}
              height={200}
              className="w-full h-auto"
              unoptimized
            />
          </div>

          {/* GitHub Streak */}
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={`https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=dark&hide_border=true&background=00000000&stroke=ffffff&ring=3b82f6&fire=3b82f6&currStreakLabel=ffffff`}
              alt="GitHub Streak"
              width={400}
              height={200}
              className="w-full h-auto"
              unoptimized
            />
          </div>

          {/* Activity Graph */}
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={`https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=github-dark&hide_border=true&bg_color=00000000&color=ffffff&line=3b82f6&point=3b82f6&area=true&area_color=3b82f6`}
              alt="GitHub Activity Graph"
              width={400}
              height={300}
              className="w-full h-auto"
              unoptimized
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export function CommentsSection() {
  useEffect(() => {
    // Load Giscus comments
    const script = document.createElement("script")
    script.src = "https://giscus.app/client.js"
    script.setAttribute("data-repo", "MatisseAD/MatisseAD-Website")
    script.setAttribute("data-repo-id", "R_kgDOOwTtuQ")
    script.setAttribute("data-category", "General")
    script.setAttribute("data-category-id", "DIC_kwDOOwTtuc4Cqk8U")
    script.setAttribute("data-mapping", "pathname")
    script.setAttribute("data-strict", "0")
    script.setAttribute("data-reactions-enabled", "1")
    script.setAttribute("data-emit-metadata", "0")
    script.setAttribute("data-input-position", "bottom")
    script.setAttribute("data-theme", "preferred_color_scheme")
    script.setAttribute("data-lang", "fr")
    script.setAttribute("data-loading", "lazy")
    script.crossOrigin = "anonymous"
    script.async = true

    const commentsContainer = document.getElementById("comments-container")
    if (commentsContainer) {
      commentsContainer.appendChild(script)
    }

    return () => {
      if (commentsContainer && script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return (
    <Card className="theme-transition">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Commentaires & Discussions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div id="comments-container" className="min-h-[200px]">
          {/* Giscus comments will be loaded here */}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Minesweeper } from "@/components/games/minesweeper"
import { useLanguage } from "@/components/language-provider"

export default function GamePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("game.back_home")}
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{t("game.title")}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">{t("game.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Minesweeper />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

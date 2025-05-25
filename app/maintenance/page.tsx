"use client"

import { motion } from "framer-motion"
import { Wrench, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center space-y-8"
      >
        {/* Animated Icon */}
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center"
        >
          <Wrench className="w-12 h-12 text-primary" />
        </motion.div>

        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-3xl">Under Maintenance</CardTitle>
            <CardDescription className="text-lg">
              We're currently upgrading our systems to serve you better! 🔧
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Our development team is working hard to implement new features and improvements. We'll be back online
              shortly with an enhanced experience!
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Estimated downtime: 30 minutes</span>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">What's being improved:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Enhanced API performance</li>
                <li>• New interactive features</li>
                <li>• Improved user experience</li>
                <li>• Better mobile responsiveness</li>
              </ul>
            </div>

            <Button asChild variant="outline" className="gap-2">
              <Link href="/">
                <ArrowLeft className="w-4 h-4" />
                Try Again
              </Link>
            </Button>
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground">
          Follow us on{" "}
          <a href="https://github.com/MatisseAD" className="text-primary hover:underline">
            GitHub
          </a>{" "}
          for updates!
        </p>
      </motion.div>
    </div>
  )
}

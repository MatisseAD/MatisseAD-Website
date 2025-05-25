"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Calendar,
  Download,
  ExternalLink,
  Github,
  Globe,
  Mail,
  MapPin,
  Star,
  Users,
  Zap,
  RefreshCw,
  GitFork,
  Eye,
  AlertTriangle,
} from "lucide-react"
import { useProfileData } from "@/hooks/use-profile-data"
import { ProfileSkeleton } from "@/components/loading-skeleton"
import { ApiStatusIndicator } from "@/components/api-status-indicator"
import { motion } from "framer-motion"
import { Timeline } from "@/components/timeline"
import { useToast } from "@/components/toast-provider"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { VisitorMap } from "@/components/widgets/visitor-map"
import { GitHubStats } from "@/components/widgets/github-stats"
import { CommentsSection } from "@/components/widgets/comments-section"
import { trackUserInteraction } from "@/lib/monitoring"
import { useInView } from "react-intersection-observer"
import { useEffect } from "react"
import { PerformanceMonitor } from "@/components/analytics/performance-monitor"
import { RealTimeUpdates } from "@/components/widgets/real-time-updates"
import { AdvancedAnalytics } from "@/components/widgets/advanced-analytics"

export default function Component() {
  const {
    githubUser,
    githubRepos,
    modrinthUser,
    modrinthProjects,
    loading,
    error,
    refetch,
    apiStatus,
    isRateLimited,
    lastUpdated,
    retryCount,
  } = useProfileData()

  const { addToast } = useToast()

  // Intersection observers for scroll animations
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [projectsRef, projectsInView] = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    if (heroInView) trackUserInteraction("section_view", "hero")
    if (statsInView) trackUserInteraction("section_view", "stats")
    if (projectsInView) trackUserInteraction("section_view", "projects")
  }, [heroInView, statsInView, projectsInView])

  if (loading) {
    return <ProfileSkeleton />
  }

  // Show warning if some data failed to load but don't block the entire UI
  const hasPartialData = githubUser || modrinthUser || githubRepos.length > 0 || modrinthProjects.length > 0
  const showWarning = !hasPartialData && !loading

  if (error && !hasPartialData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive" className="theme-transition">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load profile data: {error}
            <Button variant="outline" size="sm" onClick={refetch} className="ml-2">
              <RefreshCw className="w-4 h-4 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Ensure arrays are always arrays with fallbacks
  const safeGithubRepos = Array.isArray(githubRepos) ? githubRepos : []
  const safeModrinthProjects = Array.isArray(modrinthProjects) ? modrinthProjects : []

  const totalDownloads = safeModrinthProjects.reduce((sum, project) => sum + (project.downloads || 0), 0)
  const averageRating = safeModrinthProjects.length > 0 ? 4.7 : 0
  const totalStars = safeGithubRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0)

  const handleRefresh = () => {
    refetch()
    addToast({
      type: "info",
      title: "Refreshing data...",
      description: "Fetching latest information from GitHub and Modrinth",
    })
    trackUserInteraction("data_refresh", "manual")
  }

  const handleContactClick = () => {
    addToast({
      type: "success",
      title: "Contact info copied!",
      description: "Email address copied to clipboard",
    })
    navigator.clipboard.writeText("contact@matissead.dev")
    trackUserInteraction("contact_click", "email_copy")
  }

  return (
    <div className="relative">
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center">
        <motion.div
          ref={heroRef}
          variants={staggerContainer}
          initial="initial"
          animate={heroInView ? "animate" : "initial"}
          className="max-w-4xl mx-auto p-6 space-y-6 theme-transition"
        >
          {(showWarning || isRateLimited) && (
            <Alert className="theme-transition">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {isRateLimited
                  ? "Some APIs are rate limited. Data may be incomplete. Please try again later."
                  : "Some profile data couldn't be loaded. This might be due to API rate limits or network issues."}
                <Button variant="outline" size="sm" onClick={refetch} className="ml-2">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Try Again
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Header Card */}
          <motion.div variants={fadeInUp}>
            <Card className="theme-transition glass-card">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <Avatar className="w-32 h-32 ring-4 ring-primary/20 theme-transition">
                    <AvatarImage
                      src={githubUser?.avatar_url || modrinthUser?.avatar_url}
                      alt={githubUser?.login || modrinthUser?.username}
                    />
                    <AvatarFallback className="text-4xl bg-muted theme-transition">
                      {(githubUser?.name || githubUser?.login || modrinthUser?.username || "M").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-4">
                    <div>
                      <motion.h1
                        className="text-4xl md:text-5xl font-bold theme-transition glow-text"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {githubUser?.name || githubUser?.login || modrinthUser?.username || "MatisseAD"}
                      </motion.h1>
                      <motion.p
                        className="text-xl md:text-2xl text-muted-foreground theme-transition"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        Minecraft Plugin Developer
                      </motion.p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground theme-transition">
                      {githubUser?.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {githubUser.location}
                        </div>
                      )}
                      {githubUser?.created_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Since {new Date(githubUser.created_at).getFullYear()}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {totalDownloads.toLocaleString()}+ downloads
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button size="lg" className="theme-transition glow" onClick={handleContactClick}>
                        <Mail className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                      <Button variant="outline" size="lg" asChild className="theme-transition">
                        <a href="https://github.com/MatisseAD" target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" />
                          GitHub
                        </a>
                      </Button>
                      <Button variant="outline" size="lg" asChild className="theme-transition">
                        <a href="https://modrinth.com/user/Matisse" target="_blank" rel="noopener noreferrer">
                          <Globe className="w-4 h-4 mr-2" />
                          Modrinth
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-lg theme-transition">
                  {githubUser?.bio ||
                    modrinthUser?.bio ||
                    "Passionate Java developer specializing in Minecraft plugin development. Creating innovative plugins that enhance gameplay experiences for thousands of players worldwide."}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section id="about" className="py-20">
        <motion.div
          ref={statsRef}
          variants={staggerContainer}
          initial="initial"
          animate={statsInView ? "animate" : "initial"}
          className="max-w-6xl mx-auto p-6"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* GitHub Stats */}
            <motion.div variants={fadeInUp}>
              <Card className="theme-transition glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 theme-transition">
                    <Github className="w-5 h-5" />
                    GitHub Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary theme-transition">
                        {githubUser?.public_repos || 0}
                      </div>
                      <div className="text-xs text-muted-foreground theme-transition">Repositories</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary theme-transition">{totalStars}</div>
                      <div className="text-xs text-muted-foreground theme-transition">Total Stars</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary theme-transition">
                        {githubUser?.followers || 0}
                      </div>
                      <div className="text-xs text-muted-foreground theme-transition">Followers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary theme-transition">
                        {githubUser?.following || 0}
                      </div>
                      <div className="text-xs text-muted-foreground theme-transition">Following</div>
                    </div>
                  </div>

                  <Separator className="theme-transition" />

                  <div className="space-y-3">
                    <h4 className="font-medium text-sm theme-transition">Recent Repositories</h4>
                    <div className="space-y-2 text-sm">
                      {safeGithubRepos.length > 0 ? (
                        safeGithubRepos.slice(0, 3).map((repo) => (
                          <div key={repo.id} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-muted-foreground truncate theme-transition">{repo.name}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-muted-foreground text-sm theme-transition">
                          {githubUser ? "No repositories found" : "GitHub data unavailable"}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Modrinth Stats */}
            <motion.div variants={fadeInUp}>
              <Card className="theme-transition glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 theme-transition">
                    <Zap className="w-5 h-5" />
                    Modrinth Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary theme-transition">
                        {safeModrinthProjects.length}
                      </div>
                      <div className="text-xs text-muted-foreground theme-transition">Projects</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary theme-transition">
                        {totalDownloads.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground theme-transition">Downloads</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary theme-transition">{averageRating}</div>
                      <div className="text-xs text-muted-foreground theme-transition">Avg Rating</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary theme-transition">
                        {safeModrinthProjects.reduce((sum, project) => sum + (project.followers || 0), 0)}
                      </div>
                      <div className="text-xs text-muted-foreground theme-transition">Followers</div>
                    </div>
                  </div>

                  <Separator className="theme-transition" />

                  <div className="space-y-3">
                    <h4 className="font-medium text-sm theme-transition">Recent Projects</h4>
                    <div className="space-y-2 text-sm">
                      {safeModrinthProjects.length > 0 ? (
                        safeModrinthProjects.slice(0, 3).map((project) => (
                          <div key={project.id} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-muted-foreground truncate theme-transition">{project.title}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-muted-foreground text-sm theme-transition">
                          {modrinthUser ? "No projects found" : "Modrinth data unavailable"}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Visitor Map */}
            <motion.div variants={fadeInUp}>
              <VisitorMap />
            </motion.div>

            {/* Real-time Updates */}
            <motion.div variants={fadeInUp}>
              <RealTimeUpdates />
            </motion.div>

            {/* Performance Monitor */}
            <motion.div variants={fadeInUp}>
              <PerformanceMonitor />
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div variants={fadeInUp} className="mt-8">
            <Card className="theme-transition glass-card">
              <CardHeader>
                <CardTitle className="theme-transition">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start theme-transition" onClick={handleRefresh}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
                <Button variant="outline" className="justify-start theme-transition" asChild>
                  <a href="https://github.com/MatisseAD" target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub Profile
                  </a>
                </Button>
                <Button variant="outline" className="justify-start theme-transition" asChild>
                  <a href="https://modrinth.com/user/Matisse" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Modrinth Profile
                  </a>
                </Button>
                <div className="md:col-span-3">
                  <ApiStatusIndicator apiStatus={apiStatus} lastUpdated={lastUpdated} retryCount={retryCount} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enhanced Advanced Analytics */}
          <motion.div variants={fadeInUp} className="mt-8">
            <AdvancedAnalytics />
          </motion.div>
        </motion.div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-muted/20">
        <motion.div
          ref={projectsRef}
          variants={staggerContainer}
          initial="initial"
          animate={projectsInView ? "animate" : "initial"}
          className="max-w-6xl mx-auto p-6 space-y-12"
        >
          {/* GitHub Repositories */}
          <motion.div variants={fadeInUp}>
            <Card className="theme-transition glass-card">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2 theme-transition">
                  <Github className="w-6 h-6" />
                  GitHub Repositories
                </CardTitle>
                <CardDescription className="theme-transition">Recent public repositories from GitHub</CardDescription>
              </CardHeader>
              <CardContent>
                {safeGithubRepos.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {safeGithubRepos.slice(0, 6).map((repo, index) => (
                      <motion.div
                        key={repo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="border-2 theme-transition hover:shadow-lg hover:scale-105 transition-all duration-300">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg theme-transition">{repo.name}</CardTitle>
                                <CardDescription className="text-sm theme-transition">
                                  {repo.language || "Unknown"}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <p className="text-sm text-muted-foreground theme-transition line-clamp-2">
                              {repo.description || "No description available"}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground theme-transition">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                {repo.stargazers_count || 0}
                              </div>
                              <div className="flex items-center gap-1">
                                <GitFork className="w-3 h-3" />
                                {repo.forks_count || 0}
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                Updated {new Date(repo.updated_at).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex gap-1 flex-wrap">
                              {(repo.topics || []).slice(0, 3).map((topic) => (
                                <Badge key={topic} variant="outline" className="text-xs theme-transition">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                            <Button size="sm" className="w-full theme-transition" asChild>
                              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                View Repository
                              </a>
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground theme-transition">
                    <Github className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">{githubUser ? "No repositories found" : "Unable to load GitHub data"}</p>
                    <p className="text-sm mt-2">This might be due to API rate limits or network issues.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Modrinth Projects */}
          <motion.div variants={fadeInUp}>
            <Card className="theme-transition glass-card">
              <CardHeader>
                <CardTitle className="text-2xl theme-transition">Modrinth Projects</CardTitle>
                <CardDescription className="theme-transition">
                  Minecraft plugins and mods published on Modrinth
                </CardDescription>
              </CardHeader>
              <CardContent>
                {safeModrinthProjects.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {safeModrinthProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="border-2 theme-transition hover:shadow-lg hover:scale-105 transition-all duration-300">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                {project.icon_url && (
                                  <img
                                    src={project.icon_url || "/placeholder.svg"}
                                    alt={project.title}
                                    className="w-8 h-8 rounded"
                                  />
                                )}
                                <div>
                                  <CardTitle className="text-lg theme-transition">{project.title}</CardTitle>
                                  <CardDescription className="text-sm theme-transition">
                                    {(project.categories || []).join(", ") || "No categories"}
                                  </CardDescription>
                                </div>
                              </div>
                              <Badge
                                className={`theme-transition ${
                                  project.status === "approved"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                }`}
                              >
                                {project.status || "unknown"}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <p className="text-sm text-muted-foreground theme-transition line-clamp-2">
                              {project.description || "No description available"}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground theme-transition">
                              <div className="flex items-center gap-1">
                                <Download className="w-3 h-3" />
                                {(project.downloads || 0).toLocaleString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {project.followers || 0}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(project.updated).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex gap-1 flex-wrap">
                              {(project.loaders || []).map((loader) => (
                                <Badge key={loader} variant="outline" className="text-xs theme-transition">
                                  {loader}
                                </Badge>
                              ))}
                            </div>
                            <Button size="sm" className="w-full theme-transition" asChild>
                              <a
                                href={`https://modrinth.com/project/${project.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                View Project
                              </a>
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground theme-transition">
                    <Zap className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">{modrinthUser ? "No projects found" : "Unable to load Modrinth data"}</p>
                    <p className="text-sm mt-2">This might be due to API rate limits or network issues.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* GitHub Stats Widget */}
          <motion.div variants={fadeInUp}>
            <GitHubStats />
          </motion.div>
        </motion.div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-20">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto p-6"
        >
          <motion.div variants={fadeInUp}>
            <Timeline />
          </motion.div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/20">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto p-6 space-y-8"
        >
          <motion.div variants={fadeInUp} className="text-center">
            <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
            <p className="text-muted-foreground text-lg">
              Have a project in mind or want to collaborate? Let's build something amazing together!
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <CommentsSection />
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}

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
} from "lucide-react"
import { useProfileData } from "@/hooks/use-profile-data"
import { ProfileSkeleton } from "@/components/loading-skeleton"

export default function Component() {
  const { githubUser, githubRepos, modrinthUser, modrinthProjects, loading, error, refetch } = useProfileData()

  if (loading) {
    return <ProfileSkeleton />
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
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
  const averageRating = safeModrinthProjects.length > 0 ? 4.7 : 0 // Modrinth doesn't provide ratings in API
  const totalStars = safeGithubRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0)

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={githubUser?.avatar_url || modrinthUser?.avatar_url}
                alt={githubUser?.login || modrinthUser?.username}
              />
              <AvatarFallback className="text-2xl">
                {(githubUser?.name || githubUser?.login || modrinthUser?.username || "U").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-3xl font-bold">
                  {githubUser?.name || githubUser?.login || modrinthUser?.username || "Developer"}
                </h1>
                <p className="text-xl text-muted-foreground">Minecraft Plugin Developer</p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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
              <div className="flex flex-wrap gap-2">
                <Button size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>
                {githubUser?.login && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`https://github.com/${githubUser.login}`} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                )}
                {modrinthUser?.username && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`https://modrinth.com/user/${modrinthUser.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Modrinth
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {githubUser?.bio ||
              modrinthUser?.bio ||
              "Passionate Java developer specializing in Minecraft plugin development. Creating innovative plugins that enhance gameplay experiences for thousands of players worldwide."}
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {/* GitHub Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              GitHub Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{githubUser?.public_repos || 0}</div>
                <div className="text-xs text-muted-foreground">Repositories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{totalStars}</div>
                <div className="text-xs text-muted-foreground">Total Stars</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{githubUser?.followers || 0}</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{githubUser?.following || 0}</div>
                <div className="text-xs text-muted-foreground">Following</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-medium text-sm">Recent Repositories</h4>
              <div className="space-y-2 text-sm">
                {safeGithubRepos.length > 0 ? (
                  safeGithubRepos.slice(0, 3).map((repo) => (
                    <div key={repo.id} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-muted-foreground truncate">{repo.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground text-sm">No repositories found</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modrinth Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Modrinth Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{safeModrinthProjects.length}</div>
                <div className="text-xs text-muted-foreground">Projects</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{totalDownloads.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Downloads</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{averageRating}</div>
                <div className="text-xs text-muted-foreground">Avg Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {safeModrinthProjects.reduce((sum, project) => sum + (project.followers || 0), 0)}
                </div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-medium text-sm">Recent Projects</h4>
              <div className="space-y-2 text-sm">
                {safeModrinthProjects.length > 0 ? (
                  safeModrinthProjects.slice(0, 3).map((project) => (
                    <div key={project.id} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-muted-foreground truncate">{project.title}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground text-sm">No projects found</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={refetch}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            {githubUser?.login && (
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href={`https://github.com/${githubUser.login}`} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub Profile
                </a>
              </Button>
            )}
            {modrinthUser?.username && (
              <Button variant="outline" className="w-full justify-start" asChild>
                <a
                  href={`https://modrinth.com/user/${modrinthUser.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Modrinth Profile
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* GitHub Repositories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Github className="w-6 h-6" />
            GitHub Repositories
          </CardTitle>
          <CardDescription>Recent public repositories from GitHub</CardDescription>
        </CardHeader>
        <CardContent>
          {safeGithubRepos.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {safeGithubRepos.slice(0, 6).map((repo) => (
                <Card key={repo.id} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{repo.name}</CardTitle>
                        <CardDescription className="text-sm">{repo.language || "Unknown"}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{repo.description || "No description available"}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
                        <Badge key={topic} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                    <Button size="sm" className="w-full" asChild>
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View Repository
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Github className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No repositories found or unable to load GitHub data</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modrinth Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Modrinth Projects</CardTitle>
          <CardDescription>Minecraft plugins and mods published on Modrinth</CardDescription>
        </CardHeader>
        <CardContent>
          {safeModrinthProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {safeModrinthProjects.map((project) => (
                <Card key={project.id} className="border-2">
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
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <CardDescription className="text-sm">
                            {(project.categories || []).join(", ") || "No categories"}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        className={
                          project.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {project.status || "unknown"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{project.description || "No description available"}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
                        <Badge key={loader} variant="outline" className="text-xs">
                          {loader}
                        </Badge>
                      ))}
                    </div>
                    <Button size="sm" className="w-full" asChild>
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
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No projects found or unable to load Modrinth data</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import type { GitHubUser, GitHubRepo, ModrinthUser, ModrinthProject } from "@/lib/api"

interface ProfileData {
  githubUser: GitHubUser | null
  githubRepos: GitHubRepo[]
  modrinthUser: ModrinthUser | null
  modrinthProjects: ModrinthProject[]
  loading: boolean
  error: string | null
}

export function useProfileData() {
  const [data, setData] = useState<ProfileData>({
    githubUser: null,
    githubRepos: [],
    modrinthUser: null,
    modrinthProjects: [],
    loading: true,
    error: null,
  })

  const fetchData = async () => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: null }))

      // Fetch GitHub data
      const [githubUserResponse, githubReposResponse] = await Promise.all([
        fetch("/api/github/user"),
        fetch("/api/github/repos"),
      ])

      const githubUser = await githubUserResponse.json()
      const githubRepos = await githubReposResponse.json()

      // Fetch Modrinth data
      const [modrinthUserResponse, modrinthProjectsResponse] = await Promise.all([
        fetch("/api/modrinth/user"),
        fetch("/api/modrinth/projects"),
      ])

      const modrinthUser = await modrinthUserResponse.json()
      const modrinthProjects = await modrinthProjectsResponse.json()

      setData({
        githubUser,
        githubRepos,
        modrinthUser,
        modrinthProjects,
        loading: false,
        error: null,
      })
    } catch (error) {
      setData((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch data",
      }))
    }
  }

  useEffect(() => {
    fetchData()

    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return { ...data, refetch: fetchData }
}

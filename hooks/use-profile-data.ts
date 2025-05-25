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

      // Fetch GitHub data with error handling
      const [githubUserResponse, githubReposResponse] = await Promise.all([
        fetch("/api/github/user").catch(() => ({ ok: false, json: () => Promise.resolve(null) })),
        fetch("/api/github/repos").catch(() => ({ ok: false, json: () => Promise.resolve([]) })),
      ])

      const githubUser = githubUserResponse.ok ? await githubUserResponse.json() : null
      const githubReposData = githubReposResponse.ok ? await githubReposResponse.json() : []

      // Ensure githubRepos is always an array
      const githubRepos = Array.isArray(githubReposData) ? githubReposData : []

      // Fetch Modrinth data with error handling
      const [modrinthUserResponse, modrinthProjectsResponse] = await Promise.all([
        fetch("/api/modrinth/user").catch(() => ({ ok: false, json: () => Promise.resolve(null) })),
        fetch("/api/modrinth/projects").catch(() => ({ ok: false, json: () => Promise.resolve([]) })),
      ])

      const modrinthUser = modrinthUserResponse.ok ? await modrinthUserResponse.json() : null
      const modrinthProjectsData = modrinthProjectsResponse.ok ? await modrinthProjectsResponse.json() : []

      // Ensure modrinthProjects is always an array
      const modrinthProjects = Array.isArray(modrinthProjectsData) ? modrinthProjectsData : []

      setData({
        githubUser: githubUser?.error ? null : githubUser,
        githubRepos,
        modrinthUser: modrinthUser?.error ? null : modrinthUser,
        modrinthProjects,
        loading: false,
        error: null,
      })
    } catch (error) {
      console.error("Error fetching profile data:", error)
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

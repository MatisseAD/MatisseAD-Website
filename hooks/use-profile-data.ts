"use client"

import { useState, useEffect, useCallback } from "react"
import { retryWithBackoff, shouldRetryHttpError } from "@/lib/retry-utils"
import type { GitHubUser, GitHubRepo, ModrinthUser, ModrinthProject } from "@/lib/api"

interface ProfileData {
  githubUser: GitHubUser | null
  githubRepos: GitHubRepo[]
  modrinthUser: ModrinthUser | null
  modrinthProjects: ModrinthProject[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  retryCount: number
}

interface ApiStatus {
  github: "success" | "error" | "rate-limited"
  modrinth: "success" | "error" | "rate-limited"
}

export function useProfileData() {
  const [data, setData] = useState<ProfileData>({
    githubUser: null,
    githubRepos: [],
    modrinthUser: null,
    modrinthProjects: [],
    loading: true,
    error: null,
    lastUpdated: null,
    retryCount: 0,
  })

  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    github: "success",
    modrinth: "success",
  })

  const fetchWithRetry = useCallback(async (url: string, retryOptions = {}) => {
    const fetchFn = async () => {
      const response = await fetch(url)

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`)
        ;(error as any).status = response.status
        throw error
      }

      return response.json()
    }

    return retryWithBackoff(fetchFn, {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 8000,
      retryCondition: shouldRetryHttpError,
      ...retryOptions,
    })
  }, [])

  const fetchData = useCallback(
    async (isRetry = false) => {
      try {
        setData((prev) => ({
          ...prev,
          loading: true,
          error: null,
          retryCount: isRetry ? prev.retryCount + 1 : 0,
        }))

        // Fetch all data with retry logic
        const [githubUserResult, githubReposResult, modrinthUserResult, modrinthProjectsResult] =
          await Promise.allSettled([
            fetchWithRetry("/api/github/user"),
            fetchWithRetry("/api/github/repos"),
            fetchWithRetry("/api/modrinth/user"),
            fetchWithRetry("/api/modrinth/projects"),
          ])

        // Process GitHub user data
        let githubUser = null
        let githubStatus: "success" | "error" | "rate-limited" = "success"

        if (githubUserResult.status === "fulfilled" && githubUserResult.value.success) {
          const userData = githubUserResult.value.data
          if (userData && !userData.error) {
            githubUser = userData
          }
        } else {
          githubStatus = "error"
          if (githubUserResult.status === "fulfilled" && githubUserResult.value.error?.status === 403) {
            githubStatus = "rate-limited"
          }
          console.warn(
            "GitHub user request failed:",
            githubUserResult.status === "fulfilled" ? githubUserResult.value.error : githubUserResult.reason,
          )
        }

        // Process GitHub repos data
        let githubRepos: GitHubRepo[] = []
        if (githubReposResult.status === "fulfilled" && githubReposResult.value.success) {
          const reposData = githubReposResult.value.data
          githubRepos = Array.isArray(reposData) ? reposData : []
        } else {
          if (githubReposResult.status === "fulfilled" && githubReposResult.value.error?.status === 403) {
            githubStatus = "rate-limited"
          }
          console.warn(
            "GitHub repos request failed:",
            githubReposResult.status === "fulfilled" ? githubReposResult.value.error : githubReposResult.reason,
          )
        }

        // Process Modrinth user data
        let modrinthUser = null
        let modrinthStatus: "success" | "error" | "rate-limited" = "success"

        if (modrinthUserResult.status === "fulfilled" && modrinthUserResult.value.success) {
          const userData = modrinthUserResult.value.data
          if (userData && !userData.error) {
            modrinthUser = userData
          }
        } else {
          modrinthStatus = "error"
          if (modrinthUserResult.status === "fulfilled" && modrinthUserResult.value.error?.status === 429) {
            modrinthStatus = "rate-limited"
          }
          console.warn(
            "Modrinth user request failed:",
            modrinthUserResult.status === "fulfilled" ? modrinthUserResult.value.error : modrinthUserResult.reason,
          )
        }

        // Process Modrinth projects data
        let modrinthProjects: ModrinthProject[] = []
        if (modrinthProjectsResult.status === "fulfilled" && modrinthProjectsResult.value.success) {
          const projectsData = modrinthProjectsResult.value.data
          modrinthProjects = Array.isArray(projectsData) ? projectsData : []
        } else {
          if (modrinthProjectsResult.status === "fulfilled" && modrinthProjectsResult.value.error?.status === 429) {
            modrinthStatus = "rate-limited"
          }
          console.warn(
            "Modrinth projects request failed:",
            modrinthProjectsResult.status === "fulfilled"
              ? modrinthProjectsResult.value.error
              : modrinthProjectsResult.reason,
          )
        }

        // Update API status
        setApiStatus({
          github: githubStatus,
          modrinth: modrinthStatus,
        })

        setData((prev) => ({
          ...prev,
          githubUser,
          githubRepos,
          modrinthUser,
          modrinthProjects,
          loading: false,
          error: null,
          lastUpdated: new Date(),
        }))
      } catch (error) {
        console.error("Error fetching profile data:", error)
        setData((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to fetch data",
        }))
      }
    },
    [fetchWithRetry],
  )

  const refetch = useCallback(() => {
    fetchData(true)
  }, [fetchData])

  useEffect(() => {
    fetchData()

    // Refresh data every 15 minutes (increased to reduce API calls)
    const interval = setInterval(() => fetchData(), 15 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  return {
    ...data,
    refetch,
    apiStatus,
    isRateLimited: apiStatus.github === "rate-limited" || apiStatus.modrinth === "rate-limited",
  }
}

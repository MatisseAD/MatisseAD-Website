// GitHub API types
export interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  topics: string[]
}

export interface GitHubUser {
  login: string
  name: string
  bio: string | null
  avatar_url: string
  location: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
}

// Modrinth API types
export interface ModrinthUser {
  id: string
  username: string
  name: string | null
  bio: string | null
  avatar_url: string
  created: string
}

export interface ModrinthProject {
  id: string
  slug: string
  title: string
  description: string
  categories: string[]
  downloads: number
  followers: number
  icon_url: string | null
  updated: string
  published: string
  status: string
  game_versions: string[]
  loaders: string[]
}

// API functions
export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  const response = await fetch(`https://api.github.com/users/${username}`)
  if (!response.ok) {
    throw new Error("Failed to fetch GitHub user")
  }
  return response.json()
}

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`)
  if (!response.ok) {
    throw new Error("Failed to fetch GitHub repositories")
  }
  return response.json()
}

export async function fetchModrinthUser(username: string): Promise<ModrinthUser> {
  const response = await fetch(`https://api.modrinth.com/v2/user/${username}`)
  if (!response.ok) {
    throw new Error("Failed to fetch Modrinth user")
  }
  return response.json()
}

export async function fetchModrinthProjects(userId: string): Promise<ModrinthProject[]> {
  const response = await fetch(`https://api.modrinth.com/v2/user/${userId}/projects`)
  if (!response.ok) {
    throw new Error("Failed to fetch Modrinth projects")
  }
  return response.json()
}

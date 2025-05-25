export interface FeatureFlags {
  enableMusic: boolean
  enableParticles: boolean
  enableDiscordWidget: boolean
  enableVisitorMap: boolean
  enableComments: boolean
  enableRealTimeUpdates: boolean
  enableAdvancedAnalytics: boolean
  maintenanceMode: boolean
  betaFeatures: boolean
}

export interface DeploymentInfo {
  commitSha: string
  region: string
  environment: string
  buildTime: string
  version: string
}

export async function getFeatureFlags(): Promise<FeatureFlags> {
  // Return default flags without edge-config dependency
  return {
    enableMusic: true,
    enableParticles: true,
    enableDiscordWidget: true,
    enableVisitorMap: true,
    enableComments: true,
    enableRealTimeUpdates: true,
    enableAdvancedAnalytics: true,
    maintenanceMode: false,
    betaFeatures: false,
  }
}

export function getVercelEnv(): DeploymentInfo {
  return {
    commitSha: process.env.VERCEL_GIT_COMMIT_SHA || "local-dev",
    region: process.env.VERCEL_REGION || "local",
    environment: process.env.VERCEL_ENV || "development",
    buildTime: new Date().toISOString(),
    version: "1.0.0",
  }
}

export function getDeploymentUrl(): string {
  if (process.env.VERCEL_ENV === "production") {
    return "https://your-domain.com"
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return "http://localhost:3000"
}

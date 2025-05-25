import { retryWithBackoff, shouldRetryHttpError, createHttpError } from "./retry-utils"

interface ApiRequestOptions {
  headers?: Record<string, string>
  timeout?: number
  retryOptions?: {
    maxRetries?: number
    baseDelay?: number
    maxDelay?: number
  }
}

export class ApiClient {
  private defaultHeaders: Record<string, string>
  private defaultTimeout: number

  constructor() {
    this.defaultHeaders = {
      "User-Agent": "MatisseAD-Website/1.0",
      Accept: "application/json",
    }
    this.defaultTimeout = 10000 // 10 seconds
  }

  async get<T>(url: string, options: ApiRequestOptions = {}): Promise<T> {
    const { headers = {}, timeout = this.defaultTimeout, retryOptions = {} } = options

    const fetchWithTimeout = async (): Promise<T> => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      try {
        const response = await fetch(url, {
          headers: { ...this.defaultHeaders, ...headers },
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw createHttpError(response)
        }

        return await response.json()
      } catch (error) {
        clearTimeout(timeoutId)

        if (error.name === "AbortError") {
          throw new Error(`Request timeout after ${timeout}ms`)
        }

        throw error
      }
    }

    const result = await retryWithBackoff(fetchWithTimeout, {
      maxRetries: retryOptions.maxRetries || 3,
      baseDelay: retryOptions.baseDelay || 1000,
      maxDelay: retryOptions.maxDelay || 8000,
      retryCondition: shouldRetryHttpError,
    })

    if (!result.success) {
      console.error(`API request failed after ${result.attempts} attempts:`, result.error)
      throw result.error
    }

    return result.data!
  }
}

export const apiClient = new ApiClient()

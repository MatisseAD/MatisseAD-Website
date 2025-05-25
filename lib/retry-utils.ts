interface RetryOptions {
  maxRetries?: number
  baseDelay?: number
  maxDelay?: number
  backoffFactor?: number
  retryCondition?: (error: any) => boolean
}

interface RetryResult<T> {
  data: T | null
  success: boolean
  error?: Error
  attempts: number
}

export async function retryWithBackoff<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<RetryResult<T>> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    retryCondition = (error) => true,
  } = options

  let lastError: Error
  let attempts = 0

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    attempts = attempt + 1

    try {
      const result = await fn()
      return {
        data: result,
        success: true,
        attempts,
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Don't retry if this is the last attempt or if retry condition fails
      if (attempt === maxRetries || !retryCondition(lastError)) {
        break
      }

      // Calculate delay with exponential backoff and jitter
      const delay = Math.min(baseDelay * Math.pow(backoffFactor, attempt) + Math.random() * 1000, maxDelay)

      console.warn(`Attempt ${attempt + 1} failed, retrying in ${Math.round(delay)}ms:`, lastError.message)

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  return {
    data: null,
    success: false,
    error: lastError!,
    attempts,
  }
}

export function shouldRetryHttpError(error: any): boolean {
  // Retry on network errors
  if (error.name === "TypeError" && error.message.includes("fetch")) {
    return true
  }

  // Retry on specific HTTP status codes
  if (error.status) {
    const retryableStatuses = [408, 429, 500, 502, 503, 504]
    return retryableStatuses.includes(error.status)
  }

  return true
}

export function createHttpError(response: Response): Error {
  const error = new Error(`HTTP ${response.status}: ${response.statusText}`)
  ;(error as any).status = response.status
  ;(error as any).statusText = response.statusText
  return error
}

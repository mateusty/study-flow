import axios from 'axios'

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const responseData: unknown = error.response?.data
    if (typeof responseData === 'string' && responseData.trim()) return responseData
    if (responseData && typeof responseData === 'object') {
      const details = responseData as { message?: unknown; detail?: unknown; title?: unknown }
      for (const value of [details.message, details.detail, details.title]) {
        if (typeof value === 'string' && value.trim()) return value
      }
    }
  }

  return error instanceof Error && error.message ? error.message : fallback
}
export const API_BASE_URL = 'https://frontend-task-chatapp.onrender.com/api'

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? window.sessionStorage.getItem('relay_token') : null
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  })
  const body = await response.json().catch(() => null)
  if (!response.ok) throw new ApiError(body?.message ?? body?.error ?? `Request failed (${response.status})`, response.status)
  return body as T
}

export type ApiEnvelope<T> = T | { data?: T; items?: T; results?: T }

export function unwrap<T>(payload: ApiEnvelope<T>): T {
  if (payload && typeof payload === 'object' && 'data' in payload && payload.data !== undefined) return payload.data as T
  if (payload && typeof payload === 'object' && 'items' in payload && payload.items !== undefined) return payload.items as T
  if (payload && typeof payload === 'object' && 'results' in payload && payload.results !== undefined) return payload.results as T
  return payload as T
}

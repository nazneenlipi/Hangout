import { apiFetch, unwrap, type ApiEnvelope } from './client'
import { User } from '@/types/user'

export interface LoginResponse {
  token: string
  user: User
}

export const authApi = {
  login: async (phoneNumber: string, name: string): Promise<LoginResponse> => {
    const res = await apiFetch<ApiEnvelope<LoginResponse>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, name }),
    })
    return unwrap(res)
  },

  getCurrentUser: async (): Promise<User> => {
    const res = await apiFetch<ApiEnvelope<User>>('/auth/me')
    return unwrap(res)
  },
}

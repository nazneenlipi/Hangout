import { apiFetch, unwrap, type ApiEnvelope } from './client'
import { ENDPOINTS } from './endpoints'
import { User } from '@/types/user'

export interface LoginResponse {
  token: string
  user: User
}

export const authApi = {
  login: async (phoneNumber: string, name: string): Promise<LoginResponse> => {
    const res = await apiFetch<ApiEnvelope<LoginResponse>>(ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({
        phone: phoneNumber,
        phoneNumber: phoneNumber,
        name: name,
      }),
    })
    return unwrap(res)
  },

  getCurrentUser: async (): Promise<User> => {
    const res = await apiFetch<ApiEnvelope<User>>(ENDPOINTS.AUTH.ME)
    return unwrap(res)
  },
}

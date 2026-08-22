'use client'

import { useCallback, useEffect, useState } from 'react'
import { chatApi } from '../api/chat'

export function useAuth() {
  const [token, setToken] = useState<string | null>(null)
  useEffect(() => setToken(window.sessionStorage.getItem('relay_token')), [])
  const login = useCallback(async (phoneNumber: string, name: string) => {
    const result = await chatApi.login(phoneNumber, name)
    const nextToken = (result as { token?: string }).token ?? ''
    window.sessionStorage.setItem('relay_token', nextToken)
    setToken(nextToken)
    return result
  }, [])
  const logout = useCallback(() => { window.sessionStorage.removeItem('relay_token'); setToken(null) }, [])
  return { token, isAuthenticated: Boolean(token), isLoading: token === null, login, logout }
}

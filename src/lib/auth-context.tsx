'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User } from '@/types/user'
import { authApi } from '@/lib/api/auth'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (phoneNumber: string, name: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEFAULT_USER: User = {
  id: 'usr_me',
  name: 'Jamie Rivera',
  phoneNumber: '+15550192',
  avatarColor: 'bg-[#111827] text-white',
  isOnline: true,
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEFAULT_USER)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const storedToken =
      typeof window !== 'undefined'
        ? window.sessionStorage.getItem('relay_token') || window.localStorage.getItem('relay_token')
        : null

    const storedUserStr =
      typeof window !== 'undefined' ? window.localStorage.getItem('relay_user') : null

    if (storedToken) {
      setToken(storedToken)
    }
    if (storedUserStr) {
      try {
        setUser(JSON.parse(storedUserStr))
      } catch (e) {
        setUser(DEFAULT_USER)
      }
    } else {
      setUser(DEFAULT_USER)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (phoneNumber: string, name: string) => {
    setIsLoading(true)
    try {
      const res = await authApi.login(phoneNumber, name)
      const authToken = res.token || 'demo-token'
      const loggedUser = res.user || {
        id: 'usr_' + Date.now(),
        name,
        phoneNumber,
        avatarColor: 'bg-[#111827] text-white',
        isOnline: true,
      }
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('relay_token', authToken)
        window.localStorage.setItem('relay_user', JSON.stringify(loggedUser))
      }
      setToken(authToken)
      setUser(loggedUser)
    } catch (err) {
      // Fallback for offline/demo mode
      const demoUser: User = {
        id: 'usr_' + Date.now(),
        name,
        phoneNumber,
        avatarColor: 'bg-[#111827] text-white',
        isOnline: true,
      }
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('relay_token', 'demo-token-123')
        window.localStorage.setItem('relay_user', JSON.stringify(demoUser))
      }
      setToken('demo-token-123')
      setUser(demoUser)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('relay_token')
      window.localStorage.removeItem('relay_token')
      window.localStorage.removeItem('relay_user')
    }
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user || token),
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

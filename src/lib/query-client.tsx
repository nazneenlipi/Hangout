'use client'

import React, { createContext, useContext, useRef } from 'react'

interface QueryClient {
  invalidateQueries: (key: string) => void
}

const QueryClientContext = createContext<QueryClient | undefined>(undefined)

export const QueryClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClientRef = useRef<QueryClient>({
    invalidateQueries: (key: string) => {},
  })

  return (
    <QueryClientContext.Provider value={queryClientRef.current}>
      {children}
    </QueryClientContext.Provider>
  )
}

export function useQueryClient() {
  const context = useContext(QueryClientContext)
  if (!context) {
    throw new Error('useQueryClient must be used within a QueryClientProvider')
  }
  return context
}

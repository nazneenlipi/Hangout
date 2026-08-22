'use client'

import React from 'react'
import { AlertCircle, Inbox, Loader2 } from 'lucide-react'

export interface StateWrapperProps {
  isLoading?: boolean
  error?: Error | string | null
  isEmpty?: boolean
  emptyMessage?: string
  loadingMessage?: string
  errorMessage?: string
  children: React.ReactNode
}

export const StateWrapper: React.FC<StateWrapperProps> = ({
  isLoading = false,
  error = null,
  isEmpty = false,
  emptyMessage = 'No items found',
  loadingMessage = 'Loading...',
  errorMessage,
  children,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-[#8993a3]">
        <Loader2 className="mb-2 size-6 animate-spin text-[#2357d5]" />
        <p className="text-xs">{loadingMessage}</p>
      </div>
    )
  }

  if (error) {
    const message = errorMessage || (typeof error === 'string' ? error : error.message)
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-[#e11d48]">
        <AlertCircle className="mb-2 size-6" />
        <p className="text-xs font-medium">{message}</p>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-[#8993a3]">
        <Inbox className="mb-2 size-6" />
        <p className="text-xs">{emptyMessage}</p>
      </div>
    )
  }

  return <>{children}</>
}

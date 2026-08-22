'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-[#e5e9f0]', className)}
      {...props}
    />
  )
}

export const ConversationSkeleton: React.FC = () => {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <Skeleton className="size-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-40" />
      </div>
    </div>
  )
}

export const MessageBubbleSkeleton: React.FC<{ isRight?: boolean }> = ({ isRight = false }) => {
  return (
    <div className={cn('flex flex-col gap-1', isRight ? 'items-end' : 'items-start')}>
      <Skeleton className={cn('h-10 rounded-2xl', isRight ? 'w-48' : 'w-56')} />
      <Skeleton className="h-2.5 w-12" />
    </div>
  )
}

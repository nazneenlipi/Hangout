'use client'

import React from 'react'
import { Users } from 'lucide-react'
import { cn, getInitials, getAvatarBgColor } from '@/lib/utils'

export interface AvatarProps {
  name: string
  isGroup?: boolean
  isOnline?: boolean
  color?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  isGroup = false,
  isOnline = false,
  color,
  size = 'md',
  className,
}) => {
  const bgStyle = color || getAvatarBgColor(name)

  const sizeClasses = {
    sm: 'size-8 text-[11px]',
    md: 'size-10 text-xs',
    lg: 'size-12 text-sm',
  }

  const iconSizes = {
    sm: 14,
    md: 17,
    lg: 20,
  }

  return (
    <div
      className={cn(
        'relative grid shrink-0 place-items-center rounded-full font-semibold',
        sizeClasses[size],
        bgStyle,
        className
      )}
    >
      {isGroup ? <Users size={iconSizes[size]} /> : getInitials(name)}
      {isOnline && !isGroup && (
        <span
          className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-[#2fb477]"
          title="Online"
        />
      )}
    </div>
  )
}

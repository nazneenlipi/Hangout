'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2357d5]/30 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]'

    const variants = {
      primary:
        'bg-[#2357d5] text-white hover:bg-[#1744b6] shadow-md shadow-[#2357d5]/20 rounded-xl',
      secondary:
        'bg-[#f5f7fa] text-[#111827] hover:bg-[#e9edf3] rounded-xl',
      outline:
        'border border-[#e1e6ee] bg-white text-[#657083] hover:bg-[#f7f8fa] hover:text-[#111827] rounded-xl',
      ghost:
        'text-[#657083] hover:bg-[#f5f7fa] hover:text-[#111827] rounded-xl',
      icon:
        'grid size-9 place-items-center rounded-xl border border-[#e1e6ee] text-[#657083] hover:bg-[#f7f8fa]',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3.5 text-base font-semibold',
      icon: 'size-9 p-0',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          variant !== 'icon' && sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3.5 text-[#9aa4b2] pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-xl bg-[#f5f7fa] py-2.5 text-sm text-[#111827] outline-none transition placeholder:text-[#9aa4b2] focus:bg-white focus:ring-2 focus:ring-[#2357d5]/20 border border-transparent focus:border-[#2357d5]',
            icon ? 'pl-10 pr-3.5' : 'px-3.5',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)

Input.displayName = 'Input'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full resize-none bg-transparent py-2 text-sm text-[#111827] outline-none placeholder:text-[#9aa4b2]',
          className
        )}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'

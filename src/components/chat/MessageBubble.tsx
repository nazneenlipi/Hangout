'use client'

import React from 'react'
import { Check, CheckCheck } from 'lucide-react'
import { Message } from '@/types/message'
import { cn } from '@/lib/utils'

export interface MessageBubbleProps {
  message: Message
  showSenderName?: boolean
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  showSenderName = false,
}) => {
  const isMe = message.from === 'me'

  return (
    <div className={cn('flex flex-col', isMe ? 'items-end' : 'items-start')}>
      {!isMe && showSenderName && message.senderName && (
        <span className="mb-1 text-[10px] font-semibold text-[#657083] ml-1">
          {message.senderName}
        </span>
      )}
      <div
        className={cn(
          'max-w-[82%] sm:max-w-[70%] md:max-w-[62%] rounded-2xl px-4 py-3 text-sm leading-6 transition-all',
          isMe
            ? 'rounded-br-md bg-[#2357d5] text-white shadow-sm shadow-[#2357d5]/10'
            : 'rounded-bl-md border border-[#e3e8f0] bg-white text-[#3f4857] shadow-sm'
        )}
      >
        {message.content}
      </div>

      <div
        className={cn(
          'mt-1 flex items-center gap-1 text-[10px] text-[#a0a8b5]',
          isMe ? 'text-right justify-end' : ''
        )}
      >
        <span>{message.createdAt}</span>
        {isMe && (
          <span className="inline-flex items-center ml-0.5">
            {message.status === 'sending' ? (
              <span className="inline-block size-2 animate-pulse rounded-full bg-white/60" />
            ) : message.status === 'delivered' ? (
              <CheckCheck size={13} className="text-[#2357d5]" />
            ) : (
              <Check size={13} className="text-[#a0a8b5]" />
            )}
          </span>
        )}
      </div>
    </div>
  )
}

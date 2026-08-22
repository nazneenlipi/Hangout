'use client'

import React from 'react'
import { Conversation } from '@/types/conversation'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

export interface ConversationListItemProps {
  conversation: Conversation
  isSelected: boolean
  onClick: () => void
}

export const ConversationListItem: React.FC<ConversationListItemProps> = React.memo(({
  conversation,
  isSelected,
  onClick,
}) => {
  const lastMessageText =
    conversation.lastMessage?.text ||
    conversation.lastMessage?.content ||
    'No messages yet'

  const timeDisplay =
    conversation.lastMessage?.time ||
    conversation.lastMessage?.createdAt ||
    ''

  const isOnline = conversation.participants?.some((p) => p.isOnline) ?? false

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 border-l-2 px-5 py-4 text-left transition',
        isSelected
          ? 'border-[#2357d5] bg-[#f1f5ff]'
          : 'border-transparent hover:bg-[#fafbfd]'
      )}
    >
      <Avatar
        name={conversation.name}
        isGroup={conversation.isGroup}
        isOnline={isOnline}
        color={conversation.color}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-[#111827]">
            {conversation.name}
          </p>
          {timeDisplay && (
            <span className="shrink-0 text-[10px] text-[#9aa4b2]">
              {timeDisplay}
            </span>
          )}
        </div>
        <p className="mt-1 truncate text-xs text-[#8993a3]">
          {lastMessageText}
        </p>
      </div>
      {conversation.unreadCount && conversation.unreadCount > 0 ? (
        <span className="grid size-5 place-items-center rounded-full bg-[#2357d5] text-[10px] font-bold text-white">
          {conversation.unreadCount}
        </span>
      ) : null}
    </button>
  )
})


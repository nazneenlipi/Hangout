'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, MoreHorizontal } from 'lucide-react'
import { Conversation } from '@/types/conversation'
import { Message } from '@/types/message'
import { Avatar } from '@/components/ui/Avatar'
import { MessageBubble } from './MessageBubble'
import { MessageInput } from './MessageInput'
import { useAutoScroll } from '@/hooks/useAutoScroll'

export interface MessageThreadProps {
  conversation: Conversation
  messages: Message[]
  onSendMessage: (content: string) => void
  onBack?: () => void
}

export const MessageThread: React.FC<MessageThreadProps> = ({
  conversation,
  messages,
  onSendMessage,
  onBack,
}) => {
  const { scrollRef, scrollToBottom } = useAutoScroll<HTMLDivElement>()

  useEffect(() => {
    scrollToBottom('auto')
  }, [conversation.id, scrollToBottom])

  useEffect(() => {
    scrollToBottom('smooth')
  }, [messages.length, scrollToBottom])

  return (
    <section className="flex min-w-0 flex-1 flex-col h-full bg-[#fcfdff]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#e9edf3] bg-white px-5 sm:px-7 py-4 shrink-0">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="mr-1 grid size-9 place-items-center rounded-xl border border-[#e1e6ee] text-[#657083] hover:bg-[#f7f8fa] md:hidden"
              aria-label="Back to conversations"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <Avatar
            name={conversation.name}
            isGroup={conversation.isGroup}
            isOnline={true}
            color={conversation.color}
          />
          <div>
            <h1 className="text-sm font-semibold text-[#111827]">
              {conversation.name}
            </h1>
            <p className="text-xs text-[#2fb477]">Active recently</p>
          </div>
        </div>
        <button
          className="grid size-9 place-items-center rounded-lg text-[#8993a3] hover:bg-[#f5f7fa] transition"
          aria-label="More options"
        >
          <MoreHorizontal size={19} />
        </button>
      </header>

      {/* Messages Stream */}
      <div
        ref={scrollRef}
        className="flex flex-1 flex-col gap-5 overflow-y-auto bg-[#fcfdff] px-5 sm:px-7 py-8"
      >
        {messages.length === 0 ? (
          <div className="my-auto text-center text-xs text-[#9aa4b2]">
            No messages yet. Send a message to start the conversation!
          </div>
        ) : (
          messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              showSenderName={conversation.isGroup}
            />
          ))
        )}
      </div>

      {/* Input Composer */}
      <MessageInput onSend={onSendMessage} />
    </section>
  )
}

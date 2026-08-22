'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MessageThread } from '@/components/chat/MessageThread'
import { useConversations } from '@/hooks/useConversations'
import { useMessages } from '@/hooks/useMessages'

export default function ActiveConversationPage() {
  const params = useParams()
  const router = useRouter()
  const conversationId = (params?.conversationId as string) || null

  const { allConversations } = useConversations()
  const { messages, sendMessage } = useMessages(conversationId)

  const activeConversation = allConversations.find((c) => c.id === conversationId) || {
    id: conversationId || 'conv_1',
    name: conversationId === 'conv_2' ? 'Product notes' : conversationId === 'conv_3' ? 'Jordan Kim' : 'Alex Lee',
    isGroup: conversationId === 'conv_2',
    color: conversationId === 'conv_2' ? 'bg-[#d6e4fb] text-[#2357d5]' : conversationId === 'conv_3' ? 'bg-[#d8eddf] text-[#27774d]' : 'bg-[#f4d5c5] text-[#9c4c27]',
  }

  const handleBack = () => {
    router.push('/chat')
  }

  return (
    <MessageThread
      conversation={activeConversation}
      messages={messages}
      onSendMessage={sendMessage}
      onBack={handleBack}
    />
  )
}

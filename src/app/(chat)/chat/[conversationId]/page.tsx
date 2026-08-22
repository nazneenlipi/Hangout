'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MessageThread } from '@/components/chat/MessageThread'
import { useConversations } from '@/hooks/useConversations'
import { useMessages } from '@/hooks/useMessages'
import { Conversation } from '@/types/conversation'

export default function ActiveConversationPage() {
  const params = useParams()
  const router = useRouter()
  const conversationId = (params?.conversationId as string) || null

  const { allConversations } = useConversations()
  const { messages, sendMessage } = useMessages(conversationId)
  const foundConv = allConversations.find((c) => c.id === conversationId)

  const activeConversation: Conversation = foundConv || {
    id: conversationId || '',
    name: 'Chat',
    isGroup: false,
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

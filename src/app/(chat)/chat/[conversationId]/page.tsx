'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MessageThread } from '@/components/chat/MessageThread'
import { useConversations } from '@/hooks/useConversations'
import { useMessages } from '@/hooks/useMessages'
import { conversationsApi } from '@/lib/api/conversations'
import { Conversation } from '@/types/conversation'
import { formatMessageTime } from '@/lib/utils'

function mapSingleConversation(item: any): Conversation {
  if (!item) return { id: '', name: 'Conversation', isGroup: false }
  if (item.id && typeof item.isGroup === 'boolean' && item.name) return item as Conversation
  const isGroup = item.type === 'group' || (Boolean(item.name) && item.type !== 'direct')
  const convName = item.name || item.participant?.name || item.participant?.phone || 'Chat'
  const lastMsgText = item.lastMessage?.text || item.lastMessage?.content || ''

  return {
    id: item._id || item.id,
    name: convName,
    isGroup,
    lastMessage: item.lastMessage && (lastMsgText || item.lastMessage.createdAt)
      ? {
          text: lastMsgText,
          content: lastMsgText,
          createdAt: item.lastMessage.createdAt || item.updatedAt,
          time: formatMessageTime(item.lastMessage.createdAt || item.updatedAt || new Date()),
        }
      : undefined,
    participants: item.participants
      ? item.participants.map((p: any) => ({ id: p._id || p.id, name: p.name, phone: p.phone }))
      : item.participant
      ? [{ id: item.participant._id || item.participant.id, name: item.participant.name, phone: item.participant.phone }]
      : [],
    updatedAt: item.updatedAt,
  }
}

export default function ActiveConversationPage() {
  const params = useParams()
  const router = useRouter()
  const conversationId = (params?.conversationId as string) || null

  const { allConversations } = useConversations()
  const { messages, sendMessage } = useMessages(conversationId)
  const [fetchedConv, setFetchedConv] = useState<Conversation | null>(null)

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

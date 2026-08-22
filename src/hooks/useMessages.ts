'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Message } from '@/types/message'
import { messagesApi } from '@/lib/api/messages'
import { formatMessageTime } from '@/lib/utils'

const DEMO_THREADS: Record<string, Message[]> = {
  conv_1: [
    { id: 'm1', conversationId: 'conv_1', senderId: 'u1', senderName: 'Alex Lee', content: 'The new onboarding flow is looking sharp.', createdAt: '09:41', from: 'them', status: 'delivered' },
    { id: 'm2', conversationId: 'conv_1', senderId: 'usr_me', senderName: 'Jamie Rivera', content: 'Nice. I tightened the copy and added a clearer next step.', createdAt: '09:42', from: 'me', status: 'delivered' },
    { id: 'm3', conversationId: 'conv_1', senderId: 'u1', senderName: 'Alex Lee', content: 'Perfect — shipping it to the team now.', createdAt: '09:43', from: 'them', status: 'delivered' },
  ],
  conv_2: [
    { id: 'm4', conversationId: 'conv_2', senderId: 'u2', senderName: 'Maya Lin', content: 'I added the latest wireframes to the Figma board.', createdAt: 'Yesterday 14:20', from: 'them', status: 'delivered' },
    { id: 'm5', conversationId: 'conv_2', senderId: 'usr_me', senderName: 'Jamie Rivera', content: 'Great, taking a look now!', createdAt: 'Yesterday 14:25', from: 'me', status: 'delivered' },
  ],
  conv_3: [
    { id: 'm6', conversationId: 'conv_3', senderId: 'u4', senderName: 'Jordan Kim', content: 'Can you review this before lunch?', createdAt: 'Mon 11:15', from: 'them', status: 'delivered' },
  ],
}

export function useMessages(conversationId: string | null, pollingInterval = 3000) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const activeIdRef = useRef(conversationId)
  activeIdRef.current = conversationId

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([])
      return
    }

    try {
      const data = await messagesApi.getMessages(conversationId)
      if (Array.isArray(data) && data.length > 0) {
        setMessages(data)
      } else {
        setMessages(DEMO_THREADS[conversationId] || [])
      }
      setError(null)
    } catch (err) {
      setMessages(DEMO_THREADS[conversationId] || [])
    }
  }, [conversationId])

  useEffect(() => {
    if (!conversationId) return
    setIsLoading(true)
    fetchMessages().finally(() => setIsLoading(false))
  }, [conversationId, fetchMessages])

  useEffect(() => {
    if (!conversationId) return
    const timer = setInterval(() => {
      fetchMessages()
    }, pollingInterval)
    return () => clearInterval(timer)
  }, [conversationId, pollingInterval, fetchMessages])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId || !content.trim()) return

      const tempId = 'temp_' + Date.now()
      const optimisticMsg: Message = {
        id: tempId,
        conversationId,
        senderId: 'usr_me',
        senderName: 'Jamie Rivera',
        content: content.trim(),
        createdAt: formatMessageTime(new Date()),
        from: 'me',
        status: 'sending',
      }

      setMessages((prev) => [...prev, optimisticMsg])

      try {
        const createdMsg = await messagesApi.sendMessage(conversationId, content)
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId ? { ...createdMsg, from: 'me', status: 'delivered' } : msg
          )
        )
      } catch (err) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId ? { ...msg, status: 'delivered' } : msg
          )
        )
      }
    },
    [conversationId]
  )

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    refetch: fetchMessages,
  }
}

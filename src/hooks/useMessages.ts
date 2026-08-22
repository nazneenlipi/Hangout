'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Message } from '@/types/message'
import { messagesApi } from '@/lib/api/messages'
import { formatMessageTime } from '@/lib/utils'
import { useSocket } from './useSocket'
import { useAuthContext } from '@/lib/auth-context'

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
  const { token, user } = useAuthContext()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const activeIdRef = useRef(conversationId)
  activeIdRef.current = conversationId

  const handleIncomingSocketMessage = useCallback(
    (rawMsg: any) => {
      if (!rawMsg) return
      const targetConvId = rawMsg.conversationId || rawMsg.conversation_id
      if (activeIdRef.current && targetConvId === activeIdRef.current) {
        const formattedMsg: Message = {
          id: rawMsg.id || 'msg_' + Date.now(),
          conversationId: targetConvId,
          senderId: rawMsg.senderId || rawMsg.sender_id || 'them',
          senderName: rawMsg.senderName || rawMsg.sender_name || 'Contact',
          content: rawMsg.text || rawMsg.content || '',
          createdAt: formatMessageTime(rawMsg.createdAt || new Date()),
          from: (rawMsg.senderId || rawMsg.sender_id) === user?.id ? 'me' : 'them',
          status: 'delivered',
        }
        setMessages((prev) => {
          if (prev.some((m) => m.id === formattedMsg.id)) return prev
          return [...prev, formattedMsg]
        })
      }
    },
    [user?.id]
  )

  const { sendSocketMessage } = useSocket(token, handleIncomingSocketMessage)

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([])
      return
    }

    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(conversationId)
    if (!isValidObjectId) {
      setMessages(DEMO_THREADS[conversationId] || [])
      setError(null)
      return
    }

    try {
      const data = await messagesApi.getMessages(conversationId)
      if (Array.isArray(data)) {
        const mapped = data.map((m: any) => ({
          id: m._id || m.id || 'msg_' + Math.random(),
          conversationId,
          senderId: m.sender?._id || m.senderId || m.sender || 'them',
          senderName: m.sender?.name || m.senderName || 'Contact',
          content: m.text || m.content || '',
          createdAt: formatMessageTime(m.createdAt || m.created_at || new Date()),
          from: (m.sender?._id || m.senderId || m.sender) === user?.id ? ('me' as const) : ('them' as const),
          status: 'delivered' as const,
        }))
        setMessages(mapped)
      } else {
        setMessages(DEMO_THREADS[conversationId] || [])
      }
      setError(null)
    } catch (err) {
      setMessages(DEMO_THREADS[conversationId] || [])
    }
  }, [conversationId, user?.id])

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
        senderId: user?.id || 'usr_me',
        senderName: user?.name || 'Jamie Rivera',
        content: content.trim(),
        createdAt: formatMessageTime(new Date()),
        from: 'me',
        status: 'sending',
      }

      setMessages((prev) => [...prev, optimisticMsg])

      const sentViaSocket = sendSocketMessage(conversationId, content.trim())

      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(conversationId)
      if (!isValidObjectId) {
        const deliveredMsg: Message = { ...optimisticMsg, status: 'delivered' }
        if (!DEMO_THREADS[conversationId]) {
          DEMO_THREADS[conversationId] = []
        }
        if (!DEMO_THREADS[conversationId].some((m) => m.id === tempId)) {
          DEMO_THREADS[conversationId].push(deliveredMsg)
        }
        setMessages((prev) =>
          prev.map((msg) => (msg.id === tempId ? deliveredMsg : msg))
        )
        return
      }

      try {
        const createdMsg = await messagesApi.sendMessage(conversationId, content.trim())
        const resAny = createdMsg as any
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId
              ? {
                  id: resAny?._id || resAny?.id || tempId,
                  conversationId,
                  senderId: user?.id || 'usr_me',
                  senderName: user?.name || 'Jamie Rivera',
                  content: resAny?.content || resAny?.text || content.trim(),
                  createdAt: formatMessageTime(resAny?.createdAt || new Date()),
                  from: 'me',
                  status: 'delivered',
                }
              : msg
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
    [conversationId, user?.id, user?.name, sendSocketMessage]
  )

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    refetch: fetchMessages,
  }
}

import { useState, useEffect, useCallback, useRef } from 'react'
import { Message } from '@/types/message'
import { messagesApi } from '@/lib/api/messages'
import { formatMessageTime, isValidObjectId } from '@/lib/utils'
import { useSocket } from './useSocket'
import { useAuthContext } from '@/lib/auth-context'
import { DEMO_THREADS } from '@/lib/constants/demoData'
import { mapBackendMessage } from '@/lib/api/mappers'

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
        const formattedMsg = mapBackendMessage(rawMsg, user?.id)
        setMessages((prev) => {
          if (prev.some((m) => m.id === formattedMsg.id)) return prev
          return [...prev, formattedMsg]
        })
      }
    },
    [user?.id]
  )

  const { sendSocketMessage } = useSocket(token, handleIncomingSocketMessage)

  const isFetchingRef = useRef<boolean>(false)

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([])
      return
    }

    if (typeof document !== 'undefined' && document.hidden) return
    if (isFetchingRef.current) return

    if (!isValidObjectId(conversationId)) {
      setMessages(DEMO_THREADS[conversationId] || [])
      setError(null)
      return
    }

    try {
      isFetchingRef.current = true
      const data = await messagesApi.getMessages(conversationId)
      if (Array.isArray(data)) {
        const mapped = data.map((m: any) => mapBackendMessage(m, user?.id))
        setMessages(mapped)
      } else {
        setMessages(DEMO_THREADS[conversationId] || [])
      }
      setError(null)
    } catch (err) {
      setMessages(DEMO_THREADS[conversationId] || [])
    } finally {
      isFetchingRef.current = false
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
    }, Math.max(pollingInterval, 6000))
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

      if (!isValidObjectId(conversationId)) {
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

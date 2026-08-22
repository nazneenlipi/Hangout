'use client'

import { useState, useEffect, useCallback } from 'react'
import { Conversation } from '@/types/conversation'
import { conversationsApi } from '@/lib/api/conversations'
import { useAuthContext } from '@/lib/auth-context'
import { formatMessageTime } from '@/lib/utils'

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    name: 'Alex Lee',
    isGroup: false,
    color: 'bg-[#f4d5c5] text-[#9c4c27]',
    lastMessage: { text: 'Perfect — shipping it to the team now.', content: 'Perfect — shipping it to the team now.', time: '09:43', createdAt: '09:43' },
    participants: [{ id: 'u1', name: 'Alex Lee', avatarColor: 'bg-[#f4d5c5] text-[#9c4c27]', isOnline: true }],
  },
  {
    id: 'conv_2',
    name: 'Product notes',
    isGroup: true,
    color: 'bg-[#d6e4fb] text-[#2357d5]',
    lastMessage: { text: 'Maya: I added the latest wireframes.', content: 'Maya: I added the latest wireframes.', time: 'Yesterday', createdAt: 'Yesterday' },
    participants: [
      { id: 'u2', name: 'Maya Lin', isOnline: true },
      { id: 'u3', name: 'Devon Bell', isOnline: false },
    ],
  },
  {
    id: 'conv_3',
    name: 'Jordan Kim',
    isGroup: false,
    color: 'bg-[#d8eddf] text-[#27774d]',
    lastMessage: { text: 'Can you review this before lunch?', content: 'Can you review this before lunch?', time: 'Mon', createdAt: 'Mon' },
    participants: [{ id: 'u4', name: 'Jordan Kim', avatarColor: 'bg-[#d8eddf] text-[#27774d]', isOnline: false }],
  },
]

function mapBackendConversation(item: any): Conversation {
  if (!item) return { id: '', name: 'Conversation', isGroup: false }
  if (item.id && typeof item.isGroup === 'boolean' && item.name && !item._id) {
    return item as Conversation
  }

  const isGroup = item.type === 'group' || (Array.isArray(item.participants) && item.participants.length > 2)
  const convName = item.name || item.participant?.name || item.participant?.phone || item.phone || 'Conversation'
  const lastMsgText = item.lastMessage?.text || item.lastMessage?.content || ''

  const participantsList = item.participants
    ? item.participants.map((p: any) => ({ id: p._id || p.id, name: p.name || p.phone, phone: p.phone }))
    : item.participant
    ? [{ id: item.participant._id || item.participant.id, name: item.participant.name || item.participant.phone, phone: item.participant.phone }]
    : [{ id: item._id || item.id, name: item.name || item.phone, phone: item.phone }]

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
    participants: participantsList,
    updatedAt: item.updatedAt,
  }
}

export function useConversations() {
  const { token } = useAuthContext()
  const [conversations, setConversations] = useState<Conversation[]>(() => token ? [] : INITIAL_CONVERSATIONS)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const fetchConversations = useCallback(async () => {
    const currentToken =
      token ||
      (typeof window !== 'undefined'
        ? window.localStorage.getItem('relay_token') ||
          window.localStorage.getItem('token') ||
          window.sessionStorage.getItem('relay_token') ||
          window.sessionStorage.getItem('token')
        : null)

    if (!currentToken) {
      setConversations(INITIAL_CONVERSATIONS)
      return
    }

    try {
      setIsLoading(true)
      console.log('[useConversations] Fetching /api/conversations...')
      const data = await conversationsApi.getConversations()
      console.log('[useConversations] Raw API response:', data)
      if (Array.isArray(data)) {
        const mapped = data.map(mapBackendConversation)
        console.log('[useConversations] Successfully mapped conversations count:', mapped.length, mapped)
        setConversations(mapped)
      } else {
        setConversations([])
      }
      setError(null)
    } catch (err) {
      console.error('[useConversations] Error fetching conversations from API:', err)
      setError(err as Error)
      setConversations([])
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchConversations()
    const timer = setInterval(() => {
      fetchConversations()
    }, 4000)
    return () => clearInterval(timer)
  }, [fetchConversations])

  const createDirectConversation = useCallback(async (participantId: string, name: string) => {
    try {
      const raw = await conversationsApi.createConversation(participantId)
      const newConv = mapBackendConversation(raw)
      setConversations((prev) => [newConv, ...prev.filter((c) => c.id !== newConv.id)])
      return newConv
    } catch (err) {
      const fallbackConv: Conversation = {
        id: 'conv_' + Date.now(),
        name,
        isGroup: false,
        color: 'bg-[#d6e4fb] text-[#2357d5]',
        lastMessage: { text: 'Started a new conversation', content: 'Started a new conversation', time: 'now' },
        participants: [{ id: participantId, name, isOnline: true }],
      }
      setConversations((prev) => [fallbackConv, ...prev])
      return fallbackConv
    }
  }, [])

  const createGroupConversation = useCallback(async (name: string, participantIds: string[]) => {
    try {
      const raw = await conversationsApi.createGroup(name, participantIds)
      const newGroup = mapBackendConversation(raw)
      setConversations((prev) => [newGroup, ...prev])
      return newGroup
    } catch (err) {
      const fallbackGroup: Conversation = {
        id: 'group_' + Date.now(),
        name,
        isGroup: true,
        color: 'bg-[#eee4fc] text-[#6b21a8]',
        lastMessage: { text: 'Group created', content: 'Group created', time: 'now' },
        participants: participantIds.map((id, index) => ({ id, name: `Member ${index + 1}` })),
      }
      setConversations((prev) => [fallbackGroup, ...prev])
      return fallbackGroup
    }
  }, [])

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return {
    conversations: filteredConversations,
    allConversations: conversations,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    refetch: fetchConversations,
    createDirectConversation,
    createGroupConversation,
  }
}

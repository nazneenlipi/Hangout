'use client'

import { useState, useEffect, useCallback } from 'react'
import { Conversation } from '@/types/conversation'
import { conversationsApi } from '@/lib/api/conversations'
import { useAuthContext } from '@/lib/auth-context'
import { getStoredToken } from '@/lib/utils'
import { INITIAL_CONVERSATIONS } from '@/lib/constants/demoData'
import { mapBackendConversation } from '@/lib/api/mappers'

export function useConversations() {
  const { token } = useAuthContext()
  const [conversations, setConversations] = useState<Conversation[]>(() => token ? [] : INITIAL_CONVERSATIONS)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const fetchConversations = useCallback(async () => {
    const currentToken = token || getStoredToken()

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

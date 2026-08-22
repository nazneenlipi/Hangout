'use client'

import { useState, useEffect, useCallback } from 'react'
import { Conversation } from '@/types/conversation'
import { conversationsApi } from '@/lib/api/conversations'

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

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const fetchConversations = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await conversationsApi.getConversations()
      if (Array.isArray(data) && data.length > 0) {
        setConversations(data)
      }
      setError(null)
    } catch (err) {
      // Fallback to local default state on API failure or demo mode
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  const createDirectConversation = useCallback(async (participantId: string, name: string) => {
    try {
      const newConv = await conversationsApi.createConversation(participantId)
      setConversations((prev) => [newConv, ...prev])
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
      const newConv = await conversationsApi.createGroup(name, participantIds)
      setConversations((prev) => [newConv, ...prev])
      return newConv
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

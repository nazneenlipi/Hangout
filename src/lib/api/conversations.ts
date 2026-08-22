import { apiFetch, unwrap, type ApiEnvelope } from './client'
import { Conversation } from '@/types/conversation'
import { User } from '@/types/user'

export const conversationsApi = {
  getConversations: async (): Promise<Conversation[]> => {
    const res = await apiFetch<ApiEnvelope<Conversation[]>>('/conversations')
    return unwrap(res)
  },

  getConversationById: async (id: string): Promise<Conversation> => {
    const res = await apiFetch<ApiEnvelope<Conversation>>(`/conversations/${id}`)
    return unwrap(res)
  },

  createConversation: async (participantId: string): Promise<Conversation> => {
    const res = await apiFetch<ApiEnvelope<Conversation>>('/conversations', {
      method: 'POST',
      body: JSON.stringify({ participantId }),
    })
    return unwrap(res)
  },

  createGroup: async (name: string, participantIds: string[]): Promise<Conversation> => {
    const res = await apiFetch<ApiEnvelope<Conversation>>('/conversations/group', {
      method: 'POST',
      body: JSON.stringify({ name, participantIds }),
    })
    return unwrap(res)
  },

  searchUsers: async (query: string): Promise<User[]> => {
    const res = await apiFetch<ApiEnvelope<User[]>>(`/users/search?q=${encodeURIComponent(query)}`)
    return unwrap(res)
  },
}

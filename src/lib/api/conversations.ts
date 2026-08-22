import { apiFetch, unwrap, type ApiEnvelope } from './client'
import { ENDPOINTS } from './endpoints'
import { mapBackendUser } from './mappers'
import { Conversation } from '@/types/conversation'
import { User } from '@/types/user'

export const conversationsApi = {
  getConversations: async (): Promise<Conversation[]> => {
    const res = await apiFetch<ApiEnvelope<Conversation[]>>(ENDPOINTS.CONVERSATIONS.BASE)
    return unwrap(res)
  },

  getConversationById: async (id: string): Promise<Conversation> => {
    const res = await apiFetch<ApiEnvelope<Conversation>>(`${ENDPOINTS.CONVERSATIONS.BASE}/${id}`)
    return unwrap(res)
  },

  createConversation: async (participantId: string): Promise<Conversation> => {
    const res = await apiFetch<ApiEnvelope<Conversation>>(ENDPOINTS.CONVERSATIONS.BASE, {
      method: 'POST',
      body: JSON.stringify({ participantId }),
    })
    return unwrap(res)
  },

  createGroup: async (name: string, participantIds: string[]): Promise<Conversation> => {
    const res = await apiFetch<ApiEnvelope<Conversation>>(ENDPOINTS.CONVERSATIONS.GROUP, {
      method: 'POST',
      body: JSON.stringify({ name, participantIds }),
    })
    return unwrap(res)
  },

  searchUsers: async (query: string): Promise<User[]> => {
    const res = await apiFetch<ApiEnvelope<any[]>>(ENDPOINTS.USERS.SEARCH(query))
    const raw = unwrap(res)
    if (Array.isArray(raw)) {
      return raw.map(mapBackendUser)
    }
    return []
  },
}

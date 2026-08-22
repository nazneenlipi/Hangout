import { apiFetch, unwrap, type ApiEnvelope } from './client'
import { ENDPOINTS } from './endpoints'
import { Message } from '@/types/message'

export const messagesApi = {
  getMessages: async (conversationId: string): Promise<Message[]> => {
    const res = await apiFetch<ApiEnvelope<Message[]>>(ENDPOINTS.CONVERSATIONS.MESSAGES(conversationId))
    return unwrap(res)
  },

  sendMessage: async (conversationId: string, content: string): Promise<Message> => {
    const res = await apiFetch<ApiEnvelope<Message>>(ENDPOINTS.MESSAGES.SEND, {
      method: 'POST',
      body: JSON.stringify({ conversationId, text: content }),
    })
    return unwrap(res)
  },
}

export const systemApi = {
  getHealth: async (): Promise<{ status: string }> => {
    const res = await apiFetch<{ status: string }>(ENDPOINTS.SYSTEM.HEALTH)
    return res
  },
}

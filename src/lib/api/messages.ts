import { apiFetch, unwrap, type ApiEnvelope } from './client'
import { Message } from '@/types/message'

export const messagesApi = {
  getMessages: async (conversationId: string): Promise<Message[]> => {
    const res = await apiFetch<ApiEnvelope<Message[]>>(`/conversations/${conversationId}/messages`)
    return unwrap(res)
  },

  sendMessage: async (conversationId: string, content: string): Promise<Message> => {
    const res = await apiFetch<ApiEnvelope<Message>>(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    })
    return unwrap(res)
  },
}

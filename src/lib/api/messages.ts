import { apiFetch, unwrap, type ApiEnvelope } from './client'
import { Message } from '@/types/message'

export const messagesApi = {
  getMessages: async (conversationId: string): Promise<Message[]> => {
    const res = await apiFetch<ApiEnvelope<Message[]>>(`/conversations/${conversationId}/messages`)
    return unwrap(res)
  },

  sendMessage: async (conversationId: string, content: string): Promise<Message> => {
    try {
      const res = await apiFetch<ApiEnvelope<Message>>('/messages', {
        method: 'POST',
        body: JSON.stringify({ conversationId, text: content, content }),
      })
      return unwrap(res)
    } catch (err) {
      const res = await apiFetch<ApiEnvelope<Message>>(`/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ conversationId, text: content, content }),
      })
      return unwrap(res)
    }
  },
}

export const systemApi = {
  getHealth: async (): Promise<{ status: string }> => {
    const res = await apiFetch<{ status: string }>('/health')
    return res
  },
}

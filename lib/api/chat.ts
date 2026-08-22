import { apiFetch, unwrap } from './client'

export type User = { id: string; name: string; phoneNumber?: string }
export type Conversation = { id: string; name?: string; participants?: User[]; lastMessage?: { content: string; createdAt: string } }
export type Message = { id: string; content: string; senderId?: string; createdAt: string }

export const chatApi = {
  login: async (phoneNumber: string, name: string) => unwrap(await apiFetch<{ token: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ phoneNumber, name }) })),
  searchUsers: async (query: string) => unwrap(await apiFetch<User[]>(`/users/search?q=${encodeURIComponent(query)}`)),
  conversations: async () => unwrap(await apiFetch<Conversation[]>('/conversations')),
  messages: async (conversationId: string) => unwrap(await apiFetch<Message[]>(`/conversations/${conversationId}/messages`)),
  sendMessage: async (conversationId: string, content: string) => unwrap(await apiFetch<Message>(`/conversations/${conversationId}/messages`, { method: 'POST', body: JSON.stringify({ content }) })),
}

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'failed'

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName?: string
  content: string
  createdAt: string
  from: 'me' | 'them'
  status?: MessageStatus
}

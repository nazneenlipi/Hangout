import { User } from './user'
import { Message } from './message'

export interface Conversation {
  id: string
  name: string
  isGroup: boolean
  color?: string
  participants?: User[]
  lastMessage?: Partial<Message> & { text?: string; content?: string; time?: string; createdAt?: string }
  unreadCount?: number
  updatedAt?: string
}

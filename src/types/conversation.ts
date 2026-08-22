import { User } from './user'

export interface LastMessageSummary {
  text: string
  content: string
  time: string
  createdAt?: string
}

export interface Conversation {
  id: string
  name: string
  isGroup: boolean
  color?: string
  participants?: User[]
  lastMessage?: LastMessageSummary
  unreadCount?: number
  updatedAt?: string
}

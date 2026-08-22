import { Conversation } from '@/types/conversation'
import { Message } from '@/types/message'
import { User } from '@/types/user'
import {
  RawBackendUserDto,
  RawBackendConversationDto,
  RawBackendMessageDto,
} from '@/types/backendDto'
import { formatMessageTime } from '@/lib/utils'

export function mapBackendUser(u?: RawBackendUserDto | null): User {
  if (!u) return { id: '', name: 'User' }
  return {
    id: u._id || u.id || '',
    name: u.name || u.phone || u.phoneNumber || 'User',
    phoneNumber: u.phone || u.phoneNumber,
    isOnline: u.isOnline ?? true,
  }
}

export function mapBackendConversation(item?: RawBackendConversationDto | null): Conversation {
  if (!item) return { id: '', name: 'Conversation', isGroup: false }
  if (item.id && typeof item.isGroup === 'boolean' && item.name && !item._id) {
    return item as unknown as Conversation
  }

  const isGroup = item.type === 'group' || (Array.isArray(item.participants) && item.participants.length > 2)
  const convName = item.name || item.participant?.name || item.participant?.phone || item.phone || 'Conversation'
  const lastMsgText = item.lastMessage?.text || item.lastMessage?.content || ''

  const participantsList = item.participants
    ? item.participants.map(mapBackendUser)
    : item.participant
    ? [mapBackendUser(item.participant)]
    : [mapBackendUser(item as RawBackendUserDto)]

  return {
    id: item._id || item.id || '',
    name: convName,
    isGroup,
    lastMessage: item.lastMessage && (lastMsgText || item.lastMessage.createdAt)
      ? {
          text: lastMsgText,
          content: lastMsgText,
          createdAt: item.lastMessage.createdAt || item.updatedAt,
          time: formatMessageTime(item.lastMessage.createdAt || item.updatedAt || new Date()),
        }
      : undefined,
    participants: participantsList,
    updatedAt: item.updatedAt,
  }
}

export function mapBackendMessage(m?: RawBackendMessageDto | null, currentUserId?: string): Message {
  if (!m) {
    return {
      id: 'msg_' + Date.now(),
      conversationId: '',
      senderId: 'them',
      content: '',
      createdAt: formatMessageTime(new Date()),
      from: 'them',
      status: 'delivered',
    }
  }

  const senderObj = typeof m.sender === 'object' ? m.sender : null
  const senderId = senderObj?._id || senderObj?.id || m.senderId || m.sender_id || (typeof m.sender === 'string' ? m.sender : 'them')
  const senderName = senderObj?.name || m.senderName || m.sender_name || 'Contact'
  const contentText = m.text || m.content || ''
  const isMe = senderId === currentUserId

  return {
    id: m._id || m.id || 'msg_' + Math.random(),
    conversationId: m.conversationId || m.conversation_id || m.conversation || '',
    senderId,
    senderName,
    content: contentText,
    createdAt: formatMessageTime(m.createdAt || m.created_at || new Date()),
    from: isMe ? 'me' : 'them',
    status: 'delivered',
  }
}

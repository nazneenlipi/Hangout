import { Conversation } from '@/types/conversation'
import { Message } from '@/types/message'
import { User } from '@/types/user'
import { formatMessageTime } from '@/lib/utils'

export function mapBackendUser(u: any): User {
  if (!u) return { id: '', name: 'User' }
  return {
    id: u._id || u.id || '',
    name: u.name || u.phone || u.phoneNumber || 'User',
    phoneNumber: u.phone || u.phoneNumber,
    isOnline: u.isOnline ?? true,
  }
}

export function mapBackendConversation(item: any): Conversation {
  if (!item) return { id: '', name: 'Conversation', isGroup: false }
  if (item.id && typeof item.isGroup === 'boolean' && item.name && !item._id) {
    return item as Conversation
  }

  const isGroup = item.type === 'group' || (Array.isArray(item.participants) && item.participants.length > 2)
  const convName = item.name || item.participant?.name || item.participant?.phone || item.phone || 'Conversation'
  const lastMsgText = item.lastMessage?.text || item.lastMessage?.content || ''

  const participantsList = item.participants
    ? item.participants.map(mapBackendUser)
    : item.participant
    ? [mapBackendUser(item.participant)]
    : [mapBackendUser(item)]

  return {
    id: item._id || item.id,
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

export function mapBackendMessage(m: any, currentUserId?: string): Message {
  const senderId = m.sender?._id || m.senderId || m.sender_id || m.sender || 'them'
  const senderName = m.sender?.name || m.senderName || m.sender_name || 'Contact'
  const contentText = m.text || m.content || ''
  const isMe = senderId === currentUserId

  return {
    id: m._id || m.id || 'msg_' + Math.random(),
    conversationId: m.conversationId || m.conversation || '',
    senderId,
    senderName,
    content: contentText,
    createdAt: formatMessageTime(m.createdAt || m.created_at || new Date()),
    from: isMe ? 'me' : 'them',
    status: 'delivered',
  }
}

export interface RawBackendUserDto {
  _id?: string
  id?: string
  name?: string
  phone?: string
  phoneNumber?: string
  isOnline?: boolean
}

export interface RawBackendMessageDto {
  _id?: string
  id?: string
  conversationId?: string
  conversation_id?: string
  conversation?: string
  senderId?: string
  sender_id?: string
  sender?: RawBackendUserDto | string
  senderName?: string
  sender_name?: string
  text?: string
  content?: string
  createdAt?: string
  created_at?: string
  updatedAt?: string
}

export interface RawBackendConversationDto {
  _id?: string
  id?: string
  type?: 'direct' | 'group' | string
  name?: string
  phone?: string
  isGroup?: boolean
  participant?: RawBackendUserDto
  participants?: RawBackendUserDto[]
  lastMessage?: RawBackendMessageDto
  updatedAt?: string
  createdAt?: string
}

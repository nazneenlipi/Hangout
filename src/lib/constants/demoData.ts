import { Conversation } from '@/types/conversation'
import { Message } from '@/types/message'

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    name: 'Alex Lee',
    isGroup: false,
    color: 'bg-[#f4d5c5] text-[#9c4c27]',
    lastMessage: { text: 'Perfect — shipping it to the team now.', content: 'Perfect — shipping it to the team now.', time: '09:43', createdAt: '09:43' },
    participants: [{ id: 'u1', name: 'Alex Lee', avatarColor: 'bg-[#f4d5c5] text-[#9c4c27]', isOnline: true }],
  },
  {
    id: 'conv_2',
    name: 'Product notes',
    isGroup: true,
    color: 'bg-[#d6e4fb] text-[#2357d5]',
    lastMessage: { text: 'Maya: I added the latest wireframes.', content: 'Maya: I added the latest wireframes.', time: 'Yesterday', createdAt: 'Yesterday' },
    participants: [
      { id: 'u2', name: 'Maya Lin', isOnline: true },
      { id: 'u3', name: 'Devon Bell', isOnline: false },
    ],
  },
  {
    id: 'conv_3',
    name: 'Jordan Kim',
    isGroup: false,
    color: 'bg-[#d8eddf] text-[#27774d]',
    lastMessage: { text: 'Can you review this before lunch?', content: 'Can you review this before lunch?', time: 'Mon', createdAt: 'Mon' },
    participants: [{ id: 'u4', name: 'Jordan Kim', avatarColor: 'bg-[#d8eddf] text-[#27774d]', isOnline: false }],
  },
]

export const DEMO_THREADS: Record<string, Message[]> = {
  conv_1: [
    { id: 'm1', conversationId: 'conv_1', senderId: 'u1', senderName: 'Alex Lee', content: 'The new onboarding flow is looking sharp.', createdAt: '09:41', from: 'them', status: 'delivered' },
    { id: 'm2', conversationId: 'conv_1', senderId: 'usr_me', senderName: 'Jamie Rivera', content: 'Nice. I tightened the copy and added a clearer next step.', createdAt: '09:42', from: 'me', status: 'delivered' },
    { id: 'm3', conversationId: 'conv_1', senderId: 'u1', senderName: 'Alex Lee', content: 'Perfect — shipping it to the team now.', createdAt: '09:43', from: 'them', status: 'delivered' },
  ],
  conv_2: [
    { id: 'm4', conversationId: 'conv_2', senderId: 'u2', senderName: 'Maya Lin', content: 'I added the latest wireframes to the Figma board.', createdAt: 'Yesterday 14:20', from: 'them', status: 'delivered' },
    { id: 'm5', conversationId: 'conv_2', senderId: 'usr_me', senderName: 'Jamie Rivera', content: 'Great, taking a look now!', createdAt: 'Yesterday 14:25', from: 'me', status: 'delivered' },
  ],
  conv_3: [
    { id: 'm6', conversationId: 'conv_3', senderId: 'u4', senderName: 'Jordan Kim', content: 'Can you review this before lunch?', createdAt: 'Mon 11:15', from: 'them', status: 'delivered' },
  ],
}

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  MessageCircle,
  Plus,
  Search,
  UserPlus,
  Users,
  LogIn,
} from 'lucide-react'
import { Conversation } from '@/types/conversation'
import { ConversationListItem } from './ConversationListItem'
import { NewConversationModal } from './NewConversationModal'
import { NewGroupModal } from './NewGroupModal'
import { useAuthContext } from '@/lib/auth-context'
import { User } from '@/types/user'

export interface ConversationListProps {
  conversations: Conversation[]
  selectedId: string | null
  searchQuery: string
  onSearchChange: (q: string) => void
  onSelectConversation: (id: string) => void
  onCreateDirect: (participantId: string, name: string) => void
  onCreateGroup: (groupName: string, participantIds: string[]) => void
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedId,
  searchQuery,
  onSearchChange,
  onSelectConversation,
  onCreateDirect,
  onCreateGroup,
}) => {
  const { user } = useAuthContext()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDirectModalOpen, setIsDirectModalOpen] = useState(false)
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)

  const displayedConversations = conversations.filter((c) => {
    if (filter === 'unread') return (c.unreadCount ?? 0) > 0
    return true
  })

  return (
    <aside className="flex w-full flex-col border-r border-[#e9edf3] bg-white md:w-[330px] lg:w-[360px] shrink-0 h-full">
      <div className="flex items-center justify-between px-5 py-5">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-[#2357d5] text-white shadow-sm shadow-[#2357d5]/30">
            <MessageCircle size={16} />
          </span>
          relay<span className="text-[#2357d5]">.</span>
        </Link>
        <div className="relative flex items-center gap-2">
          <Link
            href="/login"
            className="flex items-center gap-1 rounded-xl border border-[#e1e6ee] px-2.5 py-1.5 text-xs font-semibold text-[#111827] hover:bg-[#f7f8fa] transition"
            title="Log in"
          >
            <LogIn size={14} className="text-[#2357d5]" /> Login
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="grid size-9 place-items-center rounded-xl border border-[#e1e6ee] text-[#657083] transition hover:bg-[#f7f8fa]"
            aria-label="New conversation"
          >
            <Plus size={18} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-11 z-30 w-48 rounded-xl border border-[#e1e6ee] bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95">
              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  setIsDirectModalOpen(true)
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#111827] hover:bg-[#f5f7fa] transition"
              >
                <UserPlus size={15} className="text-[#2357d5]" />
                Direct Message
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  setIsGroupModalOpen(true)
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#111827] hover:bg-[#f5f7fa] transition"
              >
                <Users size={15} className="text-[#2357d5]" />
                New Group Chat
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 pb-4">
        <label className="flex items-center gap-2 rounded-xl bg-[#f5f7fa] px-3 py-2.5 text-sm text-[#9aa4b2] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2357d5]/20 border border-transparent focus-within:border-[#2357d5]">
          <Search size={16} />
          <input
            className="w-full bg-transparent text-xs sm:text-sm text-[#111827] outline-none placeholder:text-[#9aa4b2]"
            placeholder="Search conversations"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search conversations"
          />
        </label>
      </div>

      <div className="flex items-center justify-between px-5 pb-3 text-xs font-semibold uppercase tracking-wider text-[#9aa4b2]">
        <span>Messages</span>
        <button
          onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
          className="flex items-center gap-1 normal-case tracking-normal text-[#657083] hover:text-[#111827] transition"
        >
          {filter === 'all' ? 'All' : 'Unread'}{' '}
          <ChevronDown size={13} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {displayedConversations.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#9aa4b2]">
            No conversations found
          </div>
        ) : (
          displayedConversations.map((conv) => (
            <ConversationListItem
              key={conv.id}
              conversation={conv}
              isSelected={selectedId === conv.id}
              onClick={() => onSelectConversation(conv.id)}
            />
          ))
        )}
      </div>

      <div className="border-t border-[#e9edf3] p-4">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-full bg-[#111827] text-xs font-semibold text-white">
            {user?.name ? user.name.split(' ').map((n) => n[0]).join('') : 'JR'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-[#111827]">
              {user?.name || 'Jamie Rivera'}
            </p>
            <p className="text-xs text-[#8993a3]">Online</p>
          </div>
          <Link
            href="/login"
            className="flex items-center gap-1 text-xs font-semibold text-[#2357d5] hover:underline"
          >
            <LogIn size={15} /> Switch
          </Link>
        </div>
      </div>

      <NewConversationModal
        isOpen={isDirectModalOpen}
        onClose={() => setIsDirectModalOpen(false)}
        onSelectUser={(u: User) => onCreateDirect(u.id, u.name)}
      />
      <NewGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onCreateGroup={onCreateGroup}
      />
    </aside>
  )
}

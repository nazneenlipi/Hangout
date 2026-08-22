'use client'

import React, { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ConversationList } from '@/components/chat/ConversationList'
import { useConversations } from '@/hooks/useConversations'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const {
    conversations,
    searchQuery,
    setSearchQuery,
    createDirectConversation,
    createGroupConversation,
  } = useConversations()

  // Determine active conversation ID from path
  const pathParts = pathname.split('/')
  const selectedId = pathParts.length > 2 && pathParts[1] === 'chat' ? pathParts[2] : null

  const handleSelectConversation = (id: string) => {
    router.push(`/chat/${id}`)
  }

  const handleCreateDirect = async (participantId: string, name: string) => {
    const conv = await createDirectConversation(participantId, name)
    if (conv?.id) {
      router.push(`/chat/${conv.id}`)
    }
  }

  const handleCreateGroup = async (groupName: string, participantIds: string[]) => {
    const conv = await createGroupConversation(groupName, participantIds)
    if (conv?.id) {
      router.push(`/chat/${conv.id}`)
    }
  }

  // On mobile: if conversation is selected, hide list; if no conversation, hide thread
  const isViewingThreadOnMobile = Boolean(selectedId)

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#111827] lg:p-5 flex items-center justify-center">
      <div className="mx-auto flex h-screen w-full max-w-[1500px] overflow-hidden border-[#e1e6ee] bg-white lg:h-[calc(100vh-40px)] lg:rounded-2xl lg:border lg:shadow-xl lg:shadow-[#b9c5d8]/25">
        <div className={`h-full w-full md:w-auto ${isViewingThreadOnMobile ? 'hidden md:flex' : 'flex'}`}>
          <ConversationList
            conversations={conversations}
            selectedId={selectedId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectConversation={handleSelectConversation}
            onCreateDirect={handleCreateDirect}
            onCreateGroup={handleCreateGroup}
          />
        </div>

        <div className={`h-full flex-1 min-w-0 ${!isViewingThreadOnMobile ? 'hidden md:flex' : 'flex'}`}>
          {children}
        </div>
      </div>
    </main>
  )
}

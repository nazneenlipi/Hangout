'use client'

import React from 'react'
import { MessageCircle } from 'lucide-react'

export default function EmptyChatPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-[#fcfdff] p-8 text-center h-full w-full">
      <div className="mx-auto max-w-sm">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-[#f0f5ff] text-[#2357d5] shadow-xs">
          <MessageCircle size={28} />
        </div>
        <h2 className="text-lg font-semibold text-[#111827]">Choose a conversation</h2>
        <p className="mt-2 text-sm leading-6 text-[#8993a3]">
          Select a message from the sidebar list or start a new direct message / group to start chatting.
        </p>
      </div>
    </div>
  )
}

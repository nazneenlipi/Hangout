'use client'

import React, { useState, useRef, KeyboardEvent } from 'react'
import { Paperclip, Send, Smile } from 'lucide-react'

export interface MessageInputProps {
  onSend: (content: string) => void
  placeholder?: string
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  placeholder = 'Write a message…',
}) => {
  const [draft, setDraft] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (!draft.trim()) return
    onSend(draft.trim())
    setDraft('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-[#e9edf3] bg-white p-4 sm:p-5">
      <div className="flex items-end gap-2 sm:gap-3 rounded-2xl border border-[#dfe5ee] bg-[#fbfcfe] px-3 py-2 transition focus-within:border-[#2357d5] focus-within:ring-4 focus-within:ring-[#2357d5]/10">
        <button
          type="button"
          className="grid size-9 place-items-center rounded-xl text-[#8993a3] hover:bg-[#f0f4fa] hover:text-[#111827] transition"
          aria-label="Attach file"
        >
          <Paperclip size={18} />
        </button>

        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="max-h-28 min-h-9 flex-1 resize-none bg-transparent py-2 text-sm outline-none placeholder:text-[#9aa4b2]"
          aria-label="Message text"
        />

        <button
          type="button"
          className="grid size-9 place-items-center rounded-xl text-[#8993a3] hover:bg-[#f0f4fa] hover:text-[#111827] transition"
          aria-label="Add emoji"
        >
          <Smile size={18} />
        </button>

        <button
          type="button"
          onClick={handleSend}
          disabled={!draft.trim()}
          className="grid size-9 place-items-center rounded-xl bg-[#2357d5] text-white transition hover:bg-[#1744b6] disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-[#2357d5]/20"
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </div>
      <p className="mt-2 text-center text-[10px] text-[#a0a8b5]">
        Enter to send · Shift + Enter for a new line
      </p>
    </div>
  )
}

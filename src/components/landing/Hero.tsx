'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, MessageCircle } from 'lucide-react'

const INITIAL_MESSAGES = [
  { from: 'them', text: 'The new onboarding flow is looking sharp.', time: '09:41' },
  { from: 'me', text: 'Nice. I tightened the copy and added a clearer next step.', time: '09:42' },
  { from: 'them', text: 'Perfect — shipping it to the team now.', time: '09:43' },
]

export const Hero: React.FC = () => {
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState(INITIAL_MESSAGES)

  const handleSend = () => {
    if (!draft.trim()) return
    setMessages([
      ...messages,
      { from: 'me', text: draft.trim(), time: 'now' },
    ])
    setDraft('')
  }

  return (
    <section className="mx-auto grid max-w-7xl items-center gap-16 px-6 pb-20 pt-14 lg:grid-cols-[1fr_0.9fr] lg:px-10 lg:pb-28 lg:pt-20">
      <div>
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dbe3f4] bg-white px-3 py-1.5 text-xs font-medium text-[#2357d5] shadow-xs">
          <span className="size-1.5 rounded-full bg-[#2fb477]" /> Conversations, without the noise
        </div>

        <h1 className="max-w-2xl text-balance text-5xl font-semibold leading-[1.04] tracking-[-0.05em] sm:text-7xl text-[#111827]">
          The calm way to <span className="text-[#2357d5]">stay in touch.</span>
        </h1>

        <p className="mt-7 max-w-lg text-lg leading-8 text-[#657083]">
          A focused chat workspace for quick conversations, thoughtful groups, and messages that move with your team.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link
            href="/chat"
            className="rounded-full bg-[#2357d5] px-6 py-3.5 text-sm font-medium text-white shadow-[0_8px_25px_rgba(35,87,213,0.22)] transition hover:-translate-y-0.5 hover:bg-[#1744b6]"
          >
            Enter the workspace <ArrowUpRight className="ml-2 inline" size={16} />
          </Link>
          <a
            href="#preview"
            className="text-sm font-medium text-[#657083] hover:text-[#111827] transition"
          >
            See how it works ↓
          </a>
        </div>
      </div>

      <div id="preview" className="relative">
        <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-[#e9eefb] rotate-2" />
        <div className="overflow-hidden rounded-[1.75rem] border border-[#dfe5ee] bg-white shadow-2xl shadow-[#c9d4e8]/50">
          <div className="flex items-center justify-between border-b border-[#edf0f4] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="relative grid size-9 place-items-center rounded-full bg-[#f4d5c5] text-sm font-semibold text-[#9c4c27]">
                AL
                <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-[#2fb477]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111827]">Alex Lee</p>
                <p className="text-xs text-[#2fb477]">Online now</p>
              </div>
            </div>
            <span className="text-xs text-[#a0a8b5]">Today</span>
          </div>

          <div className="flex min-h-[330px] flex-col gap-4 bg-[#fbfcfe] p-5">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.from === 'me' ? 'ml-auto max-w-[78%]' : 'max-w-[78%]'}
              >
                <div
                  className={
                    m.from === 'me'
                      ? 'rounded-2xl rounded-br-md bg-[#2357d5] px-4 py-3 text-sm leading-5 text-white'
                      : 'rounded-2xl rounded-bl-md border border-[#e4e8ef] bg-white px-4 py-3 text-sm leading-5 text-[#3f4857]'
                  }
                >
                  {m.text}
                </div>
                <p
                  className={`mt-1 text-[10px] text-[#a0a8b5] ${
                    m.from === 'me' ? 'text-right' : ''
                  }`}
                >
                  {m.time}
                  {m.from === 'me' && i === messages.length - 1 ? ' · Delivered' : ''}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 border-t border-[#edf0f4] bg-white p-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Write a message…"
              className="min-w-0 flex-1 bg-transparent px-2 text-sm text-[#111827] outline-none placeholder:text-[#a0a8b5]"
              aria-label="Demo message"
            />
            <button
              onClick={handleSend}
              className="grid size-9 place-items-center rounded-xl bg-[#2357d5] text-white hover:bg-[#1744b6] transition"
              aria-label="Send demo message"
            >
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

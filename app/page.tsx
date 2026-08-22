'use client'

import Link from 'next/link'
import { ArrowUpRight, Check, MessageCircle, Radio, Search, Users } from 'lucide-react'
import { useState } from 'react'

const demoMessages = [
  { from: 'them', text: 'The new onboarding flow is looking sharp.', time: '09:41' },
  { from: 'me', text: 'Nice. I tightened the copy and added a clearer next step.', time: '09:42' },
  { from: 'them', text: 'Perfect — shipping it to the team now.', time: '09:43' },
]

export default function Page() {
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState(demoMessages)

  function sendDemo() {
    if (!draft.trim()) return
    setMessages([...messages, { from: 'me', text: draft.trim(), time: 'now' }])
    setDraft('')
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8fa] text-[#111827]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight"><span className="grid size-9 place-items-center rounded-xl bg-[#2357d5] text-white"><MessageCircle size={18} /></span>relay<span className="text-[#2357d5]">.</span></Link>
        <div className="hidden items-center gap-8 text-sm text-[#657083] md:flex"><a href="#features">Features</a><a href="#preview">Preview</a><Link href="/chat" className="font-medium text-[#111827]">Open workspace <ArrowUpRight className="ml-1 inline" size={15} /></Link></div>
        <Link href="/chat" className="rounded-full bg-[#111827] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2357d5]">Try relay</Link>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-16 px-6 pb-20 pt-14 lg:grid-cols-[1fr_0.9fr] lg:px-10 lg:pb-28 lg:pt-20">
        <div><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dbe3f4] bg-white px-3 py-1.5 text-xs font-medium text-[#2357d5]"><span className="size-1.5 rounded-full bg-[#2fb477]" /> Conversations, without the noise</div><h1 className="max-w-2xl text-balance text-5xl font-semibold leading-[1.04] tracking-[-0.05em] sm:text-7xl">The calm way to <span className="text-[#2357d5]">stay in touch.</span></h1><p className="mt-7 max-w-lg text-lg leading-8 text-[#657083]">A focused chat workspace for quick conversations, thoughtful groups, and messages that move with your team.</p><div className="mt-9 flex flex-wrap items-center gap-4"><Link href="/chat" className="rounded-full bg-[#2357d5] px-6 py-3.5 text-sm font-medium text-white shadow-[0_8px_25px_rgba(35,87,213,0.22)] transition hover:-translate-y-0.5">Enter the workspace <ArrowUpRight className="ml-2 inline" size={16} /></Link><a href="#preview" className="text-sm font-medium text-[#657083]">See how it works ↓</a></div></div>
        <div id="preview" className="relative"><div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-[#e9eefb] rotate-2" /><div className="overflow-hidden rounded-[1.75rem] border border-[#dfe5ee] bg-white shadow-2xl shadow-[#c9d4e8]/50"><div className="flex items-center justify-between border-b border-[#edf0f4] px-5 py-4"><div className="flex items-center gap-3"><div className="relative grid size-9 place-items-center rounded-full bg-[#f4d5c5] text-sm font-semibold text-[#9c4c27]">AL<span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-[#2fb477]" /></div><div><p className="text-sm font-semibold">Alex Lee</p><p className="text-xs text-[#2fb477]">Online now</p></div></div><span className="text-xs text-[#a0a8b5]">Today</span></div><div className="flex min-h-[330px] flex-col gap-4 bg-[#fbfcfe] p-5">{messages.map((m, i) => <div key={i} className={m.from === 'me' ? 'ml-auto max-w-[78%]' : 'max-w-[78%]'}><div className={m.from === 'me' ? 'rounded-2xl rounded-br-md bg-[#2357d5] px-4 py-3 text-sm leading-5 text-white' : 'rounded-2xl rounded-bl-md border border-[#e4e8ef] bg-white px-4 py-3 text-sm leading-5 text-[#3f4857]'}>{m.text}</div><p className={`mt-1 text-[10px] text-[#a0a8b5] ${m.from === 'me' ? 'text-right' : ''}`}>{m.time}{m.from === 'me' && i === messages.length - 1 ? ' · Delivered' : ''}</p></div>)}</div><div className="flex gap-2 border-t border-[#edf0f4] bg-white p-3"><input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendDemo()} placeholder="Write a message…" className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-[#a0a8b5]" aria-label="Demo message" /><button onClick={sendDemo} className="grid size-9 place-items-center rounded-xl bg-[#2357d5] text-white" aria-label="Send demo message"><ArrowUpRight size={16} /></button></div></div></div>
      </section>

      <section id="features" className="border-y border-[#e5e9f0] bg-white"><div className="mx-auto grid max-w-7xl gap-px bg-[#e5e9f0] lg:grid-cols-3">{[{icon: Search, title: 'Find anyone, fast', text: 'Search by name or number and start a conversation in one clean motion.'}, {icon: Users, title: 'Make room for more', text: 'Bring the right people together with group conversations that stay organized.'}, {icon: Radio, title: 'Always up to date', text: 'Live updates keep every thread current, with a quiet fallback when needed.'}].map(({icon: Icon, title, text}) => <div key={title} className="bg-white p-8 lg:p-10"><Icon size={21} className="mb-8 text-[#2357d5]" /><h2 className="text-lg font-semibold tracking-tight">{title}</h2><p className="mt-3 text-sm leading-6 text-[#657083]">{text}</p></div>)}</div></section>
      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-xs text-[#8993a3] sm:flex-row sm:items-center sm:justify-between lg:px-10"><span>relay. / a thoughtful chat surface</span><span><Check className="mr-1 inline text-[#2fb477]" size={14} /> Built for the assignment</span></footer>
    </main>
  )
}

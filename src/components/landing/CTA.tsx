'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowUpRight, Check, MessageCircle } from 'lucide-react'

export const CTA: React.FC = () => {
  return (
    <>
      <section className="bg-[#f7f8fa] py-20 px-6">
        <div className="mx-auto max-w-4xl rounded-3xl bg-[#111827] px-8 py-14 text-center text-white shadow-2xl lg:px-16">
          <span className="grid size-12 place-items-center rounded-2xl bg-[#2357d5] mx-auto mb-6 text-white">
            <MessageCircle size={24} />
          </span>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
            Ready for a calm chat experience?
          </h2>
          <p className="mt-4 text-base text-[#9aa4b2] max-w-lg mx-auto">
            Experience direct messaging, group conversations, and smooth responsive interaction.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-full bg-[#2357d5] px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-[#2357d5]/30 hover:bg-[#1744b6] transition hover:-translate-y-0.5"
            >
              Open Relay Workspace <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-xs text-[#8993a3] sm:flex-row sm:items-center sm:justify-between lg:px-10 border-t border-[#e5e9f0]">
        <span className="font-medium text-[#111827]">
          relay<span className="text-[#2357d5]">.</span> / a thoughtful chat surface
        </span>
        <span className="flex items-center gap-1">
          <Check className="text-[#2fb477]" size={14} /> Built for the assignment
        </span>
      </footer>
    </>
  )
}

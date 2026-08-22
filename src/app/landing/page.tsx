import React from 'react'
import Link from 'next/link'
import { ArrowUpRight, MessageCircle, LogIn } from 'lucide-react'
import { Hero } from '@/components/landing/Hero'
import { FeatureShowcase } from '@/components/landing/FeatureShowcase'
import { CTA } from '@/components/landing/CTA'

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8fa] text-[#111827]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
          <span className="grid size-9 place-items-center rounded-xl bg-[#2357d5] text-white shadow-md shadow-[#2357d5]/20">
            <MessageCircle size={18} />
          </span>
          Officetalk<span className="text-[#2357d5]">.</span>
        </Link>
        <div className="hidden items-center gap-8 text-sm text-[#657083] md:flex">
          <a href="#features" className="hover:text-[#111827] transition">Features</a>
          <a href="#preview" className="hover:text-[#111827] transition">Preview</a>
          <Link href="/chat" className="font-medium text-[#111827] flex items-center gap-1 hover:text-[#2357d5] transition">
            Open workspace <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full border border-[#e1e6ee] px-5 py-2 text-sm font-medium text-[#111827] transition hover:bg-[#f5f7fa]"
          >
            Log in
          </Link>
          <Link
            href="/chat"
            className="rounded-full bg-[#111827] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#2357d5]"
          >
            Try Officetalk
          </Link>
        </div>
      </nav>

      <Hero />
      <FeatureShowcase />
      <CTA />
    </main>
  )
}

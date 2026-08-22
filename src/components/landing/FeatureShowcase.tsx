'use client'

import React from 'react'
import { Radio, Search, Users } from 'lucide-react'

const FEATURES = [
  {
    icon: Search,
    title: 'Find anyone, fast',
    text: 'Search by name or number and start a conversation in one clean motion.',
  },
  {
    icon: Users,
    title: 'Make room for more',
    text: 'Bring the right people together with group conversations that stay organized.',
  },
  {
    icon: Radio,
    title: 'Always up to date',
    text: 'Live updates keep every thread current, with a quiet fallback when needed.',
  },
]

export const FeatureShowcase: React.FC = () => {
  return (
    <section id="features" className="border-y border-[#e5e9f0] bg-white">
      <div className="mx-auto grid max-w-7xl gap-px bg-[#e5e9f0] lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="bg-white p-8 lg:p-10 transition hover:bg-[#fafbfd]">
            <Icon size={21} className="mb-8 text-[#2357d5]" />
            <h2 className="text-lg font-semibold tracking-tight text-[#111827]">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#657083]">
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

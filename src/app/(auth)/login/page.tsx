'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MessageCircle, Phone, User, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthContext } from '@/lib/auth-context'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthContext()
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      await login(phoneNumber.trim() || '+15550192', name.trim())
      router.push('/chat')
    } catch (err) {
      setError('Failed to log in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa] p-4 text-[#111827]">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#e1e6ee] bg-white p-8 shadow-xl shadow-[#b9c5d8]/20">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold tracking-tight text-xl mb-4">
            <span className="grid size-10 place-items-center rounded-xl bg-[#2357d5] text-white shadow-md shadow-[#2357d5]/30">
              <MessageCircle size={20} />
            </span>
            chatapp<span className="text-[#2357d5]">.</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#111827]">Welcome back</h1>
          <p className="mt-1 text-sm text-[#657083]">Sign in to access your chat workspace</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-[#fbe3e8] p-3 text-center text-xs font-medium text-[#b82a4b]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#9aa4b2]">
              Display Name
            </label>
            <Input
              icon={<User size={16} />}
              placeholder="e.g. Jamie Rivera"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#9aa4b2]">
              Phone Number
            </label>
            <Input
              icon={<Phone size={16} />}
              placeholder="e.g. +1 555-0192"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            isLoading={isLoading}
          >
            Continue to Chat <ArrowRight size={16} className="ml-2" />
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-[#8993a3]">
          No password required for demo authentication
        </p>
      </div>
    </main>
  )
}

'use client'

import React, { useState } from 'react'
import { Search, X, UserPlus, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { User } from '@/types/user'
import { conversationsApi } from '@/lib/api/conversations'

export interface NewConversationModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectUser: (user: User) => void
}

export const NewConversationModal: React.FC<NewConversationModalProps> = ({
  isOpen,
  onClose,
  onSelectUser,
}) => {
  const [query, setQuery] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [phoneInput, setPhoneInput] = useState('')
  const [results, setResults] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)

  if (!isOpen) return null

  const handleSearch = async (val: string) => {
    setQuery(val)
    if (!val.trim()) {
      setResults([])
      return
    }
    setIsSearching(true)
    try {
      const users = await conversationsApi.searchUsers(val)
      setResults(users)
    } catch (err) {
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleCreateDirect = () => {
    if (!nameInput.trim()) return
    const newUser: User = {
      id: 'usr_' + Date.now(),
      name: nameInput.trim(),
      phoneNumber: phoneInput.trim() || undefined,
      isOnline: true,
    }
    onSelectUser(newUser)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
        <div className="flex items-center justify-between border-b border-[#e9edf3] px-6 py-4">
          <h2 className="text-base font-semibold text-[#111827] flex items-center gap-2">
            <UserPlus size={18} className="text-[#2357d5]" />
            New Conversation
          </h2>
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-[#8993a3] hover:bg-[#f5f7fa]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#9aa4b2]">
              Search Contacts
            </label>
            <Input
              icon={<Search size={16} />}
              placeholder="Search by name or phone..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {results.length > 0 && (
            <div className="max-h-48 overflow-y-auto space-y-1">
              {results.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    onSelectUser(u)
                    onClose()
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[#f5f7fa] transition text-left"
                >
                  <Avatar name={u.name} isOnline={u.isOnline} />
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">{u.name}</p>
                    {u.phoneNumber && (
                      <p className="text-xs text-[#8993a3]">{u.phoneNumber}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="relative border-t border-[#e9edf3] pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#9aa4b2]">
              Or start with phone / name
            </p>
            <div className="space-y-3">
              <Input
                placeholder="Full Name (e.g., Alex Lee)"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
              <Input
                icon={<Phone size={16} />}
                placeholder="Phone Number (optional)"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
              />
              <Button
                variant="primary"
                className="w-full"
                disabled={!nameInput.trim()}
                onClick={handleCreateDirect}
              >
                Start Chatting
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

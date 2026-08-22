'use client'

import React, { useState, useEffect } from 'react'
import { Users, X, Check, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { User } from '@/types/user'
import { conversationsApi } from '@/lib/api/conversations'

export interface NewGroupModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateGroup: (groupName: string, participantIds: string[]) => void
}

export const NewGroupModal: React.FC<NewGroupModalProps> = ({
  isOpen,
  onClose,
  onCreateGroup,
}) => {
  const [groupName, setGroupName] = useState('')
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (isOpen) {
      conversationsApi.searchUsers('').then((res) => {
        if (Array.isArray(res)) setSearchResults(res)
      }).catch(() => {})
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSearch = async (val: string) => {
    setQuery(val)
    setIsSearching(true)
    try {
      const users = await conversationsApi.searchUsers(val)
      setSearchResults(users)
    } catch (err) {
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const toggleSelectUser = (u: User) => {
    setSelectedUsers((prev) =>
      prev.some((item) => item.id === u.id)
        ? prev.filter((item) => item.id !== u.id)
        : [...prev, u]
    )
  }

  const handleCreate = () => {
    if (!groupName.trim() || selectedUsers.length === 0) return
    const ids = selectedUsers.map((u) => u.id)
    onCreateGroup(groupName.trim(), ids)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
        <div className="flex items-center justify-between border-b border-[#e9edf3] px-6 py-4">
          <h2 className="text-base font-semibold text-[#111827] flex items-center gap-2">
            <Users size={18} className="text-[#2357d5]" />
            New Group Chat
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
              Group Name
            </label>
            <Input
              placeholder="e.g., Product Launch Notes"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#9aa4b2]">
              Search & Add Members ({selectedUsers.length} Selected)
            </label>
            <div className="mb-3">
              <Input
                icon={<Search size={16} />}
                placeholder="Search member by name or phone..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1">
              {searchResults.length === 0 ? (
                <p className="p-3 text-center text-xs text-[#8993a3]">
                  {isSearching ? 'Searching...' : 'No users found'}
                </p>
              ) : (
                searchResults.map((u) => {
                  const isSelected = selectedUsers.some((item) => item.id === u.id)
                  return (
                    <button
                      key={u.id}
                      onClick={() => toggleSelectUser(u)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 hover:bg-[#f5f7fa] transition"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} size="sm" />
                        <div className="text-left">
                          <p className="text-sm font-semibold text-[#111827]">{u.name}</p>
                          <p className="text-xs text-[#8993a3]">{u.phoneNumber || u.id}</p>
                        </div>
                      </div>
                      <div
                        className={`grid size-5 place-items-center rounded-md border transition ${
                          isSelected
                            ? 'border-[#2357d5] bg-[#2357d5] text-white'
                            : 'border-[#dfe5ee] bg-white'
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full"
            disabled={!groupName.trim() || selectedUsers.length < 2}
            onClick={handleCreate}
          >
            Create Group Chat ({selectedUsers.length} members)
          </Button>
          {selectedUsers.length < 2 && (
            <p className="text-center text-xs text-[#8993a3]">
              * Select at least 2 members to create a group chat (minimum 3 members total).
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

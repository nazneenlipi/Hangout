'use client'

import React, { useState } from 'react'
import { Users, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'

export interface NewGroupModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateGroup: (groupName: string, participantIds: string[]) => void
}

const SAMPLE_CONTACTS = [
  { id: 'u1', name: 'Alex Lee', phone: '+1 555-0101' },
  { id: 'u2', name: 'Maya Lin', phone: '+1 555-0102' },
  { id: 'u3', name: 'Jordan Kim', phone: '+1 555-0103' },
  { id: 'u4', name: 'Devon Bell', phone: '+1 555-0104' },
]

export const NewGroupModal: React.FC<NewGroupModalProps> = ({
  isOpen,
  onClose,
  onCreateGroup,
}) => {
  const [groupName, setGroupName] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  if (!isOpen) return null

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleCreate = () => {
    if (!groupName.trim() || selectedIds.length === 0) return
    onCreateGroup(groupName.trim(), selectedIds)
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
              Select Participants ({selectedIds.length})
            </label>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {SAMPLE_CONTACTS.map((c) => {
                const isSelected = selectedIds.includes(c.id)
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleSelect(c.id)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 hover:bg-[#f5f7fa] transition"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={c.name} size="sm" />
                      <div className="text-left">
                        <p className="text-sm font-semibold text-[#111827]">{c.name}</p>
                        <p className="text-xs text-[#8993a3]">{c.phone}</p>
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
              })}
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full"
            disabled={!groupName.trim() || selectedIds.length === 0}
            onClick={handleCreate}
          >
            Create Group Chat
          </Button>
        </div>
      </div>
    </div>
  )
}

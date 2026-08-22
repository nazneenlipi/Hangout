import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function formatMessageTime(dateInput?: string | Date): string {
  if (!dateInput) return ''
  if (dateInput === 'now' || dateInput === 'Mon' || dateInput === 'Yesterday') return dateInput
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (isNaN(date.getTime())) return String(dateInput)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function getAvatarBgColor(idOrName: string): string {
  const colors = [
    'bg-[#f4d5c5] text-[#9c4c27]',
    'bg-[#d6e4fb] text-[#2357d5]',
    'bg-[#d8eddf] text-[#27774d]',
    'bg-[#fbe3e8] text-[#b82a4b]',
    'bg-[#eee4fc] text-[#6b21a8]',
  ]
  let hash = 0
  for (let i = 0; i < idOrName.length; i++) {
    hash = idOrName.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

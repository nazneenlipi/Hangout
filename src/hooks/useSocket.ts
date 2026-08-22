'use client'

import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'https://frontend-task-chatapp.onrender.com'

export function useSocket(
  token: string | null,
  onNewMessage?: (msg: any) => void,
  onConversationUpdated?: (conv: any) => void
) {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!token) return

    const socket: Socket = io(SOCKET_SERVER_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    })

    socketRef.current = socket

    socket.on('message:new', (msg) => {
      if (onNewMessage) onNewMessage(msg)
    })

    socket.on('conversation:updated', (conv) => {
      if (onConversationUpdated) onConversationUpdated(conv)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [token, onNewMessage, onConversationUpdated])

  const sendSocketMessage = (conversationId: string, text: string) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('message:send', { conversationId, text })
      return true
    }
    return false
  }

  return {
    socket: socketRef.current,
    sendSocketMessage,
  }
}

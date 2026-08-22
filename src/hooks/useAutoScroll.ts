'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export function useAutoScroll<T extends HTMLElement>(threshold = 96) {
  const scrollRef = useRef<T>(null)
  const [isNearBottom, setIsNearBottom] = useState(true)

  const checkIsNearBottom = useCallback(() => {
    const node = scrollRef.current
    if (!node) return
    const distanceToBottom = node.scrollHeight - node.scrollTop - node.clientHeight
    setIsNearBottom(distanceToBottom < threshold)
  }, [threshold])

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const node = scrollRef.current
    if (node) {
      node.scrollTo({
        top: node.scrollHeight,
        behavior,
      })
    }
  }, [])

  useEffect(() => {
    const node = scrollRef.current
    if (!node) return

    node.addEventListener('scroll', checkIsNearBottom)
    return () => node.removeEventListener('scroll', checkIsNearBottom)
  }, [checkIsNearBottom])

  return {
    scrollRef,
    isNearBottom,
    scrollToBottom,
  }
}

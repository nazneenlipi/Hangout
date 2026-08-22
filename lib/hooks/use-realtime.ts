'use client'

import { useEffect, useRef, useState } from 'react'

export function usePolling<T>(loader: () => Promise<T>, enabled = true, interval = 2500) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const loaderRef = useRef(loader)
  loaderRef.current = loader
  useEffect(() => {
    if (!enabled) return
    let active = true
    const run = async () => { try { const next = await loaderRef.current(); if (active) { setData(next); setError(null) } } catch (cause) { if (active) setError(cause instanceof Error ? cause : new Error('Polling failed')) } }
    run()
    const timer = window.setInterval(run, interval)
    return () => { active = false; window.clearInterval(timer) }
  }, [enabled, interval])
  return { data, error }
}

export function useNearBottom<T extends HTMLElement>(threshold = 96) {
  const ref = useRef<T>(null)
  const [isNearBottom, setIsNearBottom] = useState(true)
  useEffect(() => { const node = ref.current; if (!node) return; const onScroll = () => setIsNearBottom(node.scrollHeight - node.scrollTop - node.clientHeight < threshold); node.addEventListener('scroll', onScroll); return () => node.removeEventListener('scroll', onScroll) }, [threshold])
  return { ref, isNearBottom }
}

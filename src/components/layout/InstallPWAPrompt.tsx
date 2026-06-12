'use client'

import { useEffect } from 'react'

export function InstallPWAPrompt() {
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  return null
}

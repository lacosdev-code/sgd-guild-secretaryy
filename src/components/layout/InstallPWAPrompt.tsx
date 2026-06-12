'use client'

import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'

export function InstallPWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e)
      // Update UI notify the user they can install the PWA
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Optionally, if it's already installed
    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null)
      setShowPrompt(false)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  if (!showPrompt) return null

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    
    // Show the install prompt
    deferredPrompt.prompt()
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white dark:bg-charcoal border-2 border-gold rounded-xl p-4 shadow-2xl z-50 animate-in slide-in-from-bottom-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center shrink-0">
          <Download className="w-5 h-5 text-gold" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-navy dark:text-white text-sm">Install Aplikasi SGD</h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Install untuk notifikasi realtime & akses lebih cepat.
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 bg-navy text-gold text-xs font-bold rounded hover:bg-navy/90 transition-colors flex-1"
            >
              Install Sekarang
            </button>
            <button
              onClick={() => setShowPrompt(false)}
              className="px-3 py-1.5 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-xs font-bold rounded hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
            >
              Nanti
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

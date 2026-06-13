'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, BellOff } from 'lucide-react'
import Link from 'next/link'
import {
  requestNotificationPermission,
  getNotificationPermission,
  showBrowserNotification,
} from '@/lib/browserNotification'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function NotificationsDropdown({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [permission, setPermission] = useState<NotificationPermission | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const prevCountRef = useRef<number>(0)

  // Play notification sound
  const playNotifSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.connect(g)
      g.connect(ctx.destination)
      o.type = 'sine'
      o.frequency.setValueAtTime(880, ctx.currentTime)
      o.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.1)
      g.gain.setValueAtTime(0.3, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
      o.start(ctx.currentTime)
      o.stop(ctx.currentTime + 0.4)
    } catch { /* ignore */ }
  }

  // Check current permission status on mount
  useEffect(() => {
    setPermission(getNotificationPermission())
  }, [])

  useEffect(() => {
    if (!userId) return

    async function fetchNotifications() {
      try {
        const res = await fetch('/api/notifications')
        if (res.ok) {
          const data = await res.json()
          // map camelCase to snake_case for UI compatibility
          const mapped = data.map((n: { id: string, [key: string]: any }) => ({
            id: n.id,
            user_id: n.userId,
            title: n.title,
            message: n.message,
            link: n.link,
            is_read: n.isRead,
            created_at: n.createdAt,
          }))

          const unread = mapped.filter((n: { id: string, [key: string]: any }) => !n.is_read)
          
          if (prevCountRef.current > 0 && unread.length > prevCountRef.current) {
            const newest = mapped.find((n: { id: string, [key: string]: any }) => !n.is_read)
            if (newest) {
              playNotifSound()
              showBrowserNotification(newest.title || '⚔ SGD Guild', {
                body: newest.message,
                link: newest.link || '/dashboard',
              })
            }
          }

          prevCountRef.current = unread.length
          setNotifications(mapped)
          setUnreadCount(unread.length)
        }
      } catch (err) {

      }
    }
    
    fetchNotifications()

    // Realtime SSE subscription
    const eventSource = new EventSource('/api/sse/notifications')
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'connected') return

        // New notification event
        if (data.title || data.message) {
          playNotifSound()
          showBrowserNotification(data.title || '⚔ SGD Guild', {
            body: data.message,
            link: data.link || '/dashboard',
          })
          fetchNotifications()
        }
      } catch {
        // Ignored, might be heartbeat or malformed
      }
    }

    return () => { eventSource.close() }
  }, [userId])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleRequestPermission() {
    const granted = await requestNotificationPermission()
    setPermission(granted ? 'granted' : 'denied')

    if (granted) {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '')
        })

        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription })
        })
      } catch (err) {

      }
    }
  }

  async function markAsRead(id: string) {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (e) {

    }
  }

  async function markAllAsRead() {
    try {
      await fetch('/api/notifications', { method: 'PATCH' })
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (e) {

    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-charcoal/60 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-0.5 bg-danger rounded-full border-2 border-white dark:border-[#151515] text-[9px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className={`
        fixed left-4 right-4 top-16
        md:absolute md:left-auto md:right-0 md:w-80 md:top-full md:mt-2
        bg-white dark:bg-[#1B2E52] border border-gray-100 dark:border-[#2A3F6B] rounded-2xl shadow-2xl overflow-hidden z-50
        transition-all duration-200 ease-out origin-top-right
        ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
      `}>
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-[#2A3F6B] flex justify-between items-center bg-gray-50 dark:bg-transparent">
          <h3 className="text-navy dark:text-[#C9A227] font-bold text-base tracking-wide">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50 hover:text-navy dark:text-gray-400 dark:hover:text-[#C9A227] transition-colors">
                Baca semua
              </button>
            )}
          </div>
        </div>

        {/* Permission Banner */}
        {permission !== 'granted' && (
          <div className="px-4 py-3 bg-amber-50 dark:bg-[#C9A227]/10 border-b border-amber-100 dark:border-[#2A3F6B] transition-colors">
            {permission === 'denied' ? (
              <div className="text-[11px] text-amber-700 dark:text-amber-400 flex items-start gap-1.5">
                <BellOff size={12} className="shrink-0 mt-0.5" />
                <p>Notifikasi diblokir browser. Aktifkan di pengaturan browser.</p>
              </div>
            ) : (
              <button
                onClick={handleRequestPermission}
                className="w-full text-left text-[11px] font-bold text-amber-700 dark:text-[#C9A227] flex items-start gap-1.5 hover:underline cursor-pointer"
              >
                <Bell size={12} className="shrink-0 mt-0.5" />
                <span className="text-sm font-semibold">Aktifkan notifikasi pop-up →</span>
              </button>
            )}
          </div>
        )}

        {/* Notification list */}
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-50 dark:divide-[#2A3F6B]">
              {notifications.map(n => (
                <div key={n.id} className={`p-4 transition-colors ${n.is_read ? 'opacity-60 hover:bg-gray-50 dark:hover:bg-[#0F1B2D]/50' : 'bg-blue-50/50 dark:bg-[#C9A227]/10'}`}>
                  <Link 
                    href={n.link || '#'} 
                    onClick={() => { if (!n.is_read) markAsRead(n.id); setOpen(false) }}
                    className="block"
                  >
                    <div className="flex items-start gap-3">
                      {!n.is_read && <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 dark:bg-[#C9A227] shrink-0" />}
                      <div className={!n.is_read ? '' : 'pl-5'}>
                        <p className="text-sm font-bold text-charcoal dark:text-gray-100">{n.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-300 mt-1 leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 font-mono">
                          {new Date(n.created_at).toLocaleString('id-ID', { 
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-10 flex flex-col items-center gap-3 bg-white dark:bg-[#0F1B2D]/50">
              <Bell size={40} className="text-gray-300 dark:text-[#2A3F6B] w-10 h-10" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Tidak ada notifikasi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

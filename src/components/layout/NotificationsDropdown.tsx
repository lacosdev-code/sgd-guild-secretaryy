'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, BellOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
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
  const [supabase] = useState(() => createClient())
  const prevCountRef = useRef<number>(0)

  // Check current permission status on mount
  useEffect(() => {
    setPermission(getNotificationPermission())
  }, [])

  useEffect(() => {
    async function fetchNotifications() {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (data) {
        const unread = data.filter(n => !n.is_read)
        
        // Show browser push notification if new unread arrived
        if (prevCountRef.current > 0 && unread.length > prevCountRef.current) {
          const newest = data.find(n => !n.is_read)
          if (newest) {
            showBrowserNotification(newest.title || '⚔ SGD Guild', {
              body: newest.message,
              link: newest.link || '/dashboard',
            })
          }
        }

        prevCountRef.current = unread.length
        setNotifications(data)
        setUnreadCount(unread.length)
      }
    }
    
    if (!userId) return

    fetchNotifications()

    // Realtime subscription — badge updates & triggers browser push
    const channel = supabase
      .channel(`notifications_${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => {
          // Show browser notification immediately from payload
          const newNotif = payload.new as any
          showBrowserNotification(newNotif.title || '⚔ SGD Guild', {
            body: newNotif.message,
            link: newNotif.link || '/dashboard',
          })
          fetchNotifications()
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        () => { fetchNotifications() }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId, supabase])

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
        console.error('Failed to subscribe to push notifications', err)
      }
    }
  }

  async function markAsRead(id: string) {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  async function markAllAsRead() {
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setUnreadCount(0)
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
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-charcoal border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
            <h3 className="font-bold text-sm text-navy dark:text-gold">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50 hover:text-navy dark:text-gray-400 dark:hover:text-white transition-colors">
                  Baca semua
                </button>
              )}
            </div>
          </div>

          {/* Permission Banner — hanya muncul jika belum allow */}
          {permission !== 'granted' && (
            <div className="px-3 py-2.5 bg-amber-50 dark:bg-amber-500/10 border-b border-amber-100 dark:border-amber-900/30">
              {permission === 'denied' ? (
                <div className="text-[11px] text-amber-700 dark:text-amber-400 flex items-start gap-1.5">
                  <BellOff size={12} className="shrink-0 mt-0.5" />
                  <p>Notifikasi diblokir browser. Aktifkan di pengaturan browser.</p>
                </div>
              ) : (
                <button
                  onClick={handleRequestPermission}
                  className="w-full text-left text-[11px] font-bold text-amber-700 dark:text-amber-400 flex items-start gap-1.5 hover:underline"
                >
                  <Bell size={12} className="shrink-0 mt-0.5" />
                  <span>Aktifkan notifikasi pop-up (seperti WhatsApp) →</span>
                </button>
              )}
            </div>
          )}

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {notifications.map(n => (
                  <div key={n.id} className={`p-3 transition-colors ${n.is_read ? 'opacity-60' : 'bg-blue-50/50 dark:bg-blue-900/10'}`}>
                    <Link 
                      href={n.link || '#'} 
                      onClick={() => { if (!n.is_read) markAsRead(n.id); setOpen(false) }}
                      className="block"
                    >
                      <div className="flex items-start gap-2">
                        {!n.is_read && <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />}
                        <div className={!n.is_read ? '' : 'pl-3.5'}>
                          <p className="text-sm font-bold text-charcoal dark:text-gray-200">{n.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1">
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
              <div className="p-6 text-center">
                <Bell size={28} className="mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Tidak ada notifikasi</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}



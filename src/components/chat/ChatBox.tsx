'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Avatar } from '@/components/ui/Avatar'
import { Send, Image as ImageIcon, Loader2 } from 'lucide-react'
import imageCompression from 'browser-image-compression'

export function ChatBox({ currentUserId }: { currentUserId: string }) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)
  const [supabase] = useState(() => createClient())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    let isMounted = true

    async function fetchMessages() {
      try {
        const { data, error } = await supabase
          .from('guild_chat')
          .select('id, message, created_at, user_id, users(nama, avatar_url)')
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) throw error
        if (data && isMounted) {
          setMessages(data.reverse())
          setTimeout(scrollToBottom, 100)
        }
      } catch (err) {
        console.error('Error fetching messages:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchMessages()

    const channel = supabase
      .channel('public:guild_chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'guild_chat' }, async (payload) => {
        // Fetch user details for the new message
        const { data: userData } = await supabase
          .from('users')
          .select('nama, avatar_url')
          .eq('id', payload.new.user_id)
          .single()

        const newMsg = {
          ...payload.new,
          users: userData || { nama: 'Unknown', avatar_url: null }
        }

        if (isMounted) {
          setMessages((prev) => [...prev, newMsg])
          setTimeout(scrollToBottom, 100)
        }
      })
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    const msgText = newMessage.trim()
    setNewMessage('')
    setSending(true)

    try {
      const { error } = await supabase.from('guild_chat').insert({
        user_id: currentUserId,
        message: msgText
      })
      if (error) throw error
    } catch (err) {
      console.error('Error sending message:', err)
      // Optionally restore message if failed
      setNewMessage(msgText)
    } finally {
      setSending(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !currentUserId) return

    if (!file.type.startsWith('image/')) {
      alert('Hanya file gambar yang diperbolehkan.')
      return
    }

    setUploadingImg(true)
    try {
      // Compress
      let compressedFile = file
      try {
        const options = { maxSizeMB: 0.8, maxWidthOrHeight: 1280, useWebWorker: true }
        const compressedBlob = await imageCompression(file, options)
        compressedFile = new File([compressedBlob], file.name, { type: file.type })
      } catch (err) {
        console.error('Compression failed:', err)
      }

      const ext = compressedFile.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${ext}`
      const filePath = `tavern/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(filePath, compressedFile, { upsert: false })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('attachments')
        .getPublicUrl(filePath)

      // Send as markdown image
      await supabase.from('guild_chat').insert({
        user_id: currentUserId,
        message: `![image](${publicUrl})`
      })
    } catch (err: any) {
      console.error(err)
      alert('Gagal mengupload gambar: ' + err.message)
    } finally {
      setUploadingImg(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Parse markdown image ![image](url)
  const renderMessageContent = (text: string) => {
    const imgRegex = /^!\[image\]\((.*?)\)$/
    const match = text.trim().match(imgRegex)
    if (match && match[1]) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img 
          src={match[1]} 
          alt="Shared image" 
          className="max-w-full rounded-md shadow-sm border border-gray-200/20 max-h-64 object-contain" 
        />
      )
    }
    return <span className="whitespace-pre-wrap break-words">{text}</span>
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-64">
        <span className="inline-block w-8 h-8 rounded-full border-2 border-navy border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[600px] max-h-[70vh] bg-white dark:bg-[#1C1C1E] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <h2 className="font-bold text-navy dark:text-gray-100">Live Chat</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-texture">
        {messages.map((msg, i) => {
          const isMe = msg.user_id === currentUserId
          const showAvatar = i === 0 || messages[i - 1]?.user_id !== msg.user_id

          return (
            <div key={msg.id} className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
              {!isMe && showAvatar ? (
                <Avatar url={msg.users?.avatar_url} name={msg.users?.nama || '?'} size="sm" className="mt-1 shrink-0" />
              ) : (
                !isMe && <div className="w-8 shrink-0" />
              )}

              <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                {!isMe && showAvatar && (
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 ml-1">{msg.users?.nama}</span>
                )}
                <div 
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe 
                      ? 'bg-navy text-white rounded-br-sm shadow-sm' 
                      : 'bg-gray-100 dark:bg-white/5 text-charcoal dark:text-gray-200 rounded-bl-sm border border-gray-200/50 dark:border-white/5'
                  }`}
                >
                  {renderMessageContent(msg.message)}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 mx-1">
                  {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-[#1C1C1E] border-t border-gray-100 dark:border-white/5">
        <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
          
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageUpload}
            disabled={uploadingImg || sending}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImg || sending}
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-navy hover:bg-gray-100 dark:hover:bg-white/5 dark:hover:text-gray-200 disabled:opacity-50 transition-colors shrink-0"
            title="Attach image"
          >
            {uploadingImg ? <Loader2 size={20} className="animate-spin text-navy dark:text-gold" /> : <ImageIcon size={20} />}
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 dark:text-white transition-all"
            disabled={sending || uploadingImg}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending || uploadingImg}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-navy text-gold hover:bg-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 shadow-sm"
          >
            <Send size={16} className={newMessage.trim() ? "translate-x-0.5" : ""} />
          </button>
        </form>
      </div>
    </div>
  )
}

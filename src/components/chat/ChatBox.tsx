'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Avatar } from '@/components/ui/Avatar'
import { Send, Image as ImageIcon, Loader2, Download, Paperclip, Mic, Square, X, Trash2 } from 'lucide-react'
import imageCompression from 'browser-image-compression'
import { useUser } from '@/hooks/useUser'

const ChatFile = ({ url, name }: { url: string, name: string }) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-black/30 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors border border-gray-200 dark:border-white/5">
      <div className="w-10 h-10 flex items-center justify-center bg-navy text-gold rounded-md shrink-0">
        <Paperclip size={18} />
      </div>
      <div className="flex-col overflow-hidden">
        <p className="text-sm font-bold text-navy dark:text-gray-200 truncate max-w-[200px]">{name}</p>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Klik untuk unduh</p>
      </div>
    </a>
  )
}

const ChatAudio = ({ url }: { url: string }) => {
  return (
    <div className="bg-gray-100 dark:bg-black/30 rounded-lg p-2 border border-gray-200 dark:border-white/5">
      <audio controls src={url} className="h-10 max-w-[200px] sm:max-w-[250px] custom-audio" />
    </div>
  )
}

const ChatImage = ({ url, onPreview }: { url: string, onPreview: (url: string) => void }) => {
  const [error, setError] = useState(false)
  if (error) {
    return (
      <div className="flex items-center gap-2 p-3 bg-red-50/50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-md text-xs border border-red-100 dark:border-red-900/30">
        <ImageIcon size={14} className="opacity-50" />
        <span>Gambar gagal dimuat (file tidak ditemukan atau bermasalah)</span>
      </div>
    )
  }
  return (
    <button 
      onClick={(e) => { e.preventDefault(); onPreview(url) }}
      className="relative group block cursor-zoom-in text-left"
      title="Klik untuk melihat"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={url} 
        alt="Shared image" 
        className="max-w-full rounded-md shadow-sm border border-gray-200/20 max-h-64 object-contain group-hover:opacity-90 transition-opacity" 
        onError={() => setError(true)}
      />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 rounded-md">
        <span className="bg-black/60 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm shadow-xl">
          <ImageIcon size={12} /> Buka Preview
        </span>
      </div>
    </button>
  )
}

export function ChatBox({ currentUserId }: { currentUserId: string }) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  
  const { profile } = useUser()
  const isGuildMaster = profile?.role === 'guild_master'

  const forceDownload = async (url: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `Tavern_Image_${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(blobUrl)
    } catch (err) {
      console.error('Download error:', err)
      window.open(url, '_blank')
    }
  }
  
  const [supabase] = useState(() => createClient())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

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
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'guild_chat' }, (payload) => {
        if (isMounted) {
          setMessages((prev) => prev.filter((m) => m.id !== payload.old.id))
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
      setNewMessage(msgText)
    } finally {
      setSending(false)
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Hapus pesan ini?')) return
    
    try {
      const { error } = await supabase.from('guild_chat').delete().eq('id', messageId)
      if (error) throw error
    } catch (err: any) {
      alert('Gagal menghapus pesan: ' + err.message)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm'
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType })
        stream.getTracks().forEach(track => track.stop())
        await uploadAudio(audioBlob, mimeType)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (err) {
      console.error(err)
      alert('Gagal mengakses mikrofon. Pastikan izin telah diberikan pada browser Anda.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = null 
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const uploadAudio = async (blob: Blob, mimeType: string) => {
    if (blob.size === 0) {
      alert('Rekaman kosong. Coba bicara lebih lama.')
      return
    }
    
    setUploadingImg(true)
    try {
      const ext = mimeType.includes('mp4') ? 'm4a' : 'webm'
      const fileName = `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${ext}`
      const filePath = `tavern/${fileName}`
      
      const { error: uploadError } = await supabase.storage.from('attachments').upload(filePath, blob, {
        contentType: mimeType,
        upsert: false
      })
      
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('attachments').getPublicUrl(filePath)
      
      await supabase.from('guild_chat').insert({
        user_id: currentUserId,
        message: `![audio](${publicUrl})`
      })
    } catch (err: any) {
      alert('Gagal mengirim voice note: ' + err.message)
    } finally {
      setUploadingImg(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !currentUserId) return

    if (file.size > 10 * 1024 * 1024) {
      alert('Maksimal ukuran file adalah 10MB!')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setUploadingImg(true)
    try {
      let finalFile = file
      const isImage = file.type.startsWith('image/')
      
      if (isImage) {
        try {
          const options = { maxSizeMB: 0.8, maxWidthOrHeight: 1280, useWebWorker: false }
          const compressedBlob = await imageCompression(file, options)
          finalFile = new File([compressedBlob], file.name, { type: file.type })
        } catch (err) {
          console.error('Compression failed:', err)
        }
      }

      const ext = finalFile.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${ext}`
      const filePath = `tavern/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(filePath, finalFile, { upsert: false })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('attachments')
        .getPublicUrl(filePath)

      let markdownMsg = ''
      if (isImage) {
        markdownMsg = `![image](${publicUrl})`
      } else if (file.type.startsWith('audio/')) {
        markdownMsg = `![audio](${publicUrl})`
      } else {
        markdownMsg = `[${file.name}](${publicUrl})`
      }

      await supabase.from('guild_chat').insert({
        user_id: currentUserId,
        message: markdownMsg
      })
    } catch (err: any) {
      console.error(err)
      alert('Gagal mengupload file: ' + err.message)
    } finally {
      setUploadingImg(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const renderMessageContent = (text: string) => {
    const imgRegex = /^!\[image\]\((.*?)\)$/
    const audioRegex = /^!\[audio\]\((.*?)\)$/
    const fileRegex = /^\[(.*?)\]\((.*?)\)$/
    
    const imgMatch = text.trim().match(imgRegex)
    if (imgMatch && imgMatch[1]) {
      return <ChatImage url={imgMatch[1]} onPreview={setPreviewImage} />
    }
    
    const audioMatch = text.trim().match(audioRegex)
    if (audioMatch && audioMatch[1]) {
      return <ChatAudio url={audioMatch[1]} />
    }
    
    const fileMatch = text.trim().match(fileRegex)
    if (fileMatch && fileMatch[1] && fileMatch[2]) {
      return <ChatFile name={fileMatch[1]} url={fileMatch[2]} />
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
      <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <h2 className="font-bold text-navy dark:text-gray-100">Live Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-texture">
        {messages.map((msg, i) => {
          const isMine = msg.user_id === currentUserId
          const canDelete = isMine || isGuildMaster
          const showAvatar = i === 0 || messages[i - 1]?.user_id !== msg.user_id

          return (
            <div key={msg.id} className={`flex gap-3 ${isMine ? 'flex-row-reverse' : 'flex-row'} group`}>
              {!isMine && showAvatar ? (
                <Avatar url={msg.users?.avatar_url} name={msg.users?.nama || '?'} size="sm" className="mt-1 shrink-0" />
              ) : (
                !isMine && <div className="w-8 shrink-0" />
              )}

              <div className={`flex flex-col max-w-[75%] ${isMine ? 'items-end' : 'items-start'}`}>
                {!isMine && showAvatar && (
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 ml-1">{msg.users?.nama}</span>
                )}
                <div 
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMine 
                      ? 'bg-navy text-white rounded-br-sm shadow-sm' 
                      : 'bg-gray-100 dark:bg-white/5 text-charcoal dark:text-gray-200 rounded-bl-sm border border-gray-200/50 dark:border-white/5'
                  }`}
                >
                  {renderMessageContent(msg.message)}
                </div>
                <div className={`flex items-center gap-2 mt-1 mx-1 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="text-[10px] text-gray-400">
                    {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {canDelete && (
                    <button 
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-red-500 rounded"
                      title="Hapus Pesan"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
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
            accept="image/*, audio/*, application/pdf, .doc, .docx, .xls, .xlsx, .zip, .rar, .txt"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
            disabled={uploadingImg || sending || isRecording}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImg || sending || isRecording}
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-navy hover:bg-gray-100 dark:hover:bg-white/5 dark:hover:text-gray-200 disabled:opacity-50 transition-colors shrink-0"
            title="Attach file"
          >
            {uploadingImg ? <Loader2 size={20} className="animate-spin text-navy dark:text-gold" /> : <Paperclip size={20} />}
          </button>

          {isRecording ? (
            <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-full animate-pulse overflow-hidden">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
              <span className="text-sm font-bold text-red-600 dark:text-red-400 whitespace-nowrap">
                Merekam... {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
              </span>
              <div className="flex-1" />
              <button type="button" onClick={cancelRecording} className="text-xs font-bold text-red-500 hover:underline mr-2 shrink-0">BATAL</button>
            </div>
          ) : (
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={uploadingImg ? "Mengupload file..." : "Tulis pesan..."}
              className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 dark:text-white transition-all"
              disabled={sending || uploadingImg}
            />
          )}

          {isRecording ? (
            <button
              type="button"
              onClick={stopRecording}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shrink-0 shadow-sm"
              title="Kirim Voice Note"
            >
              <Send size={16} className="translate-x-0.5" />
            </button>
          ) : (
            <>
              {newMessage.trim() ? (
                <button
                  type="submit"
                  disabled={sending || uploadingImg}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-navy text-gold hover:bg-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 shadow-sm"
                  title="Kirim Pesan"
                >
                  <Send size={16} className="translate-x-0.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={sending || uploadingImg}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-charcoal hover:bg-gray-200 dark:text-gray-200 disabled:opacity-50 transition-colors shrink-0"
                  title="Tahan untuk Voice Note"
                >
                  <Mic size={18} />
                </button>
              )}
            </>
          )}
        </form>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
          <button 
            onClick={() => setPreviewImage(null)} 
            className="absolute top-4 right-4 p-3 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
          
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={previewImage} 
            alt="Preview" 
            className="max-w-full max-h-full object-contain rounded-md"
          />
          
          <button 
            type="button"
            onClick={() => forceDownload(previewImage)}
            className="absolute bottom-6 px-6 py-2.5 bg-white text-black font-bold text-sm rounded-full flex items-center gap-2 hover:bg-gray-200 transition-colors shadow-lg"
          >
            <Download size={16} /> Unduh Gambar
          </button>
        </div>
      )}
    </div>
  )
}

'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { getRankInfo } from '@/lib/rankUtils'
import { Avatar } from '@/components/ui/Avatar'
import { Camera, Loader2 } from 'lucide-react'

export default function ProfilePage() {
  const { user, role, loading } = useUser()
  const [pointLogs, setPointLogs] = useState<any[]>([])
  const [logsLoading, setLogsLoading] = useState(true)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    async function fetchLogs() {
      if (!user) return
      const { data } = await supabase
        .from('point_logs')
        .select('delta, reason, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (data) setPointLogs(data)
      setLogsLoading(false)
    }

    if (!loading && user) {
      fetchLogs()
    }
  }, [user, loading, supabase])

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return

    if (!file.type.startsWith('image/')) {
      alert('Hanya file gambar yang diperbolehkan.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 5MB.')
      return
    }

    setUploadingAvatar(true)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${ext}`
      const filePath = `${user.id}/${fileName}`

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update user record
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Refresh window
      window.location.reload()
    } catch (error: any) {
      console.error('Error uploading avatar:', error)
      alert('Gagal mengupload foto profil: ' + error.message)
    } finally {
      setUploadingAvatar(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  if (loading || !user) {
    return (
      <div className="flex h-64 items-center justify-center text-charcoal/50">
        <div className="w-6 h-6 border-2 border-t-charcoal rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-navy tracking-tight">User Profile</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative group shrink-0">
            <Avatar
              url={user.avatar_url}
              name={user.nama}
              size="2xl"
            />

            {/* Upload Overlay */}
            <div
              className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer overflow-hidden"
              onClick={() => !uploadingAvatar && fileInputRef.current?.click()}
            >
              {uploadingAvatar ? (
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              ) : (
                <Camera className="w-8 h-8 text-white" />
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              disabled={uploadingAvatar}
            />
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-bold text-charcoal">{user.nama}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-3 py-1 bg-gold/10 text-gold font-bold text-xs uppercase tracking-widest rounded-full">
                {role === 'guild_master' ? 'Guild Master' : 'Adventurer'}
              </span>
              <span className="px-3 py-1 bg-navy text-gold text-xs font-bold tracking-widest rounded border border-gold/20 shadow-sm">
                RANK {getRankInfo(user.total_points).currentRank}
              </span>
              <span className="text-sm text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
                ID: {user.id.split('-')[0]}...
              </span>
            </div>
          </div>
          <div className="bg-navy rounded-2xl p-5 text-center min-w-[140px] shadow-lg">
            <p className="text-gold/80 text-[10px] uppercase tracking-widest font-bold mb-1">
              Total Points
            </p>
            <p className="text-3xl font-bold text-white">
              {user.total_points.toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-white/50 mt-1">SGD</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-lg font-bold text-navy mb-6 tracking-tight">Point History</h2>

        {logsLoading ? (
          <p className="text-charcoal/50 text-sm">Loading logs...</p>
        ) : pointLogs.length === 0 ? (
          <p className="text-charcoal/50 text-sm italic">Belum ada history point.</p>
        ) : (
          <div className="space-y-3">
            {pointLogs.map((log, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-charcoal">{log.reason}</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {new Date(log.created_at).toLocaleString('id-ID')}
                  </p>
                </div>
                <div className={`font-bold tabular-nums ${log.delta > 0 ? 'text-success' : 'text-danger'}`}>
                  {log.delta > 0 ? '+' : ''}{log.delta}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

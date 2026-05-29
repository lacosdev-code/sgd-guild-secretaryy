'use client'

import { useEffect, useState, useRef } from 'react'
import { signOut } from 'next-auth/react'
import { useUser } from '@/hooks/useUser'
import { getRankInfo } from '@/lib/rankUtils'
import { Avatar } from '@/components/ui/Avatar'
import { Camera, Loader2 } from 'lucide-react'

import imageCompression from 'browser-image-compression'

export default function ProfilePage() {
  const { user, role, loading } = useUser()
  const [pointLogs, setPointLogs] = useState<any[]>([])
  const [logsLoading, setLogsLoading] = useState(true)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    let isMounted = true
    async function fetchLogs() {
      if (!user) return
      try {
        const res = await fetch(`/api/users/${user.id}/point-logs`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        if (data && isMounted) setPointLogs(data)
      } catch (err) {
        console.error(err)
      } finally {
        if (isMounted) setLogsLoading(false)
      }
    }

    if (!loading && user) {
      fetchLogs()
    }
    return () => { isMounted = false }
  }, [user, loading])

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    let file = e.target.files?.[0]
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
      // Compress the avatar image before uploading
      try {
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 800, // avatars don't need to be huge
          useWebWorker: true,
        }
        const compressedBlob = await imageCompression(file, options)
        file = new File([compressedBlob], file.name, { type: file.type })
      } catch (err) {
        console.error('Compression failed, using original:', err)
      }

      const ext = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${ext}`
      const filePath = `${user.id}/${fileName}`

      // Upload to storage API
      const formData = new FormData()
      formData.append('file', file)
      formData.append('dir', 'avatars')
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      if (!res.ok) throw new Error(await res.text())
      
      const { url } = await res.json()

      // Update user record
      const updateRes = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar_url: url })
      })

      if (!updateRes.ok) throw new Error(await updateRes.text())

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

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi password tidak cocok.')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError('Password minimal 6 karakter.')
      return
    }
    setPasswordLoading(true)
    setPasswordError('')
    setPasswordSuccess('')

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      })
      if (!res.ok) throw new Error(await res.text())
      
      setPasswordSuccess('Password berhasil diubah! Gunakan password baru ini untuk login berikutnya.')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      setPasswordError(error.message)
    }
    setPasswordLoading(false)
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-charcoal/50 dark:text-gray-500">
        <div className="w-6 h-6 border-2 border-t-charcoal dark:border-t-gray-400 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-red-500">
        <p className="mb-4">Gagal memuat profil pengguna. Sesi Anda mungkin tidak valid.</p>
        <button 
          onClick={async () => {
            await signOut({ callbackUrl: '/login' })
          }} 
          className="px-4 py-2 bg-navy text-white rounded hover:bg-navy/90 transition-colors"
        >
          Kembali ke Login
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-navy dark:text-white tracking-tight">User Profile</h1>

      <div className="bg-white dark:bg-[#1C1C1E] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 p-6 md:p-8">
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
            <h2 className="text-3xl font-bold text-charcoal dark:text-white">{user.nama}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="px-3 py-1 bg-gold/10 text-gold font-bold text-xs uppercase tracking-widest rounded-full">
                {role === 'guild_master' ? 'Guild Master' : 'Adventurer'}
              </span>
              <span className="px-3 py-1 bg-navy dark:bg-white/10 text-gold text-xs font-bold tracking-widest rounded border border-gold/20 shadow-sm">
                RANK {getRankInfo(user.total_points).currentRank}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-50 dark:bg-white/5 px-2 py-1 rounded">
                ID: {user.id.split('-')[0]}...
              </span>
            </div>

            {/* Gamification Progress Bar */}
            <div className="mt-5 max-w-sm">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-1.5 text-charcoal/60 dark:text-gray-400">
                <span>Rank Progress</span>
                {getRankInfo(user.total_points).pointsForNextRank ? (
                  <span>{user.total_points} / {getRankInfo(user.total_points).pointsForNextRank} PTS</span>
                ) : (
                  <span className="text-gold">MAX RANK</span>
                )}
              </div>
              <div className="h-2.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden border border-gray-200 dark:border-white/10">
                <div 
                  className="h-full bg-gradient-to-r from-navy to-gold transition-all duration-1000 ease-out relative"
                  style={{ width: `${getRankInfo(user.total_points).progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              {getRankInfo(user.total_points).pointsForNextRank && (
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1.5 italic">
                  Butuh {(getRankInfo(user.total_points).pointsForNextRank as number) - user.total_points} poin lagi untuk naik ke Rank berikutnya!
                </p>
              )}
            </div>
            
            {/* Badges UI */}
            <div className="mt-6">
              <p className="text-[10px] uppercase font-bold tracking-widest text-charcoal/50 dark:text-gray-500 mb-2">Pencapaian (Badges)</p>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded text-xs font-semibold text-charcoal dark:text-gray-300 shadow-sm" title="Anggota resmi Guild">
                  🔰 Rookie
                </div>
                {user.total_points >= 100 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded text-xs font-semibold text-blue-700 dark:text-blue-400 shadow-sm" title="Mencapai Rank E">
                    ⚔️ Adventurer
                  </div>
                )}
                {user.total_points >= 500 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 rounded text-xs font-semibold text-purple-700 dark:text-purple-400 shadow-sm" title="Lebih dari 500 Poin">
                    🔥 Veteran
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-navy dark:bg-gold/10 rounded-2xl p-5 text-center min-w-[140px] shadow-lg">
            <p className="text-gold/80 dark:text-gold text-[10px] uppercase tracking-widest font-bold mb-1">
              Total Points
            </p>
            <p className="text-3xl font-bold text-white dark:text-gold">
              {user.total_points.toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-white/50 dark:text-gold/50 mt-1">SGD</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1C1C1E] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 p-6 md:p-8">
        <h2 className="text-lg font-bold text-navy dark:text-white mb-6 tracking-tight">Point History</h2>

        {logsLoading ? (
          <p className="text-charcoal/50 dark:text-gray-500 text-sm">Loading logs...</p>
        ) : pointLogs.length === 0 ? (
          <p className="text-charcoal/50 dark:text-gray-500 text-sm italic">Belum ada history point.</p>
        ) : (
          <div className="space-y-3">
            {pointLogs.map((log, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-4 bg-gray-50 dark:bg-white/[0.03] rounded-lg border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-charcoal dark:text-gray-200">{log.reason}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
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

      {/* Change Password Section */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 p-6 md:p-8">
        <h2 className="text-lg font-bold text-navy dark:text-white mb-6 tracking-tight">Ganti Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          {passwordError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-100">
              {passwordSuccess}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-charcoal dark:text-gray-200 mb-1.5">
              Password Baru
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-all"
              placeholder="Minimal 6 karakter"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-charcoal dark:text-gray-200 mb-1.5">
              Konfirmasi Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-all"
              placeholder="Ketik ulang password baru"
              required
            />
          </div>
          <button
            type="submit"
            disabled={passwordLoading}
            className="w-full py-2.5 px-4 bg-navy hover:bg-navy/90 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {passwordLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Simpan Password Baru'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}


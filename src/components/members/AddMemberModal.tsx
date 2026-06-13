'use client'

import { useState } from 'react'
import { X, UserPlus, Eye, EyeOff } from 'lucide-react'
import { createUser } from '@/app/actions/user'

interface AddMemberModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function AddMemberModal({ onClose, onSuccess }: AddMemberModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    try {
      const result = await createUser(formData)
      if (result.success) {
        onSuccess()
      } else {
        setError(result.error || 'Terjadi kesalahan')
      }
    } catch (error: unknown) {
    const err = error as Error;
      setError(err.message || 'Terjadi kesalahan server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-charcoal w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-white/10">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-gold" />
            </div>
            <h2 className="text-xl font-bold text-navy dark:text-white">Add Member</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-navy dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-navy dark:text-white mb-2">Full Name</label>
              <input
                type="text"
                name="nama"
                required
                placeholder="e.g., John Doe"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-navy border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-gold focus:border-transparent transition-all outline-none text-navy dark:text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-navy dark:text-white mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="member@sgd.com"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-navy border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-gold focus:border-transparent transition-all outline-none text-navy dark:text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-navy dark:text-white mb-2">Temporary Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="Min 6 characters"
                  minLength={6}
                  className="w-full pl-4 pr-12 py-3 rounded-xl bg-gray-50 dark:bg-navy border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-gold focus:border-transparent transition-all outline-none text-navy dark:text-white placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">Members can log in using this email and password later.</p>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl font-bold text-navy dark:text-white bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl font-bold text-navy bg-gold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gold/20"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

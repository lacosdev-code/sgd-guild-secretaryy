'use client'

import { useSession } from 'next-auth/react'
import { ChatBox } from '@/components/chat/ChatBox'
import { MessagesSquare } from 'lucide-react'

export default function TavernPage() {
  const { data: session, status } = useSession()
  const userId = session?.user?.id
  const loading = status === 'loading'

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-64">
        <span className="inline-block w-8 h-8 rounded-full border-2 border-navy border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="flex-1 flex items-center justify-center h-64 text-red-500">
        You must be logged in to view the Tavern.
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1 mb-8">
        <div className="flex items-center gap-3">
          <MessagesSquare className="text-gold w-8 h-8" />
          <h1 className="text-2xl font-bold text-navy dark:text-white tracking-tight">The Tavern</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm ml-11">Guild global chat. Relax, share updates, and coordinate with other adventurers.</p>
      </div>

      <ChatBox currentUserId={userId} />
    </div>
  )
}

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { DifficultyRank, QuestStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDeadline(dateString: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  
  return `${day} ${month} ${year} — ${hours}:${minutes}`
}

export function getRankColor(rank: DifficultyRank | null): string {
  switch (rank) {
    case 'F': return 'bg-gray-200 text-gray-800'
    case 'E': return 'bg-blue-100 text-blue-800'
    case 'D': return 'bg-green-100 text-green-800'
    case 'C': return 'bg-yellow-100 text-yellow-800'
    case 'B': return 'bg-orange-100 text-orange-800'
    case 'A': return 'bg-red-100 text-red-800'
    case 'S': return 'bg-purple-100 text-purple-800'
    default: return 'bg-gray-100 text-gray-600'
  }
}

export function getStatusColor(status: QuestStatus): string {
  switch (status) {
    case 'Draft':
      return 'bg-gray-200 text-gray-800'
    case 'ActiveStar':
      return 'bg-indigo-200 text-indigo-900'
    case 'Active':
      return 'bg-blue-200 text-navy'
    case 'Hold':
      return 'bg-slate-200 text-slate-900'
    case 'Submitted':
      return 'bg-gold/40 text-navy'
    case 'Approved':
      return 'bg-success text-white'
    case 'Rejected':
      return 'bg-orange-200 text-orange-900'
    case 'Completed':
      return 'bg-green-200 text-green-900'
    case 'Cancelled':
      return 'bg-gray-300 text-gray-900'
    case 'Aborted':
      return 'bg-danger text-white'
    default:
      return 'bg-gray-200 text-gray-800'
  }
}

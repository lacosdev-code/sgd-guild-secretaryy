import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function GMLogsPage() {
  const session = await auth()
  
  if (!session) redirect('/login')
  
  // Restricted to GM only
  if ((session.user as { role?: string }).role !== 'guild_master') {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg border border-red-200">
          Akses Ditolak: Halaman ini khusus untuk Guild Master.
        </div>
      </div>
    )
  }

  const logs = await prisma.emailLog.findMany({
    orderBy: { sentAt: 'desc' },
    include: {
      quest: { select: { title: true } }
    },
    take: 100 // limit to last 100 for performance
  })

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-navy dark:text-white mb-6">GM Logs (Email & Notifikasi)</h1>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-white/10 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-slate-900/50 text-gray-600 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-white/10">
            <tr>
              <th className="px-4 py-3">Waktu</th>
              <th className="px-4 py-3">Tipe</th>
              <th className="px-4 py-3">Penerima</th>
              <th className="px-4 py-3">Terkait Quest</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Error Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">
                  {new Date(log.sentAt).toLocaleString('id-ID')}
                </td>
                <td className="px-4 py-3 font-medium text-navy dark:text-gray-200">
                  {log.emailType}
                </td>
                <td className="px-4 py-3">
                  {log.recipient}
                </td>
                <td className="px-4 py-3">
                  {log.questId ? (
                    <Link href={`/quests/${log.questId}`} className="text-blue-500 hover:underline">
                      {log.quest?.title || 'Quest tidak ditemukan'}
                    </Link>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    log.status === 'Success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    log.status === 'Failed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {log.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-red-500 text-xs">
                  {log.errorMessage || '-'}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Belum ada log pengiriman.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

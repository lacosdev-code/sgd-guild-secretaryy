'use client'

import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background dark:bg-[#0F1B2D]">
      {/* Sidebar (hidden on mobile) */}
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 pb-24 lg:pb-6 lg:p-6">
          {children}
        </main>
        
        <BottomNav />
      </div>
    </div>
  )
}

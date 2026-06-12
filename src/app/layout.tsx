import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@/hooks/useUser'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SessionProvider } from 'next-auth/react'
import { InstallPWAPrompt } from '@/components/layout/InstallPWAPrompt'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const viewport: Viewport = {
  themeColor: '#1B2E52',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'SGD Guild Secretary',
  description: 'Operational Command Center — SGD Care Internal Tool',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Guild Secretary',
  },
  icons: {
    icon: [
      { url: 'https://ik.imagekit.io/Sgd/sgd.png?tr=w-64,h-64,fo-auto,c-pad_resize,bg-transparent', sizes: '64x64', type: 'image/png' },
      { url: 'https://ik.imagekit.io/Sgd/sgd.png?tr=w-192,h-192,fo-auto,c-pad_resize,bg-transparent', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: 'https://ik.imagekit.io/Sgd/sgd.png?tr=w-180,h-180,fo-auto,c-pad_resize,bg-1B2E52', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="bg-background text-charcoal antialiased min-h-screen">
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <UserProvider>
              {children}
              <InstallPWAPrompt />
              <Toaster position="bottom-center" />
            </UserProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

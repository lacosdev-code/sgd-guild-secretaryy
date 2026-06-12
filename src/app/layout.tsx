import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@/hooks/useUser'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SessionProvider } from 'next-auth/react'
import { InstallPWAPrompt } from '@/components/layout/InstallPWAPrompt'
import { Toaster } from "sonner"

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
      <head>
        {/* Splash Screen iPhone */}
        <link rel="apple-touch-startup-image" media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" href="https://ik.imagekit.io/Sgd/sgd.png?tr=w-1290,h-2796,fo-auto,c-pad_resize,bg-1B2E52" />
        <link rel="apple-touch-startup-image" media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)" href="https://ik.imagekit.io/Sgd/sgd.png?tr=w-1179,h-2556,fo-auto,c-pad_resize,bg-1B2E52" />
        <link rel="apple-touch-startup-image" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" href="https://ik.imagekit.io/Sgd/sgd.png?tr=w-1170,h-2532,fo-auto,c-pad_resize,bg-1B2E52" />
        <link rel="apple-touch-startup-image" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" href="https://ik.imagekit.io/Sgd/sgd.png?tr=w-1125,h-2436,fo-auto,c-pad_resize,bg-1B2E52" />
        <link rel="apple-touch-startup-image" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" href="https://ik.imagekit.io/Sgd/sgd.png?tr=w-828,h-1792,fo-auto,c-pad_resize,bg-1B2E52" />
        <link rel="apple-touch-startup-image" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" href="https://ik.imagekit.io/Sgd/sgd.png?tr=w-750,h-1334,fo-auto,c-pad_resize,bg-1B2E52" />

        {/* Splash Screen iPad */}
        <link rel="apple-touch-startup-image" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" href="https://ik.imagekit.io/Sgd/sgd.png?tr=w-2048,h-2732,fo-auto,c-pad_resize,bg-1B2E52" />
        <link rel="apple-touch-startup-image" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" href="https://ik.imagekit.io/Sgd/sgd.png?tr=w-1668,h-2388,fo-auto,c-pad_resize,bg-1B2E52" />
        <link rel="apple-touch-startup-image" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" href="https://ik.imagekit.io/Sgd/sgd.png?tr=w-1536,h-2048,fo-auto,c-pad_resize,bg-1B2E52" />
      </head>
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
              <Toaster
                position="top-center"
                richColors
                expand={false}
                duration={3000}
                toastOptions={{
                  style: {
                    background: '#1B2E52',
                    color: '#C9A227',
                    border: '1px solid #C9A227',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '14px',
                  },
                }}
              />
            </UserProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

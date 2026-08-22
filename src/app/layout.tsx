import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { QueryClientProvider } from '@/lib/query-client'

export const metadata: Metadata = {
  title: 'relay. - Calm & Focused Chat Surface',
  description: 'A responsive Next.js workspace for direct messages and group conversations.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f7f8fa] text-[#111827] antialiased">
        <AuthProvider>
          <QueryClientProvider>
            {children}
          </QueryClientProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

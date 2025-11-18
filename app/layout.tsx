import type { Metadata } from 'next'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { esES } from '@clerk/localizations'
import { clerkEnabled, clerkPublishableKey } from '@/lib/clerk-config'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const html = (
    <html lang="es-CL">
      <body>{children}</body>
    </html>
  )

  if (!clerkEnabled) {
    return html
  }

  return (
    <ClerkProvider
      localization={esES}
      publishableKey={clerkPublishableKey!}
      appearance={{ variables: { colorPrimary: '#0070f3' } }}
    >
      {html}
    </ClerkProvider>
  )
}

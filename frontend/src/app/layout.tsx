import '../styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '../components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GameFi Multi-Chain DeFAI Platform',
  description: 'Revolutionary GameFi platform built on ZetaChain with AI-powered assistance',
  keywords: ['GameFi', 'ZetaChain', 'Cross-chain', 'AI', 'Gemini', 'DeFi', 'Blockchain'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center">
                <div className="mr-4 flex">
                  <a className="mr-6 flex items-center space-x-2" href="/">
                    <span className="font-bold gradient-text">GameFi DeFAI</span>
                  </a>
                </div>
              </div>
            </header>
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t py-6 md:py-0">
              <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                  Built for ZetaChain X Google Cloud Buildathon
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
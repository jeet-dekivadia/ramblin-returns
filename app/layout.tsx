import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

const navigation = [
  { name: 'Product Tour', href: '/' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'URL Security', href: '/url-security' },
  { name: 'Technology', href: '/technology' },
];

export const metadata: Metadata = {
  title: "Ramblin' Returns | Turn Spending Into Investing",
  description: "AI-powered financial platform that transforms your spending into smart investments",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'
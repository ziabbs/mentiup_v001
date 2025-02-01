import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SupabaseProvider } from '@/contexts/supabase-context'
import { ProfileProvider } from '@/contexts/profile-context'
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Geist({ 
  subsets: ["latin"],
  variable: "--font-geist",
})

export const metadata: Metadata = {
  title: "MentiUp",
  description: "MentiUp - Mentorluk Platformu",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ProfileProvider>
            <SupabaseProvider>
              {children}
              <Toaster />
            </SupabaseProvider>
          </ProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

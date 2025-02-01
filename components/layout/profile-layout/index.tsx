"use client"

import { ProfileFooter } from "./footer"

interface ProfileLayoutProps {
  children: React.ReactNode
}

export function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="relative min-h-[100dvh] flex flex-col">
      <main className="flex-1 pb-14 md:pb-16">
        <div className="container max-w-4xl mx-auto">
          {children}
        </div>
      </main>
      <ProfileFooter />
    </div>
  )
}

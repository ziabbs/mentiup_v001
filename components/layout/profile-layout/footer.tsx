"use client"

import Link from "next/link"

export function ProfileFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-4xl mx-auto">
        <div className="h-14 flex items-center justify-between px-4">
          <nav className="flex items-center gap-4">
            <Link 
              href="/terms" 
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Kullanım Şartları
            </Link>
            <Link 
              href="/privacy" 
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Gizlilik
            </Link>
          </nav>
          <div className="text-xs sm:text-sm text-muted-foreground">
            2025 MentiUp
          </div>
        </div>
      </div>
    </footer>
  )
}

"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TypingIndicator() {
  return (
    <div 
      className="flex items-start gap-2"
      role="status"
      aria-label="Lola yazıyor..."
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src="/avatars/lola.png" alt="Lola" />
        <AvatarFallback>L</AvatarFallback>
      </Avatar>
      <div 
        className="flex items-center gap-1 rounded-lg bg-muted px-4 py-2"
        aria-hidden="true"
      >
        <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:-0.3s]" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:-0.15s]" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50" />
      </div>
    </div>
  )
}

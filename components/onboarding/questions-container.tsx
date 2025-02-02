"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"



export function QuestionsContainer({
  children,
  isTyping,
}: {
  children: React.ReactNode
  isTyping?: boolean
}) {
  const [isVisible, setIsVisible] = useState(!isTyping)

  useEffect(() => {
    if (!isTyping) {
      const showTimeout = setTimeout(() => {
        setIsVisible(true)
      }, 100)
      return () => clearTimeout(showTimeout)
    } else {
      setIsVisible(false)
    }
  }, [isTyping])

  return (
    <div className="relative">
      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex items-start gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/lola.png" alt="Lola Avatar" />
            <AvatarFallback>L</AvatarFallback>
          </Avatar>
          <div className="flex-1 max-w-[85%] sm:max-w-[75%] bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/40 rounded-2xl p-4
                         border border-emerald-200/50 dark:border-emerald-700/30">
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-emerald-700 dark:text-emerald-300">
                Lola yazıyor
              </span>
              <span className="animate-pulse">...</span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {!isTyping && children && (
        <div className={cn(
          "transition-all duration-300",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          <div className="flex items-start gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/lola.png" alt="Lola Avatar" />
              <AvatarFallback>L</AvatarFallback>
            </Avatar>
            <div className="flex-1 max-w-[85%] sm:max-w-[75%] bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/40 rounded-2xl p-4
                           border border-emerald-200/50 dark:border-emerald-700/30">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

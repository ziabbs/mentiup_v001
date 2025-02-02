"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface StepMessageProps {
  message: string
  subMessage?: string
  previousChoice?: {
    label: string
    value: string
  }
}

export function StepMessage({
  message,
  subMessage,
  previousChoice
}: StepMessageProps) {
  return (
    <div className="flex items-start gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src="/avatars/lola.png" alt="Lola Avatar" />
        <AvatarFallback>L</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2.5 w-full">
        <div className="flex flex-col gap-1.5">
          <p className="text-sm sm:text-base text-emerald-800 dark:text-emerald-200">{message}</p>
          {subMessage && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">{subMessage}</p>
          )}
        </div>
        {previousChoice && (
          <div className="flex flex-col gap-1.5 bg-emerald-50 dark:bg-emerald-900 rounded-lg p-2.5 border border-emerald-200/50 dark:border-emerald-700/30">
            <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">{previousChoice.label}</p>
            <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-100">{previousChoice.value}</p>
          </div>
        )}
      </div>
    </div>
  )
}

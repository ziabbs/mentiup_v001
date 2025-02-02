"use client"

import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

interface LolaMessageProps {
  message: string
  subMessage?: string
  previousChoice?: {
    label: string
    value: string
  }
}

export function LolaMessage({
  message,
  subMessage,
  previousChoice
}: LolaMessageProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
            <Image
              src="/dsdaddsad.png"
              width={44}
              height={44}
              alt="Lola"
              className="rounded-full"
            />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
            {message}
          </p>
          {subMessage && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {subMessage}
            </p>
          )}
        </div>
      </div>

      {previousChoice && (
        <div 
          className="ml-14 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800"
          role="region"
          aria-label="Önceki adımdaki seçiminiz"
        >
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                {previousChoice.label}
              </p>
              <p className="text-sm text-emerald-700/90 dark:text-emerald-300/90">
                {previousChoice.value}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

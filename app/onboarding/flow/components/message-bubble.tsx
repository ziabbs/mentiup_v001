"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Message } from "../types"
import { Rocket, Star, Lightbulb, Target, Search } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"

const ICONS = {
  rocket: <Rocket className="w-3.5 h-3.5" />,
  star: <Star className="w-3.5 h-3.5" />,
  lightbulb: <Lightbulb className="w-3.5 h-3.5" />,
  target: <Target className="w-3.5 h-3.5" />
} as const

interface MessageBubbleProps {
  message: Message
  onOptionSelect?: (optionId: string, optionTitle: string) => void
}

export function MessageBubble({ message, onOptionSelect }: MessageBubbleProps) {
  const isLola = message.type === 'lola'
  const optionsRef = useRef<HTMLDivElement>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const isMultipleSelectionStep = message.id === 'career-development_fields' || 
                                 message.id === 'career-development_industries' ||
                                 message.id === 'senior-career_fields' ||
                                 message.id === 'senior-career_industries' ||
                                 message.id === 'startup_fields' ||
                                 message.id === 'senior-startup_fields'

  const selectedOptions = message.selectedOption ? message.selectedOption.split(', ') : []

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>, optionId: string, optionTitle: string) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        onOptionSelect?.(optionId, optionTitle)
        break
      case 'ArrowDown':
        e.preventDefault()
        const nextButton = e.currentTarget.nextElementSibling as HTMLButtonElement
        nextButton?.focus()
        break
      case 'ArrowUp':
        e.preventDefault()
        const prevButton = e.currentTarget.previousElementSibling as HTMLButtonElement
        prevButton?.focus()
        break
    }
  }, [onOptionSelect])

  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && message.options) {
      const option = message.options.find(opt => 
        opt.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      if (option) {
        onOptionSelect?.(option.id, option.title)
        setSearchTerm("")
      }
    }
  }, [searchTerm, message.options, onOptionSelect])

  useEffect(() => {
    if (message.options && !message.selectedOption) {
      const firstButton = optionsRef.current?.querySelector('button')
      firstButton?.focus()
    }
  }, [message.options, message.selectedOption])

  const filteredOptions = message.options?.filter(option =>
    option.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div 
      className={cn("flex items-start gap-2 sm:gap-3", !isLola && "flex-row-reverse")}
      role="group"
      aria-label={isLola ? "Lola'nın mesajı" : "Sizin mesajınız"}
    >
      <Avatar className="h-8 w-8">
        {isLola ? (
          <>
            <AvatarImage src="/avatars/lola.png" alt="Lola" />
            <AvatarFallback>L</AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src="/avatars/user.png" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </>
        )}
      </Avatar>

      <div className={cn("flex-1", !isLola && "flex flex-col items-end")}>
        <div className={cn(
          "bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-sm",
          !isLola && "bg-emerald-50 dark:bg-emerald-950/20"
        )}>
          <div className="space-y-2">
            <p className="text-sm">{message.content}</p>
            {message.subContent && (
              <p className="text-xs text-muted-foreground">{message.subContent}</p>
            )}

            {message.options && onOptionSelect && (
              <div className="space-y-2">
                {isMultipleSelectionStep && (
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      className="pl-8 bg-transparent border-0 ring-1 ring-emerald-100 dark:ring-emerald-800/20 focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                    />
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                
                <div 
                  ref={optionsRef} 
                  className="grid grid-cols-1 lg:grid-cols-2 gap-2"
                  role="listbox"
                  aria-label="Seçenekler"
                >
                  {filteredOptions?.map(option => (
                    <button
                      key={option.id}
                      onClick={() => onOptionSelect(option.id, option.title)}
                      onKeyDown={(e) => handleKeyDown(e, option.id, option.title)}
                      className={cn(
                        "relative flex items-start gap-2 p-3 rounded-xl text-left text-xs sm:text-sm transition-all duration-300",
                        "bg-gradient-to-br from-white to-emerald-50/50 dark:from-gray-800 dark:to-emerald-900/10",
                        "hover:from-emerald-50 hover:to-emerald-100/50 dark:hover:from-emerald-900/20 dark:hover:to-emerald-800/20",
                        "focus:outline-none focus:ring-1 focus:ring-emerald-200 dark:focus:ring-emerald-700/30",
                        selectedOptions.includes(option.title) && 
                          "from-emerald-100/80 to-emerald-50 dark:from-emerald-800/30 dark:to-emerald-900/30"
                      )}
                      role="option"
                      aria-selected={selectedOptions.includes(option.title)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {option.icon && (
                            <div 
                              className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                                "bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-800/30 dark:to-emerald-900/30"
                              )}
                              aria-hidden="true"
                            >
                              {ICONS[option.icon as keyof typeof ICONS]}
                            </div>
                          )}
                          <span className="font-medium">{option.title}</span>
                        </div>
                        {option.description && (
                          <p className="text-muted-foreground">{option.description}</p>
                        )}
                      </div>
                      
                      <div 
                        className="absolute right-3 top-3"
                        aria-hidden="true"
                      >
                        <svg 
                          viewBox="0 0 24 24" 
                          className={cn(
                            "w-5 h-5 transition-all duration-300",
                            selectedOptions.includes(option.title)
                              ? "text-emerald-500 dark:text-emerald-400" 
                              : "text-emerald-200 dark:text-emerald-800"
                          )}
                          fill="none"
                          strokeWidth={selectedOptions.includes(option.title) ? 2.5 : 1.5}
                          stroke="currentColor"
                        >
                          <path 
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

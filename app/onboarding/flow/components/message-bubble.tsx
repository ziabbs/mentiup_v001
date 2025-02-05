"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Message } from "../types"
import { Rocket, Star, Lightbulb, Target, Search, Plus } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"

const ICONS = {
  rocket: Rocket,
  star: Star,
  lightbulb: Lightbulb,
  target: Target
} as const

interface MessageBubbleProps {
  message: Message
  onOptionSelect?: (optionId: string, optionTitle: string) => void
}

interface Option {
  id: string
  title: string
  type: 'default' | 'custom'
  description?: string
  icon?: keyof typeof ICONS
}

export function MessageBubble({ message, onOptionSelect }: MessageBubbleProps) {
  const isLola = message.type === 'lola'
  const optionsRef = useRef<HTMLDivElement>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [localOptions, setLocalOptions] = useState<Option[]>([])
  
  // Options'ları güncelle
  useEffect(() => {
    if (message.options) {
      // Varsayılan seçeneklere type ekle ve icon tipini dönüştür
      const optionsWithType = message.options.map(opt => ({
        ...opt,
        type: 'default' as const,
        icon: opt.icon && typeof opt.icon === 'string' ? opt.icon as keyof typeof ICONS : undefined
      }))
      setLocalOptions(optionsWithType)
    } else {
      setLocalOptions([])
    }
  }, [message.options])

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

  const handleAddNewOption = useCallback(() => {
    if (searchTerm.trim()) {
      // Yeni seçenek için unique bir ID oluştur
      const newOptionId = `custom_${Math.random().toString(36).substr(2, 9)}`
      const newOption: Option = {
        id: newOptionId,
        title: searchTerm.trim(),
        type: 'custom' as const
      }
      
      // Yerel seçeneklere başa ekle
      setLocalOptions(prev => [newOption, ...(prev ?? [])])
      
      // Seçenek olarak ekle
      onOptionSelect?.(newOptionId, newOption.title)
      
      // Search term'i temizle
      setSearchTerm("")
    }
  }, [searchTerm, onOptionSelect])

  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      e.preventDefault()
      handleAddNewOption()
    }
  }, [searchTerm, handleAddNewOption])

  useEffect(() => {
    if (message.options && !message.selectedOption) {
      const firstButton = optionsRef.current?.querySelector('button')
      firstButton?.focus()
    }
  }, [message.options, message.selectedOption])

  // Filtreleme işlemi localOptions üzerinden yapılıyor
  const filteredOptions = localOptions?.filter(option =>
    option.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Arama ve yeni ekle özelliğinin görünürlüğünü ayarla
  const isSearchableStep = message.id === 'career-development_fields' || 
                          message.id === 'career-development_industries' ||
                          message.id === 'senior-career_fields' ||
                          message.id === 'senior-career_industries' ||
                          message.id === 'senior-career_goals' ||
                          message.id === 'startup_fields' ||
                          message.id === 'senior-startup_fields'

  const showSearch = isSearchableStep
  const showAddNew = isSearchableStep && searchTerm.trim().length > 0

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
                {showSearch && (
                  <div className="relative flex gap-2 items-center mb-2">
                    <div className="relative flex-1">
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
                    {showAddNew && (
                      <button
                        onClick={handleAddNewOption}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-800/30 rounded-md transition-colors"
                        aria-label="Yeni seçenek ekle"
                      >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Yeni Ekle</span>
                      </button>
                    )}
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
                          "from-emerald-100/80 to-emerald-50 dark:from-emerald-800/30 dark:to-emerald-900/30",
                        option.type === 'custom' && "border-2 border-emerald-200 dark:border-emerald-800"
                      )}
                      role="option"
                      aria-selected={selectedOptions.includes(option.title)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {option.icon && (
                            typeof option.icon === 'string' ? 
                              React.createElement(ICONS[option.icon as keyof typeof ICONS], {
                                className: "h-5 w-5 text-emerald-500 dark:text-emerald-400"
                              }) :
                              option.icon
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

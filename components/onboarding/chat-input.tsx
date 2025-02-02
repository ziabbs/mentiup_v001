"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useOnboarding } from "@/app/onboarding/layout"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import ReactMarkdown from 'react-markdown'

interface ChatInputProps {
  value: string
  isNextEnabled: boolean
  progress: number
  onNext?: () => void
  currentStep: string
  totalSteps: string
  readOnly?: boolean
  'aria-label'?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export function ChatInput({
  value,
  isNextEnabled,
  progress,
  onNext,
  currentStep,
  totalSteps,
  readOnly = false,
  onChange,
  'aria-label': ariaLabel,
}: ChatInputProps) {
  const isCompletion = currentStep === "Tamamlandı"
  const buttonText = isCompletion ? "Sohbete Başla" : "İleri"
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Textarea'nın yüksekliğini içeriğe göre ayarla
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "0"
      const scrollHeight = textarea.scrollHeight
      textarea.style.height = `${scrollHeight}px`
    }
  }

  // Value değiştiğinde yüksekliği güncelle
  React.useEffect(() => {
    adjustTextareaHeight()
  }, [value])

  return (
    <div className="relative p-4 bg-white">
      <div className="flex flex-col gap-2 sm:gap-3">
        {/* Progress Bar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
              {currentStep}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {totalSteps}
            </span>
          </div>
          <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 dark:bg-emerald-400 transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Input Area */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            readOnly={readOnly}
            onChange={(e) => {
              onChange?.(e)
              adjustTextareaHeight()
            }}
            className={cn(
              "w-full min-h-[72px] resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-800",
              readOnly && "cursor-default opacity-80"
            )}
            placeholder="Mesajınızı yazın..."
            aria-label={ariaLabel}
          />
          <button
            onClick={onNext}
            disabled={!isNextEnabled && !isCompletion}
            className={cn(
              "absolute bottom-2 right-2 inline-flex items-center justify-center rounded-lg bg-emerald-500 p-2 text-white hover:bg-emerald-600 disabled:pointer-events-none disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-gray-900",
              "transition-opacity duration-200"
            )}
            aria-label={buttonText}
          >
            <span className="sr-only">{buttonText}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function ChatInputWrapper() {
  const {
    chatValue,
    isNextEnabled,
    progress,
    currentStep,
    totalSteps,
    onNext
  } = useOnboarding()

  return (
    <ChatInput
      value={chatValue}
      isNextEnabled={isNextEnabled}
      progress={progress}
      onNext={onNext || undefined}
      currentStep={currentStep}
      totalSteps={totalSteps}
    />
  )
}

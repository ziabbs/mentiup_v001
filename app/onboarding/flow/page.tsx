"use client"

import { useRef, useEffect } from "react"
import { useFlow } from "./use-flow"
import { MessageBubble } from "./components/message-bubble"
import { TypingIndicator } from "./components/typing-indicator"
import { useOnboarding } from "@/hooks/use-onboarding"
import { StepId } from "./types"

export default function FlowPage() {
  // Destructure only what we need from useFlow
  const { messages, isTyping, handleOptionSelect, handleSubmit, currentStep } = useFlow()
  const { setOnNext, setIsNextEnabled } = useOnboarding()
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Handle next button click
  useEffect(() => {
    setOnNext(() => {
      if (handleSubmit) {
        handleSubmit()
      }
    })
  }, [setOnNext, handleSubmit])

  // Handle option selection
  const handleOption = (optionId: string) => {
    // Get the current step from messages
    const currentMessage = messages[messages.length - 1]
    const selectedOption = currentMessage.options?.find(opt => opt.id === optionId)
    
    if (selectedOption) {
      handleOptionSelect(optionId, selectedOption.title, currentStep)
    }
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    if (!chatContainerRef.current) return
    const timeoutId = window.setTimeout(() => {
      const { scrollHeight, clientHeight } = chatContainerRef.current!
      chatContainerRef.current!.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: "smooth"
      })
    }, 100)
    return () => window.clearTimeout(timeoutId)
  }, [messages, isTyping])

  return (
    <div 
      className="flex flex-col h-[calc(100vh-160px)]"
      role="main"
      aria-label="Mentorluk tercihleri sohbet akışı"
    >
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto scroll-smooth"
        role="log"
        aria-live="polite"
        aria-atomic="false"
      >
        <div className="flex flex-col space-y-6 w-full px-6 sm:px-6 md:px-8 lg:px-10">
          {messages.map(message => (
            <MessageBubble
              key={message.id}
              message={message}
              onOptionSelect={handleOption}
            />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
      </div>
    </div>
  )
}

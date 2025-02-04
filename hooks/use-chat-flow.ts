"use client"

import { useCallback, useState, useRef, useEffect } from "react"

interface ChatFlowState {
  step: number
  isTyping: boolean
  showNextQuestion: boolean
  showUserMessage: boolean
}

interface UseChatFlowReturn extends ChatFlowState {
  nextStep: () => Promise<void>
  resetFlow: () => void
}

export function useChatFlow(initialStep = 1): UseChatFlowReturn {
  const [state, setState] = useState<ChatFlowState>({
    step: initialStep,
    isTyping: false,
    showNextQuestion: true,
    showUserMessage: false,
  })

  const isMounted = useRef(true)
  const isTransitioning = useRef(false)

  const nextStep = useCallback(async () => {
    if (isTransitioning.current || !isMounted.current) return
    isTransitioning.current = true

    try {
      // Hide current question and show user message
      setState(prev => ({
        ...prev,
        showNextQuestion: false,
        showUserMessage: true
      }))
      await new Promise(resolve => setTimeout(resolve, 500))

      if (!isMounted.current) return

      // Show typing indicator
      setState(prev => ({
        ...prev,
        isTyping: true
      }))
      await new Promise(resolve => setTimeout(resolve, 1500))

      if (!isMounted.current) return

      // Hide typing and show next question
      setState(prev => ({
        ...prev,
        step: prev.step + 1,
        isTyping: false,
        showNextQuestion: true
      }))
    } finally {
      isTransitioning.current = false
    }
  }, [])

  const resetFlow = useCallback(() => {
    if (!isMounted.current) return
    setState({
      step: initialStep,
      isTyping: false,
      showNextQuestion: true,
      showUserMessage: false,
    })
  }, [initialStep])

  // Cleanup on unmount
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  return {
    ...state,
    nextStep,
    resetFlow
  }
}

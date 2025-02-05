"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Message, MentorshipType, StepId, OnboardingState } from "./types"
import { flowSteps } from "./steps"
import { useOnboarding } from "@/hooks/use-onboarding"
import { useRouter } from "next/navigation"

interface PendingSelection {
  stepId: StepId
  optionId: string
  optionTitle: string
  optionDescription?: string
}

// Mentor tiplerine göre toplam adım sayısı
const TOTAL_STEPS: Record<MentorshipType, number> = {
  'career-development': 3,
  'senior-career': 3,
  'startup': 3,
  'senior-startup': 3
} 

// Hot reload sırasında state'i korumak için
const globalState: OnboardingState = {
  messages: [],
  currentStep: 'mentorship-type',
  selectedMentorType: null,
  pendingSelection: null,
  careerFields: [],
  careerIndustries: [],
  seniorCareerFields: [],
  seniorCareerIndustries: [],
  seniorCareerGoals: [],
  startupFields: [],
  seniorStartupFields: []
}

export function useFlow() {
  const [messages, setMessages] = useState<Message[]>(globalState.messages)
  const [currentStep, setCurrentStep] = useState<StepId>(globalState.currentStep)
  const [isTyping, setIsTyping] = useState(false)
  const [pendingSelection, setPendingSelection] = useState<PendingSelection | null>(globalState.pendingSelection)
  const [selectedMentorType, setSelectedMentorType] = useState<MentorshipType | null>(globalState.selectedMentorType)
  const router = useRouter()
  
  const { 
    setChatValue, 
    setProgress,
    setCurrentStep: setOnboardingStep,
    setTotalSteps,
    updateOnboardingData,
    setIsNextEnabled
  } = useOnboarding()

  const isMounted = useRef(true)
  const isTransitioning = useRef(false)

  // State'i global state'e kaydet
  useEffect(() => {
    globalState.messages = messages
    globalState.currentStep = currentStep
    globalState.selectedMentorType = selectedMentorType
    globalState.pendingSelection = pendingSelection
  }, [messages, currentStep, selectedMentorType, pendingSelection])

  // Initialize first message and steps
  useEffect(() => {
    // Hot reload durumunda global state'den mesajları geri yükle
    if (globalState.messages.length > 0) {
      console.log('Restoring messages from global state:', globalState.messages)
      setMessages(globalState.messages)
      return
    }

    // İlk mesajı ekle
    if (messages.length === 0) {
      const step = flowSteps[currentStep]
      if (!step) return

      const firstMessage: Message = {
        id: `msg_${Math.random().toString(36).substr(2, 9)}`,
        content: step.message,
        isLola: true,
        options: step.options,
        stepId: currentStep
      }

      console.log('Adding first message:', firstMessage)
      setMessages([firstMessage])
      globalState.messages = [firstMessage]

      setOnboardingStep("Adım 1")
      setTotalSteps("/ 4")
      setProgress(25)
    }
  }, [messages.length, currentStep, setOnboardingStep, setTotalSteps, setProgress])

  const handleOptionSelect = useCallback((optionId: string, optionTitle: string, messageId: StepId, optionDescription?: string) => {
    const step = flowSteps[messageId]
    if (!step) return

    // Handle multiple selections based on step
    switch (messageId) {
      case 'career-development_fields':
      case 'career-development_industries':
      case 'senior-career_fields':
      case 'senior-career_industries':
      case 'senior-career_goals':
      case 'startup_fields':
      case 'senior-startup_fields': {
        const stateKey = {
          'career-development_fields': 'careerFields',
          'career-development_industries': 'careerIndustries',
          'senior-career_fields': 'seniorCareerFields',
          'senior-career_industries': 'seniorCareerIndustries',
          'senior-career_goals': 'seniorCareerGoals',
          'startup_fields': 'startupFields',
          'senior-startup_fields': 'seniorStartupFields'
        }[messageId] as keyof Pick<OnboardingState, 'careerFields' | 'careerIndustries' | 'seniorCareerFields' | 'seniorCareerIndustries' | 'seniorCareerGoals' | 'startupFields' | 'seniorStartupFields'>

        const currentValues = (globalState[stateKey] || []) as string[]
        let updated: string[]

        if (currentValues.includes(optionId)) {
          // Seçenek zaten seçili ise kaldır
          updated = currentValues.filter(id => id !== optionId)
        } else {
          // Maksimum 3 seçim kontrolü
          if (currentValues.length >= 3 && !optionId.startsWith('custom_')) return
          
          // Yeni seçenek ise başa ekle, değilse sona ekle
          if (optionId.startsWith('custom_')) {
            updated = [optionId, ...currentValues]
          } else {
            updated = [...currentValues, optionId]
          }
        }

        // Global state'i güncelle
        globalState[stateKey] = updated
        setIsNextEnabled(updated.length > 0)

        // Mesajları güncelle
        const updatedMessages = messages.map((msg, index) => {
          if (index === messages.length - 1) {
            const selectedOptions = updated.map(id => {
              // Özel seçenek ise direkt title'ı kullan
              if (id.startsWith('custom_')) {
                return optionTitle
              }
              // Varsayılan seçenek ise options'dan bul
              const option = flowSteps[messageId]?.options?.find(opt => opt.id === id)
              return option?.title
            }).filter(Boolean)
            return {
              ...msg,
              selectedOption: selectedOptions.join(', ')
            }
          }
          return msg
        })

        setMessages(updatedMessages)
        globalState.messages = updatedMessages
        setChatValue(updatedMessages[updatedMessages.length - 1].selectedOption || '')
        break
      }
      default:
        // For single selections
        setPendingSelection({
          stepId: messageId,
          optionId,
          optionTitle,
          optionDescription
        })
        globalState.pendingSelection = {
          stepId: messageId,
          optionId,
          optionTitle,
          optionDescription
        }

        // Update message with selected option
        const updatedMessages = messages.map((msg, index) => {
          if (index === messages.length - 1) {
            return {
              ...msg,
              selectedOption: optionTitle
            }
          }
          return msg
        })
        setMessages(updatedMessages)
        globalState.messages = updatedMessages
        setChatValue(optionTitle)

        setIsNextEnabled(true)
        break
    }
  }, [messages, setPendingSelection, setIsNextEnabled, setChatValue])

  const calculateProgress = useCallback((stepId: StepId) => {
    if (!selectedMentorType) return 25

    const totalSteps = TOTAL_STEPS[selectedMentorType]
    const currentStepNumber = (() => {
      switch (selectedMentorType) {
        case 'career-development':
          switch (stepId) {
            case 'career-development_fields': return 1
            case 'career-development_industries': return 2
            case 'career-development_goals': return 3
            default: return 1
          }
        case 'senior-career':
          switch (stepId) {
            case 'senior-career_fields': return 1
            case 'senior-career_industries': return 2
            case 'senior-career_goals': return 3
            default: return 1
          }
        case 'startup':
          switch (stepId) {
            case 'startup_fields': return 1
            case 'startup_stages': return 2
            case 'startup_goals': return 3
            default: return 1
          }
        case 'senior-startup':
          switch (stepId) {
            case 'senior-startup_fields': return 1
            case 'senior-startup_stages': return 2
            case 'senior-startup_goals': return 3
            default: return 1
          }
        default:
          return 1
      }
    })()

    return Math.round((currentStepNumber / totalSteps) * 100)
  }, [selectedMentorType])

  // Handle option selection
  const handleSubmit = useCallback(async () => {
    if (isTransitioning.current) return
    isTransitioning.current = true

    try {
      console.log('Current step:', currentStep)

      // Get current step
      const step = flowSteps[currentStep]
      if (!step || !step.nextStep) {
        console.error('Step or nextStep not found:', currentStep)
        isTransitioning.current = false
        return
      }

      // For multiple selection steps
      let selectedContent = ""
      let selectedOptionId = ""

      switch (currentStep) {
        case 'career-development_fields':
          if (!globalState.careerFields?.length) {
            isTransitioning.current = false
            return
          }
          selectedContent = globalState.careerFields.map((id: string) => {
            const option = flowSteps[currentStep]?.options?.find(opt => opt.id === id)
            return option?.title
          }).filter(Boolean).join(', ')
          selectedOptionId = globalState.careerFields[0] // Use first selection for next step
          updateOnboardingData('careerFields', globalState.careerFields)
          break

        case 'career-development_industries':
          if (!globalState.careerIndustries?.length) {
            isTransitioning.current = false
            return
          }
          selectedContent = globalState.careerIndustries.map((id: string) => {
            const option = flowSteps[currentStep]?.options?.find(opt => opt.id === id)
            return option?.title
          }).filter(Boolean).join(', ')
          selectedOptionId = globalState.careerIndustries[0]
          updateOnboardingData('careerIndustries', globalState.careerIndustries)
          break

        case 'senior-career_fields':
          if (!globalState.seniorCareerFields?.length) {
            isTransitioning.current = false
            return
          }
          selectedContent = globalState.seniorCareerFields.map((id: string) => {
            const option = flowSteps[currentStep]?.options?.find(opt => opt.id === id)
            return option?.title
          }).filter(Boolean).join(', ')
          selectedOptionId = globalState.seniorCareerFields[0]
          updateOnboardingData('seniorCareerFields', globalState.seniorCareerFields)
          break

        case 'senior-career_industries':
          if (!globalState.seniorCareerIndustries?.length) {
            isTransitioning.current = false
            return
          }
          selectedContent = globalState.seniorCareerIndustries.map((id: string) => {
            const option = flowSteps[currentStep]?.options?.find(opt => opt.id === id)
            return option?.title
          }).filter(Boolean).join(', ')
          selectedOptionId = globalState.seniorCareerIndustries[0]
          updateOnboardingData('seniorCareerIndustries', globalState.seniorCareerIndustries)
          break

        case 'startup_fields':
          if (!globalState.startupFields?.length) {
            isTransitioning.current = false
            return
          }
          selectedContent = globalState.startupFields.map((id: string) => {
            const option = flowSteps[currentStep]?.options?.find(opt => opt.id === id)
            return option?.title
          }).filter(Boolean).join(', ')
          selectedOptionId = globalState.startupFields[0]
          updateOnboardingData('startupFields', globalState.startupFields)
          break

        case 'senior-startup_fields':
          if (!globalState.seniorStartupFields?.length) {
            isTransitioning.current = false
            return
          }
          selectedContent = globalState.seniorStartupFields.map((id: string) => {
            const option = flowSteps[currentStep]?.options?.find(opt => opt.id === id)
            return option?.title
          }).filter(Boolean).join(', ')
          selectedOptionId = globalState.seniorStartupFields[0]
          updateOnboardingData('seniorStartupFields', globalState.seniorStartupFields)
          break

        default:
          // For single selections
          if (!pendingSelection) {
            isTransitioning.current = false
            return
          }
          selectedContent = pendingSelection.optionTitle
          selectedOptionId = pendingSelection.optionId

          // Update onboarding data based on step
          switch (currentStep) {
            case 'mentorship-type':
              const newMentorType = pendingSelection.optionId as MentorshipType
              setSelectedMentorType(newMentorType)
              globalState.selectedMentorType = newMentorType
              updateOnboardingData('mentorshipType', newMentorType)
              break
            case 'career-development_goals':
              updateOnboardingData('careerGoals', [pendingSelection.optionId])
              break
            case 'senior-career_goals':
              updateOnboardingData('seniorCareerGoals', [pendingSelection.optionId])
              break
            case 'startup_stages':
              updateOnboardingData('startupStages', [pendingSelection.optionId])
              break
            case 'startup_goals':
              updateOnboardingData('startupGoals', [pendingSelection.optionId])
              break
            case 'senior-startup_stages':
              updateOnboardingData('seniorStartupStages', [pendingSelection.optionId])
              break
            case 'senior-startup_goals':
              updateOnboardingData('seniorStartupGoals', [pendingSelection.optionId])
              break
          }
          break
      }

      // Add user message
      const newMessage: Message = {
        id: `msg_${Math.random().toString(36).substr(2, 9)}`,
        content: selectedContent,
        isLola: false,
        options: [],
        stepId: currentStep
      }
      
      console.log('Adding user message:', newMessage)
      setMessages(prev => [...prev, newMessage])
      globalState.messages = [...globalState.messages, newMessage]

      // Get next step
      const nextStepId = step.nextStep(selectedOptionId)
      console.log('Next step ID:', nextStepId)

      if (!nextStepId) {
        console.log('No next step, completing flow')
        // Flow completed, redirect to chat
        if (currentStep === 'completion') {
          router.push('/chat')
        }
        isTransitioning.current = false
        return
      }

      // Clear selections
      setPendingSelection(null)
      globalState.pendingSelection = null
      setChatValue('')

      // Update progress
      const progress = calculateProgress(nextStepId as StepId)
      console.log('Progress:', progress)
      setProgress(progress)

      // Update step number
      const stepNumber = Math.round((progress / 100) * (selectedMentorType ? TOTAL_STEPS[selectedMentorType] : 3))
      console.log('Step number:', stepNumber, 'Total steps:', selectedMentorType ? TOTAL_STEPS[selectedMentorType] : 3)
      setOnboardingStep(String(stepNumber))

      // Add next step message after a delay
      setIsTyping(true)
      await new Promise(resolve => setTimeout(resolve, 1000))

      const nextStep = flowSteps[nextStepId]
      if (!nextStep) {
        console.error('Next step not found:', nextStepId)
        isTransitioning.current = false
        return
      }

      const nextMessage: Message = {
        id: `msg_${Math.random().toString(36).substr(2, 9)}`,
        content: nextStep.message,
        isLola: true,
        options: nextStep.options,
        stepId: nextStepId
      }

      setMessages(prev => [...prev, nextMessage])
      globalState.messages = [...globalState.messages, nextMessage]
      setCurrentStep(nextStepId)
      globalState.currentStep = nextStepId
      setIsTyping(false)
      setIsNextEnabled(false)

    } catch (error) {
      console.error('Error in handleSubmit:', error)
    } finally {
      isTransitioning.current = false
    }
  }, [currentStep, pendingSelection, setPendingSelection, setIsNextEnabled, setProgress, setOnboardingStep, selectedMentorType, updateOnboardingData, router, calculateProgress, setChatValue])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('Component unmounting, cleaning up')
      isMounted.current = false
      setIsTyping(false)
    }
  }, [])

  // Debug messages changes
  useEffect(() => {
    console.log('Messages updated:', messages)
  }, [messages])

  // Reset typing indicator when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setIsTyping(false)
    }
  }, [messages])

  return {
    messages,
    isTyping,
    handleOptionSelect,
    handleSubmit,
    currentStep
  }
}

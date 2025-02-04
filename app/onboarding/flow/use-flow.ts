"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Message, OnboardingState, FlowStep, FlowSteps, Option, MentorshipType, StepId } from "./types"
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
const globalState = {
  messages: [] as Message[],
  currentStep: 'mentorship-type' as StepId,
  selectedMentorType: null as MentorshipType | null,
  pendingSelection: null as PendingSelection | null,
  careerFields: [] as string[],
  careerIndustries: [] as string[],
  seniorCareerFields: [] as string[],
  seniorCareerIndustries: [] as string[],
  startupFields: [] as string[],
  seniorStartupFields: [] as string[]
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
        id: step.id,
        type: 'lola' as const,
        content: step.message,
        subContent: step.subMessage,
        options: step.options,
        timestamp: Date.now()
      }

      console.log('Adding first message:', firstMessage)
      setMessages([firstMessage])
      globalState.messages = [firstMessage]

      setOnboardingStep("Adım 1")
      setTotalSteps("/ 3")
      setProgress(25)
    }
  }, [messages.length, currentStep, setOnboardingStep, setTotalSteps, setProgress])

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, {
      ...message,
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now()
    }])
  }, [])

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
  const handleOptionSelect = useCallback((optionId: string, optionTitle: string, stepId?: StepId) => {
    const step = flowSteps[stepId || currentStep]
    if (!step) return

    // Handle multiple selections based on step
    switch (stepId || currentStep) {
      case 'career-development_fields':
        const currentFields = (globalState.careerFields || []) as string[]
        if (currentFields.includes(optionId)) {
          const updated = currentFields.filter(id => id !== optionId)
          globalState.careerFields = updated
          setIsNextEnabled(updated.length > 0)
          
          // Update selected options in message
          const updatedMessages = messages.map((msg, index) => {
            if (index === messages.length - 1) {
              const selectedOptions = updated.map(id => {
                const option = flowSteps[currentStep]?.options?.find(opt => opt.id === id)
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
        } else {
          if (currentFields.length >= 3) return // Maximum 3 selections
          const updated = [...currentFields, optionId]
          globalState.careerFields = updated
          setIsNextEnabled(true)
          
          // Update selected options in message
          const updatedMessages = messages.map((msg, index) => {
            if (index === messages.length - 1) {
              const selectedOptions = updated.map(id => {
                const option = flowSteps[currentStep]?.options?.find(opt => opt.id === id)
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
        }
        return

      case 'career-development_industries':
        const currentIndustries = (globalState.careerIndustries || []) as string[]
        if (currentIndustries.includes(optionId)) {
          const updated = currentIndustries.filter(id => id !== optionId)
          globalState.careerIndustries = updated
          setIsNextEnabled(updated.length > 0)
          
          // Update selected options in message
          const updatedMessages = messages.map((msg, index) => {
            if (index === messages.length - 1) {
              const selectedOptions = updated.map(id => {
                const option = flowSteps[currentStep]?.options?.find(opt => opt.id === id)
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
        } else {
          if (currentIndustries.length >= 3) return // Maximum 3 selections
          const updated = [...currentIndustries, optionId]
          globalState.careerIndustries = updated
          setIsNextEnabled(true)
          
          // Update selected options in message
          const updatedMessages = messages.map((msg, index) => {
            if (index === messages.length - 1) {
              const selectedOptions = updated.map(id => {
                const option = flowSteps[currentStep]?.options?.find(opt => opt.id === id)
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
        }
        return

      case 'senior-career_fields':
        const currentSeniorFields = (globalState.seniorCareerFields || []) as string[]
        if (currentSeniorFields.includes(optionId)) {
          const updated = currentSeniorFields.filter(id => id !== optionId)
          globalState.seniorCareerFields = updated
          setIsNextEnabled(updated.length > 0)
          
          // Update selected options in message
          const updatedMessages = messages.map((msg, index) => {
            if (index === messages.length - 1) {
              const selectedOptions = updated.map(id => {
                const option = flowSteps[currentStep]?.options?.find(opt => opt.id === id)
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
        } else {
          if (currentSeniorFields.length >= 3) return // Maximum 3 selections
          const updated = [...currentSeniorFields, optionId]
          globalState.seniorCareerFields = updated
          setIsNextEnabled(true)
          
          // Update selected options in message
          const updatedMessages = messages.map((msg, index) => {
            if (index === messages.length - 1) {
              const selectedOptions = updated.map(id => {
                const option = flowSteps[currentStep]?.options?.find(opt => opt.id === id)
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
        }
        return

      case 'senior-career_industries':
        const currentSeniorIndustries = (globalState.seniorCareerIndustries || []) as string[]
        if (currentSeniorIndustries.includes(optionId)) {
          const updated = currentSeniorIndustries.filter(id => id !== optionId)
          globalState.seniorCareerIndustries = updated
          setIsNextEnabled(updated.length > 0)
          
          // Update selected options in message
          const updatedMessages = messages.map((msg, index) => {
            if (index === messages.length - 1) {
              const selectedOptions = updated.map(id => {
                const option = flowSteps[currentStep]?.options?.find(opt => opt.id === id)
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
        } else {
          if (currentSeniorIndustries.length >= 3) return // Maximum 3 selections
          const updated = [...currentSeniorIndustries, optionId]
          globalState.seniorCareerIndustries = updated
          setIsNextEnabled(true)
          
          // Update selected options in message
          const updatedMessages = messages.map((msg, index) => {
            if (index === messages.length - 1) {
              const selectedOptions = updated.map(id => {
                const option = flowSteps[currentStep]?.options?.find(opt => opt.id === id)
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
        }
        return

      case 'startup_fields':
        const currentStartupFields = (globalState.startupFields || []) as string[]
        if (currentStartupFields.includes(optionId)) {
          const updated = currentStartupFields.filter(id => id !== optionId)
          globalState.startupFields = updated
          setIsNextEnabled(updated.length > 0)
          
          // Update selected options in message
          const updatedMessages = messages.map((msg, index) => {
            if (index === messages.length - 1) {
              const selectedOptions = updated.map(id => {
                const option = flowSteps[currentStep]?.options?.find(opt => opt.id === id)
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
        } else {
          if (currentStartupFields.length >= 3) return // Maximum 3 selections
          const updated = [...currentStartupFields, optionId]
          globalState.startupFields = updated
          setIsNextEnabled(true)
          
          // Update selected options in message
          const updatedMessages = messages.map((msg, index) => {
            if (index === messages.length - 1) {
              const selectedOptions = updated.map(id => {
                const option = flowSteps[currentStep]?.options?.find(opt => opt.id === id)
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
        }
        return

      case 'senior-startup_fields':
        const currentSeniorStartupFields = (globalState.seniorStartupFields || []) as string[]
        if (currentSeniorStartupFields.includes(optionId)) {
          const updated = currentSeniorStartupFields.filter(id => id !== optionId)
          globalState.seniorStartupFields = updated
          setIsNextEnabled(updated.length > 0)
          
          // Update selected options in message
          const updatedMessages = messages.map((msg, index) => {
            if (index === messages.length - 1) {
              const selectedOptions = updated.map(id => {
                const option = flowSteps[currentStep]?.options?.find(opt => opt.id === id)
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
        } else {
          if (currentSeniorStartupFields.length >= 3) return // Maximum 3 selections
          const updated = [...currentSeniorStartupFields, optionId]
          globalState.seniorStartupFields = updated
          setIsNextEnabled(true)
          
          // Update selected options in message
          const updatedMessages = messages.map((msg, index) => {
            if (index === messages.length - 1) {
              const selectedOptions = updated.map(id => {
                const option = flowSteps[currentStep]?.options?.find(opt => opt.id === id)
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
        }
        return

      default:
        // For single selections
        setPendingSelection({
          stepId: stepId || currentStep,
          optionId,
          optionTitle
        })
        globalState.pendingSelection = {
          stepId: stepId || currentStep,
          optionId,
          optionTitle
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
  }, [currentStep, setPendingSelection, setIsNextEnabled, messages])

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
          selectedContent = globalState.careerFields.map(id => {
            const option = step.options?.find(opt => opt.id === id)
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
          selectedContent = globalState.careerIndustries.map(id => {
            const option = step.options?.find(opt => opt.id === id)
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
          selectedContent = globalState.seniorCareerFields.map(id => {
            const option = step.options?.find(opt => opt.id === id)
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
          selectedContent = globalState.seniorCareerIndustries.map(id => {
            const option = step.options?.find(opt => opt.id === id)
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
          selectedContent = globalState.startupFields.map(id => {
            const option = step.options?.find(opt => opt.id === id)
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
          selectedContent = globalState.seniorStartupFields.map(id => {
            const option = step.options?.find(opt => opt.id === id)
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
        id: Math.random().toString(36).substring(7),
        type: 'user' as const,
        content: selectedContent,
        timestamp: Date.now()
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
        id: nextStepId,
        type: 'lola',
        content: nextStep.message,
        options: nextStep.options,
        timestamp: Date.now()
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
  }, [currentStep, pendingSelection, setPendingSelection, setIsNextEnabled, setProgress, setOnboardingStep, selectedMentorType, updateOnboardingData, router])

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

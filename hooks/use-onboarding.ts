"use client"

import { createContext, useContext } from "react"

interface StepChoice {
  label: string
  value: string
}

export interface OnboardingData {
  mentorshipType?: string
  fields?: { value: string; label: string }[]
  goals?: string[]
  expectations?: string
  stepChoices?: {
    [key: string]: StepChoice
  }
}

export interface OnboardingContextType {
  currentStep: string
  setCurrentStep: (step: string) => void
  totalSteps: string
  setTotalSteps: (steps: string) => void
  progress: number
  setProgress: (progress: number) => void
  chatValue: string
  setChatValue: (value: string) => void
  isNextEnabled: boolean
  setIsNextEnabled: (enabled: boolean) => void
  onNext?: () => void
  setOnNext: (callback: (() => void) | undefined) => void
  onboardingData: OnboardingData
  setOnboardingData: (data: Partial<OnboardingData>) => void
}

export const OnboardingContext = createContext<OnboardingContextType | null>(null)

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}

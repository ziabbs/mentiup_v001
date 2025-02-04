"use client"

import { OnboardingState } from "@/app/onboarding/flow/types"
import { create } from "zustand"

interface OnboardingStore {
  // Navigation State
  isNextEnabled: boolean
  setIsNextEnabled: (enabled: boolean) => void
  onNext?: () => void
  setOnNext: (callback: (() => void) | undefined) => void
  
  // Progress State
  progress: number
  setProgress: (progress: number) => void
  currentStep: string
  setCurrentStep: (step: string) => void
  totalSteps: string
  setTotalSteps: (steps: string) => void
  
  // Chat State
  chatValue: string
  setChatValue: (value: string) => void
  
  // Data State
  onboardingData: Partial<OnboardingState>
  setOnboardingData: (data: Partial<OnboardingState>) => void
  updateOnboardingData: (key: keyof OnboardingState, value: any) => void
}

export const useOnboarding = create<OnboardingStore>((set) => ({
  // Navigation State
  isNextEnabled: false,
  setIsNextEnabled: (enabled) => set({ isNextEnabled: enabled }),
  onNext: undefined,
  setOnNext: (callback) => set({ onNext: callback }),
  
  // Progress State
  progress: 0,
  setProgress: (progress) => set({ progress }),
  currentStep: "",
  setCurrentStep: (step) => set({ currentStep: step }),
  totalSteps: "",
  setTotalSteps: (steps) => set({ totalSteps: steps }),
  
  // Chat State
  chatValue: "",
  setChatValue: (value) => set({ chatValue: value }),
  
  // Data State
  onboardingData: {},
  setOnboardingData: (data) => set((state) => ({
    onboardingData: { ...state.onboardingData, ...data }
  })),
  updateOnboardingData: (key, value) => set((state) => ({
    onboardingData: {
      ...state.onboardingData,
      [key]: value
    }
  }))
}))

"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MeetingHeader } from "@/components/onboarding/meeting-header"
import { ChatInput } from "@/components/onboarding/chat-input"

interface OnboardingData {
  mentorshipType?: string
  goals?: string[]
  fields?: (string | { value: string; label: string })[]
  expectations?: string
  stage?: string
  stepChoices?: {
    [key: string]: {
      label: string
      value: string
    }
  }
}

interface OnboardingContextType {
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

const OnboardingContext = createContext<OnboardingContextType>({
  currentStep: "",
  setCurrentStep: () => {},
  totalSteps: "",
  setTotalSteps: () => {},
  progress: 0,
  setProgress: () => {},
  chatValue: "",
  setChatValue: () => {},
  isNextEnabled: false,
  setIsNextEnabled: () => {},
  onNext: undefined,
  setOnNext: () => {},
  onboardingData: {},
  setOnboardingData: () => {},
})

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider")
  }
  return context
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [currentStep, setCurrentStep] = useState("Adım 1")
  const [totalSteps, setTotalSteps] = useState("/ 4")
  const [progress, setProgress] = useState(0)
  const [chatValue, setChatValue] = useState("")
  const [isNextEnabled, setIsNextEnabled] = useState(false)
  const [onNext, setOnNext] = useState<(() => void) | undefined>(undefined)
  const [onboardingData, setOnboardingDataState] = useState<OnboardingData>({
    stepChoices: {}
  })
  const router = useRouter()

  const setOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingDataState(prev => ({ ...prev, ...data }))
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  const generatedPrompt = `Merhaba Lola,\n\nMentorluk tercihlerimi aşağıdaki gibi belirledim:\n\n**Mentorluk Tipi:** ${onboardingData.mentorshipType}\n**Hedeflerim:** ${onboardingData.goals?.join(', ')}\n**İlgi Alanlarım:** ${onboardingData.fields?.map(field => typeof field === 'string' ? field : field.value).join(', ')}\n**Beklentilerim:** ${onboardingData.expectations}\n\nBu doğrultuda bana özel bir mentorluk planı oluşturmanı rica ediyorum.`;

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        totalSteps,
        setTotalSteps,
        progress,
        setProgress,
        chatValue,
        setChatValue,
        isNextEnabled,
        setIsNextEnabled,
        onNext,
        setOnNext,
        onboardingData,
        setOnboardingData,
      }}
    >
      <div className="flex flex-col min-h-[100dvh] bg-background">
        <div className={`fixed top-0 left-0 right-0 z-50 ${mounted ? "" : "invisible"}`}>
          <MeetingHeader />
        </div>
        
        <main className="flex-1 pt-24 pb-[100px] overflow-y-auto">
          <div className="h-full">
            {children}
          </div>
        </main>

        <div className={`fixed bottom-0 left-0 right-0 z-50 ${mounted ? "" : "invisible"}`}>
          <ChatInput
            value={currentStep === 'Tamamlandı' ? generatedPrompt : chatValue}
            isNextEnabled={isNextEnabled}
            progress={progress}
            onNext={currentStep === 'Tamamlandı' ? () => router.push('/chat') : onNext}
            currentStep={currentStep}
            totalSteps={totalSteps}
            readOnly={currentStep === 'Tamamlandı'}
            onChange={(e) => setChatValue(e.target.value)}
            aria-label={currentStep === 'Tamamlandı' ? 'Mentorluk tercihleriniz' : 'Onboarding girişi'}
          />
        </div>

        <style jsx global>{`
          @supports (-webkit-touch-callout: none) {
            .min-h-[100dvh] {
              min-height: -webkit-fill-available;
            }
          }
        `}</style>
      </div>
    </OnboardingContext.Provider>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { MeetingHeader } from "@/components/onboarding/meeting-header"
import { ChatInput } from "@/components/onboarding/chat-input"
import { OnboardingContext, type OnboardingData } from "@/hooks/use-onboarding"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [currentStep, setCurrentStep] = useState("Adım 1")
  const [totalSteps, setTotalSteps] = useState("/ 4")
  const [progress, setProgress] = useState(25)
  const [chatValue, setChatValue] = useState("")
  const [isNextEnabled, setIsNextEnabled] = useState(false)
  const [onNext, setOnNext] = useState<(() => void) | undefined>(undefined)
  const [onboardingData, _setOnboardingData] = useState<OnboardingData>({
    stepChoices: {}
  })
  const router = useRouter()
  const pathname = usePathname()

  const setOnboardingData = (data: Partial<OnboardingData>) => {
    _setOnboardingData((prev: OnboardingData) => ({ ...prev, ...data }))
  }

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const headerAndChatClasses = mounted ? "opacity-100 transition-opacity duration-200" : "opacity-0"

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
        {pathname !== '/onboarding' && (
          <div className={`fixed top-0 left-0 right-0 z-40 ${headerAndChatClasses}`}>
            <MeetingHeader />
          </div>
        )}
        
        <main className={`flex-1 ${pathname !== '/onboarding' ? 'pt-24 pb-[100px]' : ''} overflow-visible`}>
          <div className="h-full relative">
            {children}
          </div>
        </main>

        {pathname !== '/onboarding' && (
          <div className={`fixed bottom-0 left-0 right-0 z-40 ${headerAndChatClasses}`}>
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
        )}
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

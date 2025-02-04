"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { MeetingHeader } from "@/app/onboarding/flow/components/meeting-header"
import { ChatInput } from "@/app/onboarding/flow/components/chat-input"
import { useOnboarding } from "@/hooks/use-onboarding"
import { useFlow } from "./flow/use-flow"

const headerAndChatClasses = "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const {
    isNextEnabled,
    onNext,
    progress,
    currentStep,
    totalSteps,
    chatValue,
    setChatValue,
    onboardingData,
  } = useOnboarding()

  const { messages } = useFlow()
  const router = useRouter()
  const pathname = usePathname()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Onboarding verilerini formatlı göster
  const formatOnboardingData = () => {
    const data = []
    
    if (onboardingData.mentorshipType) {
      data.push(`**Mentorluk Tipi:** ${onboardingData.mentorshipType}`)
    }
    
    // Career Development
    if (onboardingData.careerFields?.length) {
      data.push(`**Kariyer Alanları:** ${onboardingData.careerFields.join(', ')}`)
    }
    if (onboardingData.careerIndustries?.length) {
      data.push(`**Sektörler:** ${onboardingData.careerIndustries.join(', ')}`)
    }
    if (onboardingData.careerGoals?.length) {
      data.push(`**Kariyer Hedefleri:** ${onboardingData.careerGoals.join(', ')}`)
    }

    // Senior Career
    if (onboardingData.seniorCareerFields?.length) {
      data.push(`**Üst Düzey Kariyer Alanları:** ${onboardingData.seniorCareerFields.join(', ')}`)
    }
    if (onboardingData.seniorCareerIndustries?.length) {
      data.push(`**Üst Düzey Kariyer Sektörleri:** ${onboardingData.seniorCareerIndustries.join(', ')}`)
    }
    if (onboardingData.seniorCareerGoals?.length) {
      data.push(`**Üst Düzey Kariyer Hedefleri:** ${onboardingData.seniorCareerGoals.join(', ')}`)
    }

    // Startup
    if (onboardingData.startupFields?.length) {
      data.push(`**Startup Alanları:** ${onboardingData.startupFields.join(', ')}`)
    }
    if (onboardingData.startupStages?.length) {
      data.push(`**Startup Aşaması:** ${onboardingData.startupStages.join(', ')}`)
    }
    if (onboardingData.startupGoals?.length) {
      data.push(`**Startup Hedefleri:** ${onboardingData.startupGoals.join(', ')}`)
    }

    // Senior Startup
    if (onboardingData.seniorStartupFields?.length) {
      data.push(`**Üst Düzey Startup Alanları:** ${onboardingData.seniorStartupFields.join(', ')}`)
    }
    if (onboardingData.seniorStartupStages?.length) {
      data.push(`**Üst Düzey Startup Aşaması:** ${onboardingData.seniorStartupStages.join(', ')}`)
    }
    if (onboardingData.seniorStartupGoals?.length) {
      data.push(`**Üst Düzey Startup Hedefleri:** ${onboardingData.seniorStartupGoals.join(', ')}`)
    }

    // Expectations
    if (onboardingData.expectation) {
      data.push(`**Beklentiler:** ${onboardingData.expectation}`)
    }
    
    return `Merhaba Lola,\n\nMentorluk tercihlerimi aşağıdaki gibi belirledim:\n\n${data.join('\n\n')}\n\nBu doğrultuda bana özel bir mentorluk planı oluşturmanı rica ediyorum.`
  }

  const generatedPrompt = formatOnboardingData()

  const handleNext = () => {
    if (currentStep === 'Tamamlandı') {
      router.push('/chat')
    } else if (onNext) {
      onNext()
    }
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      {pathname !== '/onboarding' && (
        <div className={`fixed top-0 left-0 right-0 z-40 ${headerAndChatClasses}`}>
          <MeetingHeader />
        </div>
      )}
      
      <div className={`flex-1 overflow-y-auto ${headerAndChatClasses}`}>
        <div className="flex flex-col gap-4 py-8 pt-32 pb-32">
          {children}
        </div>
      </div>

      {pathname !== '/onboarding' && (
        <div className={`fixed bottom-0 left-0 right-0 z-40 ${headerAndChatClasses}`}>
          <ChatInput
            value={currentStep === 'Tamamlandı' ? generatedPrompt : messages[messages.length - 1]?.selectedOption || chatValue}
            isNextEnabled={isNextEnabled}
            progress={progress}
            onNext={handleNext}
            currentStep={currentStep}
            totalSteps={totalSteps}
            readOnly={currentStep === 'Tamamlandı' || Boolean(messages[messages.length - 1]?.selectedOption)}
            onChange={(e) => setChatValue(e.target.value)}
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
  )
}

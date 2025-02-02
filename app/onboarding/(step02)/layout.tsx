"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useOnboarding } from "../layout"
import { StepMessage } from "@/components/onboarding/step-message"

const mentorshipTypeMessages = {
  "career_development": "kariyer gelişiminiz",
  "startup": "startup yolculuğunuz",
  "senior_career": "üst düzey kariyer hedefleriniz",
  "senior_startup": "üst düzey startup hedefleriniz"
}

export default function Step2Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { 
    setCurrentStep, 
    setTotalSteps,
    setProgress,
    onboardingData
  } = useOnboarding()

  useEffect(() => {
    setCurrentStep("Adım 2")
    setTotalSteps("/ 4")
    setProgress(50)

    // Eğer 1. adımda seçim yapılmamışsa ana sayfaya yönlendir
    if (!onboardingData.mentorshipType) {
      router.push("/onboarding")
      return
    }

    // Doğru sayfada olduğumuzu kontrol et
    const currentPath = window.location.pathname
    const expectedPath = `/onboarding/${onboardingData.mentorshipType.toLowerCase().replace('_type_', '_')}`
    
    if (currentPath !== expectedPath) {
      router.push(expectedPath)
    }
  }, [setCurrentStep, setTotalSteps, setProgress, onboardingData.mentorshipType, router])

  // Önceki adımın seçimini al
  const previousChoice = onboardingData.stepChoices?.["step1"] || (
    onboardingData.mentorshipType ? {
      label: "Seçilen Mentorluk Tipi",
      value: mentorshipTypeMessages[onboardingData.mentorshipType as keyof typeof mentorshipTypeMessages] || onboardingData.mentorshipType
    } : undefined
  )

  return (
    <main className="relative p-4 space-y-16">
      
        <StepMessage
          message="Harika! Şimdi hedeflerinizi belirleyelim."
          subMessage="Size en uygun hedefleri seçin"
          previousChoice={previousChoice}
        />
        
        {children}
    </main>
  )
}

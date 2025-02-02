"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useOnboarding } from "@/hooks/use-onboarding"

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

  return (
    <>{children}</>
  )
}

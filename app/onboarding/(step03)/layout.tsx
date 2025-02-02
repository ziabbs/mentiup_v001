"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useOnboarding } from "@/hooks/use-onboarding"

export default function Step3Layout({
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
    setCurrentStep("Adım 3")
    setTotalSteps("/ 4")
    setProgress(75)

    // Eğer önceki adımlarda seçim yapılmamışsa ana sayfaya yönlendir
    if (!onboardingData.mentorshipType || !onboardingData.goals) {
      router.push("/onboarding")
      return
    }
  }, [setCurrentStep, setTotalSteps, setProgress, onboardingData.mentorshipType, onboardingData.goals, router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {children}
      </div>
    </main>
  )
}

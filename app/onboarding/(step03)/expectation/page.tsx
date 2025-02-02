"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { StepMessage } from "@/components/onboarding/step-message"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { useOnboarding } from "../../layout"

interface Suggestion {
  id: string
  text: string
}

const suggestions: Suggestion[] = [
  {
    id: "1",
    text: "Kariyerimde ilerlemek için hangi adımları atmalıyım?"
  },
  {
    id: "2",
    text: "Yeni bir iş kurarken nelere dikkat etmeliyim?"
  },
  {
    id: "3",
    text: "Liderlik becerilerimi nasıl geliştirebilirim?"
  }
]

export default function ExpectationPage() {
  const router = useRouter()
  const { 
    setProgress, 
    setCurrentStep, 
    setTotalSteps, 
    setOnboardingData,
    onboardingData,
    setIsNextEnabled,
    setOnNext,
    setChatValue
  } = useOnboarding()

  const [expectation, setExpectation] = useState("")
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setIsNextEnabled(false)
    setOnNext(undefined)
    setCurrentStep("Adım 3")
    setTotalSteps("/ 4")
    setProgress(75)
    console.log("onboardingData:", onboardingData)
  }, [setIsNextEnabled, setOnNext, setCurrentStep, setTotalSteps, setProgress, onboardingData])

  useEffect(() => {
    setIsNextEnabled(expectation.trim().length > 0)
    setOnNext(() => handleSubmit)
  }, [expectation, setIsNextEnabled, setOnNext])

  const handleSuggestionClick = (text: string) => {
    setExpectation(text)
    setSelectedSuggestion(text)
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      // Beklentiyi kaydet
      setOnboardingData({
        expectations: expectation,
        stepChoices: {
          ...onboardingData.stepChoices,
          step3: {
            label: "Beklentileriniz",
            value: expectation
          }
        }
      })

      // Chat input'u güncelle
      setChatValue(expectation)

      // Sonraki adıma geç
      router.push("/onboarding/completion")
    } catch (error) {
      console.error("Error submitting expectation:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Step Message */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-sm">
            <div className="space-y-6">
              <StepMessage
                message="Merhaba! Birlikte çalışmaya başlamadan önce, benden beklentilerini öğrenmek istiyorum. Bu sayede sana daha iyi rehberlik edebilirim."
                subMessage="Aşağıdaki alana beklentilerini yazabilirsin veya önerilerden seçebilirsin."
                previousChoice={onboardingData.stepChoices?.step2 || {
                  label: "2. Adımda Seçilenler",
                  value: "-"
                }}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Öneriler */}
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion.text)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm transition-colors duration-200",
                  selectedSuggestion === suggestion.text
                    ? "bg-violet-100 text-violet-900 dark:bg-violet-900/50 dark:text-violet-100"
                    : "bg-gray-100 text-gray-700 hover:bg-violet-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-violet-900/30"
                )}
              >
                {suggestion.text}
              </button>
            ))}
          </div>

          {/* Textarea */}
          <div className="space-y-4">
            <textarea
              value={expectation}
              onChange={(e) => setExpectation(e.target.value)}
              placeholder="Beklentilerini buraya yazabilirsin..."
              className="w-full h-32 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400"
              aria-label="Beklentileriniz"
            />
          </div>
        </div>
      </div>
    </main>
  )
}

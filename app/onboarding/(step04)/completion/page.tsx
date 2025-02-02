"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LolaMessage } from "@/components/onboarding/lola-message"
import { useOnboarding } from "../../layout"
import { MessageSquare, Star, Target, Briefcase } from "lucide-react"
import { ChatInput } from "@/components/onboarding/chat-input"

interface Field {
  value: string
  label: string
}

type MentorshipType = 'career-development' | 'senior-career' | 'startup' | 'senior-startup'

interface OnboardingData {
  mentorshipType: MentorshipType
  fields?: (string | Field)[]
  goals?: string[]
  expectations?: string
}

export default function CompletionPage() {
  const router = useRouter()
  const { 
    setCurrentStep, 
    setTotalSteps, 
    setProgress,
    onboardingData 
  } = useOnboarding()

  // Get mentorship type details
  const getMentorshipTypeDetails = () => {
    const types: Record<MentorshipType, string> = {
      'career-development': 'Kariyer-Gelişim Mentorluğu',
      'senior-career': 'Usta Kariyer Mentorluğu',
      'startup': 'Girişim Mentorluğu',
      'senior-startup': 'Usta StartUP Mentorluğu'
    }
    return types[onboardingData.mentorshipType as MentorshipType] || 'Belirlenmedi'
  }

  // Get goals with prefixes
  const getGoals = () => {
    if (!onboardingData.goals || onboardingData.goals.length === 0) {
      return "Belirlenmedi"
    }

    // Mentorluk tipine göre prefix'i belirle
    let prefix = ""
    switch (onboardingData.mentorshipType) {
      case "career-development":
        prefix = "career_development_goal_"
        break
      case "senior-career":
        prefix = "senior_career_goal_"
        break
      case "startup":
        prefix = "startup_goal_"
        break
      case "senior-startup":
        prefix = "senior_startup_goal_"
        break
      default:
        return "Belirlenmedi"
    }

    return onboardingData.goals.map(goal => {
      // Eğer goal zaten prefix ile başlıyorsa, olduğu gibi bırak
      if (goal.startsWith(prefix)) {
        return goal
      }
      // Değilse prefix ekle
      return `${prefix}${goal}`
    }).join(", ")
  }

  // Get fields with prefixes
  const getFields = () => {
    if (!onboardingData.fields || onboardingData.fields.length === 0) {
      return "Belirlenmedi"
    }

    // Mentorluk tipine göre prefix'i belirle
    let prefix = ""
    switch (onboardingData.mentorshipType) {
      case "career-development":
        prefix = "career_development_field_"
        break
      case "senior-career":
        prefix = "senior_career_field_"
        break
      case "startup":
        prefix = "startup_field_"
        break
      case "senior-startup":
        prefix = "senior_startup_field_"
        break
      default:
        return "Belirlenmedi"
    }

    return onboardingData.fields.map(field => {
      // field'ın tipini kontrol et
      const fieldValue = typeof field === 'string' ? field : field.value

      // Eğer field zaten prefix ile başlıyorsa, olduğu gibi bırak
      if (fieldValue.startsWith(prefix)) {
        return fieldValue
      }
      // Değilse prefix ekle
      return `${prefix}${fieldValue}`
    }).join(", ")
  }

  // Get expectations with prefix
  const getExpectations = () => {
    if (!onboardingData.expectations) {
      return "Belirlenmedi"
    }

    const value = onboardingData.expectations
    // Eğer beklenti zaten prefix ile başlıyorsa, olduğu gibi bırak
    if (value.startsWith("user_expectations_")) {
      return value
    }
    // Değilse prefix ekle
    return `user_expectations_${value}`
  }

  // Generate chat-style prompt from collected data
  const generatedPrompt = `Merhaba Lola,\n\nMentorluk tercihlerimi aşağıdaki gibi belirledim:\n\n**Mentorluk Tipi:** ${getMentorshipTypeDetails()}\n**Hedeflerim:** ${getGoals()}\n**İlgi Alanlarım:** ${getFields()}\n**Beklentilerim:** ${getExpectations()}\n\nBu doğrultuda bana özel bir mentorluk planı oluşturmanı rica ediyorum.`;

  useEffect(() => {
    setCurrentStep("Tamamlandı")
    setTotalSteps("")
    setProgress(100)
  }, [setCurrentStep, setTotalSteps, setProgress])

  return (
    <main 
      className="relative p-4 sm:p-8"
      role="main"
      aria-label="Onboarding tamamlandı"
    >
     
        <div className="mb-8">
          <LolaMessage
            message="Harika! Her şey tamamlandı. Artık birlikte çalışmaya başlayabiliriz! 🎉"
            subMessage="Size özel olarak hazırladığım mentorluk planını görmek için sohbete başlayabilirsiniz."
          />
        </div>
    </main>
  )
}

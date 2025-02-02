"use client"

import { useRouter } from "next/navigation"
import { Rocket, Star, Lightbulb, Target, Check } from "lucide-react"
import { useState, useEffect } from "react"
import type { ReactElement } from "react"
import { cn } from '@/lib/utils'
import { useOnboarding } from '../../layout'
import { LolaMessage } from "@/components/onboarding/lola-message"

type MentorshipType = {
  id: string;
  title: string;
  description: string;
  icon: ReactElement;
  route: string;
  fullText: string;
}

type MentorshipTypes = {
  "career-development": MentorshipType;
  "senior-career": MentorshipType;
  "startup": MentorshipType;
  "senior-startup": MentorshipType;
}

const mentorshipTypes: MentorshipTypes = {
  "career-development": {
    id: "career-development",
    title: "Kariyer-Gelişim Mentoru",
    description: "Öğrenciler, yeni mezunlar ve iş hayatının ilk beş yılında olanlar için",
    icon: <Rocket className="w-3.5 h-3.5" />,
    route: "/onboarding/career-development",
    fullText: "Kariyer-Gelişim Mentoru: Öğrenciler, yeni mezunlar ve iş hayatının ilk beş yılında olanlar için"
  },
  "senior-career": {
    id: "senior-career",
    title: "Usta Kariyer Mentoru",
    description: "İş hayatında on yılı aşmış, kariyerinde ilerlemek, ya da bir kariyer değişikliği isteyenler için",
    icon: <Star className="w-3.5 h-3.5" />,
    route: "/onboarding/senior-career",
    fullText: "Usta Kariyer Mentoru: İş hayatında on yılı aşmış, kariyerinde ilerlemek, ya da bir kariyer değişikliği isteyenler için"
  },
  "startup": {
    id: "startup",
    title: "Girişim Mentoru",
    description: "Bir girişim yapmak isteyen, fikri olan bunu hayata geçirmek isteyen genç girişimciler için",
    icon: <Lightbulb className="w-3.5 h-3.5" />,
    route: "/onboarding/startup",
    fullText: "Girişim Mentoru: Bir girişim yapmak isteyen, fikri olan bunu hayata geçirmek isteyen genç girişimciler için"
  },
  "senior-startup": {
    id: "senior-startup",
    title: "Usta StartUP Mentoru",
    description: "Girişimini bir StartUP haline getirmiş, ürününü geliştirmek ve yatırım almak isteyenler için",
    icon: <Target className="w-3.5 h-3.5" />,
    route: "/onboarding/senior-startup",
    fullText: "Usta StartUP Mentoru: Girişimini bir StartUP haline getirmiş, ürününü geliştirmek ve yatırım almak isteyenler için"
  }
}

export default function MentorshipTypePage() {
  const router = useRouter()
  const { 
    setChatValue, 
    setIsNextEnabled, 
    setProgress, 
    setOnNext, 
    setCurrentStep, 
    setTotalSteps,
    setOnboardingData 
  } = useOnboarding()
  const [selectedType, setSelectedType] = useState<keyof MentorshipTypes | null>(null)

  useEffect(() => {
    setCurrentStep("Adım 1")
    setTotalSteps("/ 4")
    setProgress(25)
  }, [setCurrentStep, setTotalSteps, setProgress])

  const handleTypeSelect = (typeId: keyof MentorshipTypes) => {
    const type = mentorshipTypes[typeId]
    setSelectedType(typeId)
    setChatValue(type.fullText)
    setIsNextEnabled(true)
    setOnboardingData({ mentorshipType: typeId })
    setOnNext(() => () => router.push(type.route))
  }

  return (
    <div className="relative p-4">
    <div className="flex items-start gap-2 sm:gap-3">
      <div className="flex-1">
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-sm">
          <div className="space-y-6">
            <LolaMessage 
              message="Harika! Şimdi sana en uygun mentorluk deneyimini sunmak için bir kaç seçenek hazırladım."
              subMessage="Hangisi senin için daha uygun?"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {(Object.entries(mentorshipTypes) as [keyof MentorshipTypes, MentorshipType][]).map(([id, type]) => (
                <button
                  key={id}
                  onClick={() => handleTypeSelect(id)}
                  className={cn(
                    "relative flex items-start gap-2 p-3 rounded-xl text-left text-xs sm:text-sm transition-all duration-200",
                    "border-2 border-emerald-100 dark:border-emerald-900/10",
                    "shadow-sm shadow-emerald-100/30 dark:shadow-emerald-900/10",
                    "hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:shadow-lg hover:shadow-emerald-100/50 dark:hover:shadow-emerald-950/20",
                    selectedType === id 
                      ? "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-lg shadow-emerald-100/50 dark:shadow-emerald-950/20" 
                      : "hover:border-emerald-200 dark:hover:border-emerald-800/20"
                  )}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                        {type.icon}
                      </div>
                      <span className="font-medium">{type.title}</span>
                    </div>
                    <p className="text-muted-foreground">{type.description}</p>
                  </div>
                  {selectedType === id && (
                    <div className="absolute right-3 top-3">
                      <Check className="w-4 h-4 text-emerald-500" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

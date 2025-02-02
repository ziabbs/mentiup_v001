"use client"

import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Check, Lightbulb, CheckCircle, Rocket, Send, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { MultiSelect } from "@/components/ui/multi-select"
import { useOnboarding } from '@/hooks/use-onboarding'
import { QuestionsContainer } from "@/components/onboarding/questions-container"
import { StepMessage } from "@/components/onboarding/step-message"

interface Option {
  value: string
  label: string
  subcategories?: string[]
}

interface Stage {
  id: string
  title: string
  description: string
  icon: ReactNode
}

interface Goal {
  id: string
  title: string
  icon: string
  description: string
}

// Startup fields data
const startupFieldOptions: Option[] = [
  {
    value: "senior_startup_field_finance",
    label: "Finans",
    subcategories: ["Fintech", "Bankacılık", "Sigorta"]
  },
  {
    value: "senior_startup_field_technology",
    label: "Bilişim",
    subcategories: ["Yazılım", "Donanım", "Veri Analizi"]
  },
  {
    value: "senior_startup_field_marketing",
    label: "Pazarlama",
    subcategories: ["Dijital Pazarlama", "E-ticaret", "Marka Yönetimi"]
  },
  {
    value: "senior_startup_field_health",
    label: "Sağlık",
    subcategories: ["Sağlık Teknolojileri", "Biyoteknoloji", "Medikal Cihazlar"]
  },
  {
    value: "senior_startup_field_education",
    label: "Eğitim",
    subcategories: ["EdTech", "Online Eğitim", "Eğitim İçeriği"]
  }
]

// Startup stages
const stageOptions: Stage[] = [
  {
    id: "senior_startup_stage_idea",
    title: "Fikir Aşaması",
    description: "Henüz fikir aşamasındayım ve bu fikri nasıl hayata geçireceğimi öğrenmek istiyorum.",
    icon: <Lightbulb className="h-6 w-6" />
  },
  {
    id: "senior_startup_stage_validation",
    title: "Doğrulama Aşaması",
    description: "Fikrimi doğrulamak ve pazar araştırmaları yapmak istiyorum.",
    icon: <CheckCircle className="h-6 w-6" />
  },
  {
    id: "senior_startup_stage_mvp",
    title: "MVP Aşaması",
    description: "Minimum uygulanabilir ürün (MVP) geliştirme aşamasındayım.",
    icon: <Rocket className="h-6 w-6" />
  },
  {
    id: "senior_startup_stage_launch",
    title: "Lansman Aşaması",
    description: "Ürünümü piyasaya sürmek ve ilk müşterilerimi edinmek üzereyim.",
    icon: <Send className="h-6 w-6" />
  },
  {
    id: "senior_startup_stage_growth",
    title: "Büyüme Aşaması",
    description: "Ürünüm piyasada ve şimdi büyümeye odaklanmak istiyorum.",
    icon: <TrendingUp className="h-6 w-6" />
  },
  {
    id: "senior_startup_stage_other",
    title: "Diğer",
    description: "Farklı bir aşama",
    icon: <CheckCircle className="h-6 w-6" />
  }
]

// Mentorship goals
const goalOptions: Goal[] = [
  {
    id: "senior_startup_goal_self_discovery",
    title: "Kendini Tanıma ve Güçlü Yönler",
    icon: "🔍",
    description: "Kendimi tanımak, güçlü yönlerimi keşfetmek, kendime uygun bir alanda girişim yapabilmek için gerekli desteği alabilmek"
  },
  {
    id: "senior_startup_goal_business_model",
    title: "İş Modeli ve Pitch Deck",
    icon: "📊",
    description: "İş modeli kanvası oluşturma ve etkili sunum hazırlama"
  },
  {
    id: "senior_startup_goal_team_management",
    title: "Ekip Kurma ve Yönetimi",
    icon: "👥",
    description: "Ekip oluşturma, yönetim ve organizasyon yapılandırma"
  },
  {
    id: "senior_startup_goal_marketing",
    title: "Startup için Pazarlama Desteği",
    icon: "📢",
    description: "Pazarlama stratejisi ve büyüme taktikleri"
  },
  {
    id: "senior_startup_goal_investment",
    title: "Yatırımcı Sunumu ve Yatırım",
    icon: "💰",
    description: "Yatırımcı ilişkileri ve yatırım süreçleri yönetimi"
  },
  {
    id: "senior_startup_goal_other",
    title: "Diğer",
    icon: "✨",
    description: "Farklı bir mentorluk ihtiyacı"
  }
]

export default function SeniorStartupPage() {
  const router = useRouter()
  const { setCurrentStep, setChatValue, setIsNextEnabled, setOnNext } = useOnboarding()

  const [selectedFields, setSelectedFields] = useState<Option[]>([])
  const [selectedStage, setSelectedStage] = useState<string>("")
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])

  useEffect(() => {
    setCurrentStep("Adım 2")
  }, [setCurrentStep])

  useEffect(() => {
    // Seçim yapılmış mı kontrol et
    if (selectedFields.length > 0 && selectedStage && selectedGoals.length > 0) {
      setIsNextEnabled(true)
      setOnNext(() => () => router.push("/onboarding/expectation"))
    } else {
      setIsNextEnabled(false)
      setOnNext(undefined)
    }
  }, [selectedFields, selectedStage, selectedGoals, setIsNextEnabled, setOnNext, router])

  // Handle functions
  const handleFieldsSelect = (fields: Option[]) => {
    setSelectedFields(fields)
    if (fields.length > 0) {
      const fieldsText = fields.map(f => f.label).join(", ")
      setChatValue(fieldsText)
    }
  }

  const handleStageSelect = (stageId: string) => {
    setSelectedStage(stageId)
    const stage = stageOptions.find(s => s.id === stageId)
    if (stage) {
      setChatValue(stage.title)
    }
  }

  const handleGoalSelect = (goalId: string) => {
    const updatedGoals = selectedGoals.includes(goalId)
      ? selectedGoals.filter(id => id !== goalId)
      : selectedGoals.length < 3
      ? [...selectedGoals, goalId]
      : selectedGoals

    setSelectedGoals(updatedGoals)
    
    if (updatedGoals.length > 0) {
      const goals = updatedGoals.map(id => {
        const goal = goalOptions.find(g => g.id === id)
        return goal?.title || ""
      }).filter(Boolean)
      setChatValue(goals.join(", "))
    }
  }

  // Önceki seçimi formatla
  const formatPreviousChoice = (step: number): { label: string; value: string } | undefined => {
    if (step === 1 && selectedFields.length > 0) {
      return {
        label: "Seçilen alanlar",
        value: selectedFields.map(f => f.label).join(", ")
      }
    }
    if (step === 2 && selectedStage) {
      const stage = stageOptions.find(s => s.id === selectedStage)
      return stage ? {
        label: "Seçilen aşama",
        value: stage.title
      } : undefined
    }
    return undefined
  }

  // Lola'nın cevaplarını al
  const getLolaResponse = (step: number): string => {
    if (step === 1) {
      return "Harika! Şimdi girişiminizin hangi aşamada olduğunu öğrenmek istiyorum."
    }
    if (step === 2) {
      return "Son olarak, size nasıl yardımcı olabileceğimi öğrenmek istiyorum."
    }
    return ""
  }

  return (
    <main className="flex-1">
      <div className="container max-w-3xl mx-auto p-4 sm:p-6">
        <div className="relative space-y-6">
          {/* Soru 1: Startup Fields */}
          <QuestionsContainer>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold tracking-tight text-emerald-800 dark:text-emerald-200">
                  Girişiminiz Hangi Alanlarda Faaliyet Gösteriyor?
                </h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  En fazla 3 alan seçebilirsiniz
                </p>
              </div>

              <div className="relative z-[60]">
                <MultiSelect
                  id="senior-startup-fields-select"
                  options={startupFieldOptions}
                  selected={selectedFields}
                  onChange={handleFieldsSelect}
                  maxSelections={3}
                  aria-label="Girişim alanı seçin"
                  aria-required={true}
                  aria-describedby="fields-description"
                />
              </div>

              {selectedFields.length > 0 && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400 italic">
                  Seçiminizi yaptınız! Devam etmek için gönder butonunu kullanabilirsiniz.
                </p>
              )}
            </div>
          </QuestionsContainer>

          {/* Soru 2: Startup Stage */}
          <StepMessage
            message={getLolaResponse(1)}
            previousChoice={formatPreviousChoice(1)}
          />
          <QuestionsContainer>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold tracking-tight text-emerald-800 dark:text-emerald-200">
                  Girişiminiz Hangi Aşamada?
                </h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  Size en uygun aşamayı seçin
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {stageOptions.map((stage) => (
                  <button
                    key={stage.id}
                    onClick={() => handleStageSelect(stage.id)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border transition-all duration-200",
                      "hover:bg-emerald-50 dark:hover:bg-emerald-900/30",
                      "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-emerald-900",
                      selectedStage === stage.id
                        ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700"
                        : "border-transparent"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {stage.icon}
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-emerald-800 dark:text-emerald-200">
                          {stage.title}
                        </div>
                        <div className="text-sm text-emerald-600 dark:text-emerald-400">
                          {stage.description}
                        </div>
                      </div>
                    </div>
                    {selectedStage === stage.id && (
                      <Check className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                    )}
                  </button>
                ))}
              </div>

              {selectedStage && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400 italic">
                  Seçiminizi yaptınız! Devam etmek için gönder butonunu kullanabilirsiniz.
                </p>
              )}
            </div>
          </QuestionsContainer>

          {/* Soru 3: Mentorship Goals */}
          <StepMessage
            message={getLolaResponse(2)}
            previousChoice={formatPreviousChoice(2)}
          />
          <QuestionsContainer>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold tracking-tight text-emerald-800 dark:text-emerald-200">
                  Mentorluk Desteğini Hangi Konularda İstiyorsun?
                </h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  En fazla 3 konu seçebilirsiniz
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {goalOptions.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => handleGoalSelect(goal.id)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border transition-all duration-200",
                      "hover:bg-emerald-50 dark:hover:bg-emerald-900/30",
                      "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-emerald-900",
                      selectedGoals.includes(goal.id)
                        ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700"
                        : "border-transparent"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {goal.icon}
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-emerald-800 dark:text-emerald-200">
                          {goal.title}
                        </div>
                        <div className="text-sm text-emerald-600 dark:text-emerald-400">
                          {goal.description}
                        </div>
                      </div>
                    </div>
                    {selectedGoals.includes(goal.id) && (
                      <Check className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                    )}
                  </button>
                ))}
              </div>

              {selectedGoals.length > 0 && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400 italic">
                  Seçiminizi yaptınız! Devam etmek için gönder butonunu kullanabilirsiniz.
                </p>
              )}
            </div>
          </QuestionsContainer>
        </div>
      </div>
    </main>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { MultiSelect } from "@/components/ui/multi-select"
import { useOnboarding } from '@/hooks/use-onboarding'

interface Option {
  value: string
  label: string
  subcategories?: string[]
}

interface Stage {
  id: string
  title: string
  description: string
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
    value: "startup_field_finance",
    label: "Finans",
    subcategories: ["Fintech", "Bankacılık", "Sigorta"]
  },
  {
    value: "startup_field_technology",
    label: "Bilişim",
    subcategories: ["Yazılım", "Donanım", "Veri Analizi"]
  },
  {
    value: "startup_field_marketing",
    label: "Pazarlama",
    subcategories: ["Dijital Pazarlama", "E-ticaret", "Marka Yönetimi"]
  },
  {
    value: "startup_field_health",
    label: "Sağlık",
    subcategories: ["Sağlık Teknolojileri", "Biyoteknoloji", "Medikal Cihazlar"]
  },
  {
    value: "startup_field_education",
    label: "Eğitim",
    subcategories: ["EdTech", "Online Eğitim", "Eğitim İçeriği"]
  }
]

// Startup stages
const stageOptions: Stage[] = [
  {
    id: "startup_stage_idea",
    title: "Fikir Aşaması",
    description: "Henüz fikir aşamasında, konsept geliştirme sürecinde"
  },
  {
    id: "startup_stage_development",
    title: "Fikri Ürüne Dönüştürme",
    description: "MVP geliştirme ve ürün doğrulama süreci"
  },
  {
    id: "startup_stage_team",
    title: "Ekip Oluşturma",
    description: "Yazılımcı ve diğer ekip üyelerini bulma süreci"
  },
  {
    id: "startup_stage_mvp",
    title: "MVP Oluşturma",
    description: "Minimum uygulanabilir ürün geliştirme aşaması"
  },
  {
    id: "startup_stage_seed",
    title: "Tohum Yatırım",
    description: "İlk yatırım turuna hazırlık ve yatırım arama"
  },
  {
    id: "startup_stage_other",
    title: "Diğer",
    description: "Farklı bir aşama"
  }
]

// Mentorship goals
const goalOptions: Goal[] = [
  {
    id: "startup_goal_product_development",
    title: "İş ve Ürün Geliştirme Desteği",
    icon: "💡",
    description: "Ürün stratejisi ve geliştirme süreçleri için mentorluk"
  },
  {
    id: "startup_goal_business_model",
    title: "İş Modeli ve Pitch Deck",
    icon: "📊",
    description: "İş modeli kanvası oluşturma ve etkili sunum hazırlama"
  },
  {
    id: "startup_goal_team_management",
    title: "Ekip Kurma ve Yönetimi",
    icon: "👥",
    description: "Ekip oluşturma, yönetim ve organizasyon yapılandırma"
  },
  {
    id: "startup_goal_marketing",
    title: "Startup için Pazarlama Desteği",
    icon: "📢",
    description: "Pazarlama stratejisi ve büyüme taktikleri"
  },
  {
    id: "startup_goal_investment",
    title: "Yatırımcı Sunumu ve Yatırım",
    icon: "💰",
    description: "Yatırımcı ilişkileri ve yatırım süreçleri yönetimi"
  },
  {
    id: "startup_goal_other",
    title: "Diğer",
    icon: "✨",
    description: "Farklı bir mentorluk ihtiyacı"
  }
]

export default function StartupPage() {
  const router = useRouter()
  const { 
    setChatValue, 
    setIsNextEnabled, 
    setProgress, 
    setOnNext, 
    setCurrentStep, 
    setTotalSteps,
    setOnboardingData, 
    onboardingData 
  } = useOnboarding()

  const [selectedFields, setSelectedFields] = useState<Option[]>([])
  const [selectedStage, setSelectedStage] = useState<string | null>(null)
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [otherStageInput, setOtherStageInput] = useState("")
  const [otherGoalInput, setOtherGoalInput] = useState("")

  useEffect(() => {
    setCurrentStep("Adım 2")
    setTotalSteps("/ 4")
    setProgress(50)
  }, [setCurrentStep, setTotalSteps, setProgress])

  const chatMessage = useMemo(() => {
    let message = ""
    
    if (selectedFields.length > 0) {
      message += `Startup Alanı: ${selectedFields.map(f => f.label).join(", ")}`
    }

    if (selectedStage) {
      const stage = stageOptions.find(s => s.id === selectedStage)
      const stageText = stage?.id === "startup_stage_other" ? otherStageInput || "Diğer" : stage?.title
      message += `${message ? '\n' : ''}Aşama: ${stageText}`
    }

    if (selectedGoals.length > 0) {
      const goalsText = selectedGoals
        .map(id => {
          if (id === "startup_goal_other") {
            return otherGoalInput || "Diğer"
          }
          return goalOptions.find(g => g.id === id)?.title
        })
        .filter(Boolean)
        .join(", ")
      message += `${message ? '\n' : ''}Mentorluk Hedefleri: ${goalsText}`
    }

    return message
  }, [selectedFields, selectedStage, selectedGoals, otherStageInput, otherGoalInput])

  // Compute onboarding data
  const onboardingDataUpdate = useMemo(() => ({
    fields: selectedFields,
    goals: selectedGoals,
    ...(selectedStage ? { stage: selectedStage } : {}),
    stepChoices: {
      ...onboardingData.stepChoices,
      step2: {
        label: "2. Adımda Seçilenler",
        value: chatMessage
      }
    }
  }), [selectedFields, selectedGoals, selectedStage, chatMessage, onboardingData.stepChoices])

  // Update UI state and data
  useEffect(() => {
    const isComplete = selectedFields.length > 0 && selectedStage !== null && selectedGoals.length > 0
    setIsNextEnabled(isComplete)

    // Sadece değişiklik varsa güncelle
    if (selectedFields.length > 0 || selectedStage || selectedGoals.length > 0) {
      setOnboardingData(onboardingDataUpdate)
    }

    if (isComplete) {
      // Chat input'u güncelle
      setChatValue(chatMessage)
      
      // Sonraki adıma geç
      setOnNext(() => () => router.push("/onboarding/expectation"))
    } else {
      setOnNext(undefined)
    }
  }, [selectedFields, selectedStage, selectedGoals, chatMessage, onboardingDataUpdate, setIsNextEnabled, setOnboardingData, setChatValue, setOnNext, router])

  const handleFieldsChange = (fields: Option[]) => {
    setSelectedFields(fields)
  }

  const handleStageSelect = (stageId: string) => {
    if (stageId === "startup_stage_other") {
      setOtherStageInput("")
    }
    setSelectedStage(stageId)
  }

  const handleGoalSelect = (goalId: string) => {
    if (goalId === "startup_goal_other") {
      if (!selectedGoals.includes(goalId)) {
        setSelectedGoals([...selectedGoals, goalId])
      } else {
        setOtherGoalInput("")
        setSelectedGoals(selectedGoals.filter(id => id !== goalId))
      }
    } else {
      setSelectedGoals(
        selectedGoals.includes(goalId)
          ? selectedGoals.filter(id => id !== goalId)
          : selectedGoals.length < 3
          ? [...selectedGoals, goalId]
          : selectedGoals
      )
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="space-y-8">
          

            <div className="space-y-6">
              <div className="space-y-8">
                <div className="space-y-6">
                  {/* Startup Fields */}
                  <div 
                    className="space-y-4"
                    role="region"
                    aria-label="Startup Alanı Seçimi"
                  >
                    <div className="space-y-2">
                      <h3 className="text-base sm:text-lg font-semibold tracking-tight text-emerald-800 dark:text-emerald-200">
                        Startup&apos;ınızın Alanı
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Startup&apos;ınızı hayata geçirdiğiniz alan, iş, meslek alanı veya sektör
                      </p>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                        <span className="text-xs text-emerald-700 dark:text-emerald-300">
                          Birden fazla alan seçebilirsiniz
                        </span>
                      </div>
                    </div>
                    <MultiSelect
                      id="startup-fields-select"
                      options={startupFieldOptions}
                      selected={selectedFields}
                      onChange={handleFieldsChange}
                      placeholder="Alan seçin..."
                      maxSelections={3}
                      aria-label="Girişim alanı seçin"
                      aria-required={true}
                      aria-describedby="fields-description"
                    />
                    <p id="fields-description" className="sr-only">
                      En fazla 3 girişim alanı seçebilirsiniz
                    </p>
                  </div>

                  {/* Startup Stage */}
                  <div 
                    className="space-y-3"
                    role="region"
                    aria-label="Startup Aşaması"
                  >
                    <div className="space-y-2">
                      <h3 className="text-base sm:text-lg font-semibold tracking-tight text-emerald-800 dark:text-emerald-200">
                        Startup&apos;ınız Hangi Aşamada?
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Şu an bulunduğunuz aşamayı seçin
                      </p>
                    </div>
                    
                    <div 
                      role="radiogroup" 
                      aria-label="Girişim aşaması"
                      className="space-y-2"
                    >
                      {stageOptions.map((stage) => (
                        <button
                          key={stage.id}
                          onClick={() => handleStageSelect(stage.id)}
                          className={cn(
                            "w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200",
                            "hover:bg-emerald-50 dark:hover:bg-emerald-950/20",
                            "focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400",
                            selectedStage === stage.id
                              ? "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20"
                              : "border-emerald-100 dark:border-emerald-900/10"
                          )}
                          role="radio"
                          aria-checked={selectedStage === stage.id}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{stage.title}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {stage.description}
                              </p>
                              {stage.id === "startup_stage_other" && selectedStage === stage.id && (
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    value={otherStageInput}
                                    onChange={(e) => setOtherStageInput(e.target.value)}
                                    placeholder="Aşamayı buraya yazabilirsiniz..."
                                    className="w-full p-2 text-sm bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label="Diğer aşama açıklaması"
                                  />
                                </div>
                              )}
                            </div>
                            {selectedStage === stage.id && (
                              <Check className="w-5 h-5 text-emerald-500" aria-hidden="true" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mentorship Goals */}
                  <div 
                    className="space-y-3"
                    role="region"
                    aria-label="Mentorluk Hedefleri"
                  >
                    <div className="space-y-2">
                      <h3 className="text-base sm:text-lg font-semibold tracking-tight text-emerald-800 dark:text-emerald-200">
                        Ne Tür Bir Startup Mentorluğu Almak İstiyorsunuz?
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Mentorunuzdan nasıl bir destek beklersiniz?
                      </p>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                        <span className="text-xs text-emerald-700 dark:text-emerald-300">
                          En fazla 3 hedef seçebilirsiniz
                        </span>
                      </div>
                    </div>
                    
                    <div 
                      role="group" 
                      aria-label="Mentorluk hedefleri"
                      className="space-y-2"
                    >
                      {goalOptions.map((goal) => (
                        <button
                          key={goal.id}
                          onClick={() => handleGoalSelect(goal.id)}
                          className={cn(
                            "w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200",
                            "hover:bg-emerald-50 dark:hover:bg-emerald-950/20",
                            "focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400",
                            selectedGoals.includes(goal.id)
                              ? "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20"
                              : "border-emerald-100 dark:border-emerald-900/10"
                          )}
                          role="checkbox"
                          aria-checked={selectedGoals.includes(goal.id)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl" aria-hidden="true">{goal.icon}</span>
                            <div className="flex-1">
                              <h3 className="font-medium">{goal.title}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {goal.description}
                              </p>
                              {goal.id === "startup_goal_other" && selectedGoals.includes(goal.id) && (
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    value={otherGoalInput}
                                    onChange={(e) => setOtherGoalInput(e.target.value)}
                                    placeholder="Hedefini buraya yazabilirsin..."
                                    className="w-full p-2 text-sm bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault()
                                      }
                                    }}
                                    aria-label="Diğer hedef açıklaması"
                                  />
                                </div>
                              )}
                            </div>
                            {selectedGoals.includes(goal.id) && (
                              <Check className="w-5 h-5 text-emerald-500" aria-hidden="true" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
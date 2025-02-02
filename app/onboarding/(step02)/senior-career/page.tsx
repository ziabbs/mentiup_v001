"use client"

import { useEffect, useState, useMemo } from "react"
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

// Career fields data
const careerFieldOptions: Option[] = [
  {
    value: "senior_career_field_leadership",
    label: "Liderlik ve Yönetim"
  },
  {
    value: "senior_career_field_strategy",
    label: "Strateji ve İş Geliştirme"
  },
  {
    value: "senior_career_field_operations",
    label: "Operasyon Yönetimi"
  },
  {
    value: "senior_career_field_finance",
    label: "Finans ve Yatırım"
  },
  {
    value: "senior_career_field_sales",
    label: "Satış ve İş Geliştirme"
  },
  {
    value: "senior_career_field_marketing",
    label: "Pazarlama ve Marka Yönetimi"
  },
  {
    value: "senior_career_field_hr",
    label: "İnsan Kaynakları"
  },
  {
    value: "senior_career_field_product",
    label: "Ürün Yönetimi"
  },
  {
    value: "senior_career_field_technology",
    label: "Teknoloji ve Dijital Dönüşüm"
  }
]

// Industries data
const industryOptions: Option[] = [
  {
    value: "senior_career_industry_technology",
    label: "Teknoloji ve Yazılım"
  },
  {
    value: "senior_career_industry_finance",
    label: "Finans ve Bankacılık"
  },
  {
    value: "senior_career_industry_healthcare",
    label: "Sağlık ve Biyoteknoloji"
  },
  {
    value: "senior_career_industry_retail",
    label: "Perakende ve E-ticaret"
  },
  {
    value: "senior_career_industry_manufacturing",
    label: "Üretim ve Endüstri"
  },
  {
    value: "senior_career_industry_education",
    label: "Eğitim ve EdTech"
  },
  {
    value: "senior_career_industry_consulting",
    label: "Danışmanlık"
  },
  {
    value: "senior_career_industry_energy",
    label: "Enerji ve Sürdürülebilirlik"
  },
  {
    value: "senior_career_industry_media",
    label: "Medya ve İletişim"
  },
  {
    value: "senior_career_industry_fmcg",
    label: "Hızlı Tüketim"
  }
]

// Goal options data
const goalOptions = [
  {
    id: "senior_career_goal_leadership",
    title: "Liderlik ve Yönetim Becerileri",
    icon: "👥"
  },
  {
    id: "senior_career_goal_strategy",
    title: "Stratejik Düşünme ve Karar Verme",
    icon: "🎯"
  },
  {
    id: "senior_career_goal_change",
    title: "Değişim ve Dönüşüm Yönetimi",
    icon: "🔄"
  },
  {
    id: "senior_career_goal_innovation",
    title: "İnovasyon ve Dijital Dönüşüm",
    icon: "💡"
  },
  {
    id: "senior_career_goal_culture",
    title: "Kurum Kültürü ve Organizasyon",
    icon: "🏢"
  },
  {
    id: "senior_career_goal_crisis",
    title: "Kriz ve Risk Yönetimi",
    icon: "⚡"
  },
  {
    id: "senior_career_goal_stakeholder",
    title: "Paydaş İlişkileri Yönetimi",
    icon: "🤝"
  },
  {
    id: "senior_career_goal_other",
    title: "Diğer",
    icon: "✨"
  }
]

export default function SeniorCareerPage() {
  const router = useRouter()
  const { setChatValue, setIsNextEnabled, setProgress, setOnNext, setCurrentStep, setTotalSteps, setOnboardingData } = useOnboarding()

  const [state, setState] = useState({
    fields: [] as Option[],
    industries: [] as Option[],
    goals: [] as string[],
    otherGoal: "",
    isOtherGoalSelected: false
  })

  // Set initial step info
  useEffect(() => {
    setCurrentStep("Adım 2")
    setTotalSteps("/ 4")
    setProgress(50)
  }, [setCurrentStep, setTotalSteps, setProgress])

  // Compute derived state
  const { hasFields, hasGoals, isComplete } = useMemo(() => {
    const hasFields = state.fields.length > 0
    const hasGoals = state.goals.length > 0
    return {
      hasFields,
      hasGoals,
      isComplete: hasFields && hasGoals
    }
  }, [state.fields.length, state.goals.length])

  // Update chat message
  const chatMessage = useMemo(() => {
    const fieldsText = state.fields
      .map(field => field.label)
      .join(", ")
    
    const industriesText = state.industries
      .map(industry => industry.label)
      .join(", ")
    
    const goalsText = state.goals
      .map(id => {
        if (id === "senior_career_goal_other") {
          return state.otherGoal || "Diğer"
        }
        return goalOptions.find(g => g.id === id)?.title
      })
      .filter(Boolean)
      .join(", ")

    let message = ""
    if (fieldsText) message += `Kariyer Alanları: ${fieldsText}`
    if (industriesText) message += `${message ? '\n' : ''}Sektörler: ${industriesText}`
    if (goalsText) message += `${message ? '\n' : ''}Hedefler: ${goalsText}`
    
    return message
  }, [state])

  // Compute onboarding data
  const onboardingDataUpdate = useMemo(() => ({
    fields: state.fields.map(f => ({ value: f.value, label: f.label })),
    goals: state.goals,
    stepChoices: {
      step2: {
        label: "2. Adımda Seçilenler",
        value: chatMessage
      }
    }
  }), [state.fields, state.goals, chatMessage])

  // Update UI state and data
  useEffect(() => {
    setIsNextEnabled(isComplete)
    setChatValue(chatMessage)
    
    if (hasFields || hasGoals) {
      setOnboardingData(onboardingDataUpdate)
    }

    if (isComplete) {
      setOnNext(() => () => router.push("/onboarding/expectation"))
    } else {
      setOnNext(undefined)
    }
  }, [hasFields, hasGoals, isComplete, chatMessage, onboardingDataUpdate, setIsNextEnabled, setChatValue, setOnboardingData, setOnNext, router])

  const handleFieldSelect = (fields: Option[]) => {
    setState(prev => ({ ...prev, fields }))
  }

  const handleIndustrySelect = (industries: Option[]) => {
    setState(prev => ({ ...prev, industries }))
  }

  const handleGoalSelect = (goalId: string) => {
    setState(prev => {
      if (goalId === "senior_career_goal_other") {
        if (prev.isOtherGoalSelected) {
          return {
            ...prev,
            goals: prev.goals.filter(g => g !== "senior_career_goal_other"),
            isOtherGoalSelected: false,
            otherGoal: ""
          }
        } else if (prev.goals.length < 3) {
          return {
            ...prev,
            goals: [...prev.goals, "senior_career_goal_other"],
            isOtherGoalSelected: true
          }
        }
        return prev
      }

      if (prev.goals.includes(goalId)) {
        return {
          ...prev,
          goals: prev.goals.filter(g => g !== goalId)
        }
      }

      if (prev.goals.length < 3) {
        return {
          ...prev,
          goals: [...prev.goals, goalId]
        }
      }

      return prev
    })
  }

  const handleOtherGoalChange = (value: string) => {
    setState(prev => ({ ...prev, otherGoal: value }))
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-sm">
                <div className="space-y-6">
                

                  <div className="space-y-4">
                    <div>
                      <label 
                        htmlFor="fields-select"
                        className="block text-sm font-medium mb-2"
                      >
                        Kariyer Alanları
                      </label>
                      <MultiSelect
                        id="fields-select"
                        options={careerFieldOptions}
                        selected={state.fields}
                        onChange={handleFieldSelect}
                        maxSelections={3}
                        aria-label="Kariyer alanı seçin"
                        aria-required={true}
                        aria-describedby="fields-description"
                      />
                      <p id="fields-description" className="sr-only">
                        En fazla 3 kariyer alanı seçebilirsiniz
                      </p>
                    </div>

                    <div>
                      <label 
                        htmlFor="industries-select"
                        className="block text-sm font-medium mb-2"
                      >
                        Sektörler (Opsiyonel)
                      </label>
                      <MultiSelect
                        id="industries-select"
                        options={industryOptions}
                        selected={state.industries}
                        onChange={handleIndustrySelect}
                        maxSelections={3}
                        aria-label="Sektör seçin"
                        aria-required={false}
                        aria-describedby="industries-description"
                      />
                      <p id="industries-description" className="sr-only">
                        En fazla 3 sektör seçebilirsiniz
                      </p>
                    </div>

                    <div>
                      <label 
                        id="goals-label"
                        className="block text-sm font-medium mb-2"
                      >
                        Hedefler
                      </label>
                      <div 
                        role="group" 
                        aria-labelledby="goals-label"
                        className="grid grid-cols-1 gap-2"
                      >
                        {goalOptions.map((goal) => (
                          <button
                            key={goal.id}
                            onClick={() => handleGoalSelect(goal.id)}
                            className={cn(
                              "relative flex items-center gap-2 p-2 rounded-lg text-left text-xs sm:text-sm transition-all duration-200",
                              "border-2 border-emerald-100 dark:border-emerald-900/10",
                              "shadow-sm shadow-emerald-100/30 dark:shadow-emerald-900/10",
                              "hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:shadow-lg hover:shadow-emerald-100/50 dark:hover:shadow-emerald-950/20",
                              "focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400",
                              state.goals.includes(goal.id)
                                ? "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-lg shadow-emerald-100/50 dark:shadow-emerald-950/20"
                                : "hover:border-emerald-200 dark:hover:border-emerald-800/20"
                            )}
                            aria-pressed={state.goals.includes(goal.id)}
                            aria-label={`${goal.title} seçeneğini ${state.goals.includes(goal.id) ? 'kaldır' : 'seç'}`}
                          >
                            <span className="w-5 h-5 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                              {goal.icon}
                            </span>
                            <span>{goal.title}</span>
                            {state.goals.includes(goal.id) && (
                              <div className="absolute right-2" aria-hidden="true">
                                <Check className="w-4 h-4 text-emerald-500" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>

                      {state.isOtherGoalSelected && (
                        <div className="mt-2">
                          <input
                            type="text"
                            value={state.otherGoal}
                            onChange={(e) => handleOtherGoalChange(e.target.value)}
                            placeholder="Diğer hedefini buraya yazabilirsin..."
                            className="w-full p-2 rounded-lg border-2 border-emerald-100 dark:border-emerald-900/10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                            aria-label="Diğer hedef açıklaması"
                          />
                        </div>
                      )}
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

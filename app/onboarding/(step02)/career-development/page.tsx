"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useMemo } from "react"
import { cn } from '@/lib/utils'
import { useOnboarding } from '../../layout'
import { MultiSelect } from '@/components/ui/multi-select'
import { Check } from 'lucide-react'
import { LolaMessage } from "@/components/onboarding/lola-message"

interface Option {
  value: string
  label: string
  subcategories?: string[]
}

// Career fields data
const careerFieldOptions: Option[] = [
  {
    value: "career_development_field_marketing",
    label: "Pazarlama",
    subcategories: ["Satış", "Marka", "Dış Ticaret"]
  },
  {
    value: "career_development_field_finance",
    label: "Finans",
    subcategories: ["İşletme Finansı", "Mali İşler", "Muhasebe", "Denetim"]
  },
  {
    value: "career_development_field_finance_markets",
    label: "Finans ve Piyasalar",
    subcategories: ["Yatırım", "Sermaye Piyasaları", "Bankacılık", "Sigortacılık"]
  },
  {
    value: "career_development_field_production",
    label: "Üretim",
    subcategories: ["Kurulum", "İşletme", "Bakım", "Planlama", "Kalite Kontrol"]
  },
  {
    value: "career_development_field_rd_bd",
    label: "AR-GE, ÜR-GE ve İş Geliştirme"
  },
  {
    value: "career_development_field_logistics",
    label: "Lojistik",
    subcategories: ["Satınalma", "Tedarik", "Depo", "Servis", "Bakım"]
  },
  {
    value: "career_development_field_communication",
    label: "İletişim",
    subcategories: ["Tanıtım", "Halkla İlişkiler", "Sosyal Medya", "Reklam"]
  },
  {
    value: "career_development_field_it",
    label: "Bilişim",
    subcategories: ["Bilgi İşlem", "Bilgi Yönetimi"]
  },
  {
    value: "career_development_field_software",
    label: "Yazılım"
  },
  {
    value: "career_development_field_hr",
    label: "İnsan Kaynakları"
  },
  {
    value: "career_development_field_design",
    label: "Tasarım"
  },
  {
    value: "career_development_field_education",
    label: "Eğitim"
  },
  {
    value: "career_development_field_law",
    label: "Hukuk"
  }
]

// Industries data
const industryOptions: Option[] = [
  {
    value: "career_development_industry_energy",
    label: "Enerji",
    subcategories: ["Elektrik Üretimi", "Yenilenebilir Enerji", "Enerji Dağıtımı"]
  },
  {
    value: "career_development_industry_electronics",
    label: "Elektrik ve Elektronik",
    subcategories: ["Elektronik Cihazlar", "Endüstriyel Elektronik", "Güç Sistemleri"]
  },
  {
    value: "career_development_industry_telecom",
    label: "Telekomünikasyon",
    subcategories: ["Mobil İletişim", "Network Altyapısı", "Veri İletişimi"]
  },
  {
    value: "career_development_industry_metal_machinery",
    label: "Metal ve Makine",
    subcategories: ["Metal İşleme", "Makine İmalatı", "Madeni Eşya Üretimi"]
  },
  {
    value: "career_development_industry_home_appliances",
    label: "Beyaz ve Ev Eşyası",
    subcategories: ["Beyaz Eşya", "Küçük Ev Aletleri", "Ev Tekstili"]
  },
  {
    value: "career_development_industry_automotive",
    label: "Otomotiv",
    subcategories: ["Araç Üretimi", "Yedek Parça", "Otomotiv Elektroniği"]
  },
  {
    value: "career_development_industry_construction",
    label: "Yapı ve İnşaat",
    subcategories: ["Konut İnşaatı", "Altyapı Projeleri", "Mimari Tasarım"]
  },
  {
    value: "career_development_industry_environment",
    label: "Çevre",
    subcategories: ["Atık Yönetimi", "Geri Dönüşüm", "Çevre Danışmanlığı"]
  },
  {
    value: "career_development_industry_textile",
    label: "Tekstil ve Hazır Giyim",
    subcategories: ["Kumaş Üretimi", "Hazır Giyim", "Deri Ürünleri"]
  },
  {
    value: "career_development_industry_transportation",
    label: "Ulaşım",
    subcategories: ["Hava Taşımacılığı", "Kara Taşımacılığı", "Deniz Taşımacılığı"]
  },
  {
    value: "career_development_industry_chemistry",
    label: "Kimya",
    subcategories: ["Endüstriyel Kimya", "Kozmetik", "Boya ve Kaplama"]
  },
  {
    value: "career_development_industry_rubber_plastic",
    label: "Kauçuk ve Plastik",
    subcategories: ["Plastik Ürünler", "Kauçuk İmalatı", "Ambalaj"]
  },
  {
    value: "career_development_industry_pharmaceutical",
    label: "İlaç",
    subcategories: ["İlaç Üretimi", "Medikal Cihazlar", "Biyoteknoloji"]
  },
  {
    value: "career_development_industry_food_beverage",
    label: "Gıda ve İçecek",
    subcategories: ["Gıda İşleme", "İçecek Üretimi", "Tarımsal Ürünler"]
  },
  {
    value: "career_development_industry_fmcg",
    label: "Hızlı Tüketim",
    subcategories: ["Kişisel Bakım", "Ev Bakım", "Paketli Gıda"]
  },
  {
    value: "career_development_industry_retail",
    label: "Perakende ve Ticaret",
    subcategories: ["Mağazacılık", "E-ticaret", "Toptan Ticaret"]
  },
  {
    value: "career_development_industry_research",
    label: "Araştırma",
    subcategories: ["Pazar Araştırması", "Saha Araştırması", "Veri Analizi"]
  },
  {
    value: "career_development_industry_tourism",
    label: "Turizm ve Eğlence",
    subcategories: ["Otelcilik", "Seyahat", "Yeme-İçme"]
  },
  {
    value: "career_development_industry_agriculture",
    label: "Tarım ve Hayvancılık",
    subcategories: ["Tarımsal Üretim", "Hayvancılık", "Balıkçılık"]
  },
  {
    value: "career_development_industry_natural_resources",
    label: "Doğal Kaynaklar",
    subcategories: ["Madencilik", "Cam ve Seramik", "Su Kaynakları"]
  },
  {
    value: "career_development_industry_wood_products",
    label: "Ağaç ve Mobilya",
    subcategories: ["Mobilya Üretimi", "Kağıt Ürünleri", "Ahşap İşleme"]
  }
]

// Goals data
const goalOptions = [
  {
    id: "career_development_goal_discover_strengths",
    title: "Güçlü yönlerimi keşfetmek",
    icon: "💪"
  },
  {
    id: "career_development_goal_find_focus",
    title: "Bana uygun bir alan ve dar alan belirlemek",
    icon: "🎯"
  },
  {
    id: "career_development_goal_career_roadmap",
    title: "Hedef belirlemek ve bir kariyer yol haritası oluşturmak",
    icon: "🗺️"
  },
  {
    id: "career_development_goal_personal_branding",
    title: "Kendime uygun bir dar alanda markalaşmak",
    icon: "✨"
  },
  {
    id: "career_development_goal_maximize_income",
    title: "Yeteneklerime uygun bir alanda maksimum geliri elde edebilmek",
    icon: "💰"
  },
  {
    id: "career_development_goal_job_support",
    title: "İş bulabilmek için gerekli desteği almak (CV oluşturma, Mülakat vb.)",
    icon: "📝"
  },
  {
    id: "career_development_goal_other",
    title: "Diğer",
    icon: "➕"
  }
]

export default function CareerDevelopmentPage() {
  const router = useRouter()
  const { setChatValue, setIsNextEnabled, setProgress, setOnNext, setCurrentStep, setTotalSteps, setOnboardingData, onboardingData } = useOnboarding()

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
        if (id === "career_development_goal_other") {
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
      ...onboardingData.stepChoices,
      step2: {
        label: "2. Adımda Seçilenler",
        value: chatMessage
      }
    }
  }), [state.fields, state.goals, chatMessage, onboardingData.stepChoices])

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
  }, [isComplete, hasFields, hasGoals, chatMessage, onboardingDataUpdate, setIsNextEnabled, setChatValue, setOnboardingData, setOnNext, router])

  const handleFieldSelect = (fields: Option[]) => {
    setState(prev => ({ ...prev, fields }))
  }

  const handleIndustrySelect = (industries: Option[]) => {
    setState(prev => ({ ...prev, industries }))
  }

  const handleGoalSelect = (goalId: string) => {
    setState(prev => {
      if (goalId === "career_development_goal_other") {
        if (prev.isOtherGoalSelected) {
          return {
            ...prev,
            goals: prev.goals.filter(g => g !== "career_development_goal_other"),
            isOtherGoalSelected: false,
            otherGoal: ""
          }
        } else if (prev.goals.length < 3) {
          return {
            ...prev,
            goals: [...prev.goals, "career_development_goal_other"],
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
    <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium mb-2">
        Kariyer Alanları
      </label>
      <MultiSelect
        options={careerFieldOptions}
        selected={state.fields}
        onChange={handleFieldSelect}
        maxSelections={3}
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">
        Sektörler (Opsiyonel)
      </label>
      <MultiSelect
        options={industryOptions}
        selected={state.industries}
        onChange={handleIndustrySelect}
        maxSelections={3}
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">
        Hedefler
      </label>
      <div className="grid grid-cols-1 gap-2">
        {goalOptions.map((goal) => (
          <button
            key={goal.id}
            onClick={() => handleGoalSelect(goal.id)}
            className={cn(
              "relative flex items-center gap-2 p-2 rounded-lg text-left text-xs sm:text-sm transition-all duration-200",
              "border-2 border-emerald-100 dark:border-emerald-900/10",
              "shadow-sm shadow-emerald-100/30 dark:shadow-emerald-900/10",
              "hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:shadow-lg hover:shadow-emerald-100/50 dark:hover:shadow-emerald-950/20",
              state.goals.includes(goal.id)
                ? "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-lg shadow-emerald-100/50 dark:shadow-emerald-950/20"
                : "hover:border-emerald-200 dark:hover:border-emerald-800/20"
            )}
          >
            <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              {goal.icon}
            </span>
            <span>{goal.title}</span>
            {state.goals.includes(goal.id) && (
              <div className="absolute right-2">
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
            className="w-full p-2 rounded-lg border-2 border-emerald-100 dark:border-emerald-900/10 text-sm"
          />
        </div>
      )}
    </div>
  </div>
  )
}

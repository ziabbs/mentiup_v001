"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useMemo, useCallback } from "react"
import type { ReactNode } from "react"
import { cn } from '@/lib/utils'
import { useOnboarding } from '@/hooks/use-onboarding'
import { MultiSelect } from '@/components/ui/multi-select'
import { Check, Briefcase, Building2, Target } from 'lucide-react'
import { LolaMessage } from "@/components/onboarding/lola-message"
import { QuestionsContainer } from "@/components/onboarding/questions-container"
import { StepMessage } from "@/components/onboarding/step-message"
import { Button } from "@/components/ui/button"

interface Option {
  value: string
  label: string
  subcategories?: string[]
}

interface Goal {
  id: string
  title: string
  description: string
  icon: ReactNode
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

// Career goals data
const goalOptions: Goal[] = [
  {
    id: "career_development_goal_career_roadmap",
    title: "Hedef belirlemek ve bir kariyer yol haritası oluşturmak",
    description: "Kariyerinizde ilerlemek için net hedefler belirlemek ve bu hedeflere ulaşmak için bir yol haritası oluşturmak",
    icon: <Target className="h-6 w-6" />
  },
  {
    id: "career_development_goal_personal_branding",
    title: "Kendime uygun bir dar alanda markalaşmak",
    description: "Uzmanlık alanınızda güçlü bir kişisel marka oluşturmak ve tanınırlığınızı artırmak",
    icon: <Briefcase className="h-6 w-6" />
  },
  {
    id: "career_development_goal_maximize_income",
    title: "Yeteneklerime uygun bir alanda maksimum geliri elde edebilmek",
    description: "Becerilerinizi en iyi şekilde değerlendirerek potansiyel gelirinizi maksimize etmek",
    icon: <Building2 className="h-6 w-6" />
  },
  {
    id: "career_development_goal_job_support",
    title: "İş bulabilmek için gerekli desteği almak",
    description: "CV hazırlama, mülakat teknikleri ve iş arama stratejileri konusunda profesyonel destek almak",
    icon: <Target className="h-6 w-6" />
  },
  {
    id: "career_development_goal_other",
    title: "Diğer",
    description: "Yukarıdakilerden farklı bir hedef",
    icon: <Target className="h-6 w-6" />
  }
]

export default function CareerDevelopmentPage() {
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

  // State
  const [selectedFields, setSelectedFields] = useState<Option[]>([])
  const [selectedIndustries, setSelectedIndustries] = useState<Option[]>([])
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [currentQuestionStep, setCurrentQuestionStep] = useState(1)
  const [hasSelection, setHasSelection] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  // Compute onboarding data
  const onboardingDataUpdate = useMemo(() => ({
    fields: selectedFields.map(field => ({
      value: field.value,
      label: field.label
    })),
    goals: selectedGoals,
    stepChoices: {
      step2: {
        label: "Seçilen hedefler",
        value: selectedGoals
          .map(id => goalOptions.find(g => g.id === id)?.title)
          .filter(Boolean)
          .join(", ")
      }
    }
  }), [selectedFields, selectedGoals])

  // Handle functions
  const handleGoalsSubmit = useCallback(() => {
    setOnboardingData(onboardingDataUpdate)
    router.push("/onboarding/expectation")
  }, [onboardingDataUpdate, setOnboardingData, router])

  useEffect(() => {
    setCurrentStep("Adım 2")
    setTotalSteps("/ 4")
    setProgress(50)

    if (!onboardingData.mentorshipType) {
      router.push("/onboarding")
      return
    }

    // Tüm seçimler tamamlandıysa
    if (selectedFields.length > 0 && selectedIndustries.length > 0 && selectedGoals.length > 0) {
      setOnboardingData(onboardingDataUpdate)
      setOnNext(() => () => router.push("/onboarding/expectation"))
    }
  }, [
    setCurrentStep, 
    setTotalSteps, 
    setProgress, 
    onboardingData.mentorshipType,
    selectedFields,
    selectedIndustries,
    selectedGoals,
    onboardingDataUpdate,
    setOnboardingData,
    setOnNext,
    router
  ])

  // İlerleme durumunu takip et
  useEffect(() => {
    // Seçim yapılmış mı kontrol et
    if (!hasSelection) {
      setIsNextEnabled(false)
      setOnNext(undefined)
      return
    }

    // Hangi aşamada olduğumuzu kontrol et
    if (currentQuestionStep === 1 && selectedFields.length > 0) {
      const fieldsText = selectedFields.map(f => f.label).join(", ")
      setChatValue(fieldsText)
      setIsNextEnabled(true)
      setOnNext(() => handleFieldsSubmit)
    } 
    else if (currentQuestionStep === 2 && selectedIndustries.length > 0) {
      const industries = selectedIndustries.map(i => i.label).join(", ")
      setChatValue(industries)
      setIsNextEnabled(true)
      setOnNext(() => handleIndustriesSubmit)
    }
    else if (currentQuestionStep === 3 && selectedGoals.length > 0) {
      const goals = selectedGoals
        .map(id => goalOptions.find(g => g.id === id)?.title)
        .filter(Boolean)
        .join(", ")
      setChatValue(goals)
      setIsNextEnabled(true)
      setOnNext(() => handleGoalsSubmit)
    }
  }, [
    hasSelection,
    currentQuestionStep,
    selectedFields,
    selectedIndustries,
    selectedGoals,
    onboardingDataUpdate,
    handleGoalsSubmit,
    setChatValue,
    setIsNextEnabled,
    setOnNext
  ])

  const handleFieldsSelect = (fields: Option[]) => {
    setSelectedFields(fields)
    if (fields.length > 0) {
      const fieldsText = fields.map(f => f.label).join(", ")
      setChatValue(fieldsText)
      setIsNextEnabled(true)
      setOnNext(() => handleFieldsSubmit)
      setHasSelection(true)
    } else {
      setIsNextEnabled(false)
      setOnNext(undefined)
      setHasSelection(false)
    }
  }

  const handleIndustriesSelect = (industries: Option[]) => {
    setSelectedIndustries(industries)
    if (industries.length > 0) {
      const industriesText = industries.map(i => i.label).join(", ")
      setChatValue(industriesText)
      setIsNextEnabled(true)
      setOnNext(() => handleIndustriesSubmit)
      setHasSelection(true)
    } else {
      setIsNextEnabled(false)
      setOnNext(undefined)
      setHasSelection(false)
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
      const goalsText = updatedGoals
        .map(id => goalOptions.find(g => g.id === id)?.title)
        .filter(Boolean)
        .join(", ")
      setChatValue(goalsText)
      setIsNextEnabled(true)
      setOnNext(() => handleGoalsSubmit)
      setHasSelection(true)
    } else {
      setIsNextEnabled(false)
      setOnNext(undefined)
      setHasSelection(false)
    }
  }

  const handleFieldsSubmit = () => {
    setCurrentQuestionStep(2)
    setIsTyping(true)
    setTimeout(() => setIsTyping(false), 1000)
  }

  const handleIndustriesSubmit = () => {
    setCurrentQuestionStep(3)
    setIsTyping(true)
    setTimeout(() => setIsTyping(false), 1000)
  }

  // Önceki seçimi formatla
  const formatPreviousChoice = (step: number): { label: string; value: string } | undefined => {
    if (step === 1 && selectedFields.length > 0) {
      return {
        label: "Seçtiğin kariyer alanları",
        value: selectedFields.map(f => f.label).join(", ")
      }
    }
    if (step === 2 && selectedIndustries.length > 0) {
      return {
        label: "Seçtiğin sektörler",
        value: selectedIndustries.map(i => i.label).join(", ")
      }
    }
    if (step === 3 && selectedGoals.length > 0) {
      return {
        label: "Seçtiğin hedefler",
        value: selectedGoals
          .map(id => goalOptions.find(g => g.id === id)?.title)
          .filter(Boolean)
          .join(", ")
      }
    }
    return undefined
  }

  // Lola'nın tepkileri
  const getLolaResponse = (step: number): string => {
    if (step === 1 && selectedFields.length > 0) {
      return `${selectedFields.map(f => f.label).join(", ")} alanlarında deneyimli mentorlarımız var. Hangi sektörlerde çalışmak istiyorsun?`
    }
    if (step === 2 && selectedIndustries.length > 0) {
      return `${selectedIndustries.map(i => i.label).join(", ")} sektörlerinde kariyer hedefin ne olacak?`
    }
    return "Harika! Şimdi kariyer hedeflerini belirleyelim. Ne tür bir mentorluk desteği almak istersin?"
  }

  return (
    <div className="space-y-6">
      {/* Alan Seçimi */}
      {currentQuestionStep === 1 && !isTyping && (
        <>
          <StepMessage
            message="Öncelikle hangi alanlarda kariyer yapmak istediğini öğrenebilir miyim?"
            previousChoice={formatPreviousChoice(1)}
          />
          <QuestionsContainer>
            <MultiSelect
              options={careerFieldOptions}
              selected={selectedFields}
              onChange={handleFieldsSelect}
              placeholder="Kariyer alanı seçin..."
            />
          </QuestionsContainer>
        </>
      )}

      {/* Sektör Seçimi */}
      {currentQuestionStep === 2 && !isTyping && (
        <>
          <StepMessage
            message={getLolaResponse(1)}
            previousChoice={formatPreviousChoice(1)}
          />
          <QuestionsContainer>
            <MultiSelect
              options={industryOptions}
              selected={selectedIndustries}
              onChange={handleIndustriesSelect}
              placeholder="Sektör seçin..."
            />
          </QuestionsContainer>
        </>
      )}

      {/* Hedef Seçimi */}
      {currentQuestionStep === 3 && !isTyping && (
        <>
          <StepMessage
            message={getLolaResponse(2)}
            previousChoice={formatPreviousChoice(2)}
          />
          <QuestionsContainer>
            <div className="space-y-4">
              {goalOptions.map((goal) => (
                <Button
                  key={goal.id}
                  onClick={() => handleGoalSelect(goal.id)}
                  className={cn(
                    "relative w-full justify-start gap-2 pl-8 pr-12",
                    selectedGoals.includes(goal.id) && "bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                  )}
                  variant="outline"
                >
                  {goal.icon}
                  <div className="flex flex-col items-start gap-1">
                    <div className="font-medium">{goal.title}</div>
                    <div className="text-sm text-muted-foreground">{goal.description}</div>
                  </div>
                  {selectedGoals.includes(goal.id) && (
                    <Check className="absolute right-4 h-4 w-4" />
                  )}
                </Button>
              ))}
            </div>
          </QuestionsContainer>
        </>
      )}

      {isTyping && (
        <LolaMessage
          message="Düşünüyorum..."
        />
      )}
    </div>
  )
}

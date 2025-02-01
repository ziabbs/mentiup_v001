"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MentorshipTypeCard } from "@/components/onboarding/mentorship-type-card"
import { GraduationCap, Briefcase, Lightbulb, Building2 } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

const mentorshipTypes = [
  {
    id: "career-development",
    title: "Kariyer-Gelişim Mentoru",
    description: "Öğrenciler, yeni mezunlar ve iş hayatının ilk beş yılında olanlar için",
    icon: <GraduationCap className="h-6 w-6" />,
    route: "/onboarding/career-development"
  },
  {
    id: "senior-career",
    title: "Usta Kariyer Mentoru",
    description: "İş hayatında on yılı aşmış, kariyerinde ilerlemek, ya da bir kariyer değişikliği isteyenler için",
    icon: <Briefcase className="h-6 w-6" />,
    route: "/onboarding/senior-career"
  },
  {
    id: "startup",
    title: "Girişim Mentoru",
    description: "Bir girişim yapmak isteyen, fikri olan bunu hayata geçirmek isteyen genç girişimciler için",
    icon: <Lightbulb className="h-6 w-6" />,
    route: "/onboarding/startup"
  },
  {
    id: "senior-startup",
    title: "Usta StartUP Mentoru",
    description: "Girişimini bir StartUP haline getirmiş, ürününü geliştirmek ve yatırım almak isteyenler için",
    icon: <Building2 className="h-6 w-6" />,
    route: "/onboarding/senior-startup"
  }
]

export default function MentorshipTypePage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const handleContinue = () => {
    const selectedMentorship = mentorshipTypes.find(type => type.id === selectedType)
    if (selectedMentorship) {
      router.push(selectedMentorship.route)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-background/95">
      <div className="w-full max-w-4xl space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl font-bold tracking-tight">
            Lola ile yolculuğunuza başlayın!
          </h1>
          <p className="text-xl text-muted-foreground">
            Nasıl bir mentorluk almak istersiniz?
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2">
          {mentorshipTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MentorshipTypeCard
                title={type.title}
                description={type.description}
                icon={type.icon}
                isSelected={selectedType === type.id}
                onClick={() => setSelectedType(type.id)}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedType}
          >
            Devam Et
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

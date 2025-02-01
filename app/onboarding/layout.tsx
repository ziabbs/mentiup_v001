"use client"

import { usePathname } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

const steps = [
  "/onboarding/welcome",
  "/onboarding/auth",
  "/onboarding/mentorship-type",
  // Her mentorluk tipi için ayrı route'lar eklenecek
]

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const currentStep = steps.indexOf(pathname) + 1
  const progress = (currentStep / steps.length) * 100

  return (
    <div className="relative min-h-screen">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Progress value={progress} className="rounded-none" />
      </motion.div>

      {/* Content */}
      <main>{children}</main>
    </div>
  )
}

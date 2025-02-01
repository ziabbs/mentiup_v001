"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, ArrowRight, Waves } from "lucide-react"

export default function WelcomePage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Lola Avatar */}
        <div className="mx-auto w-24 h-24 relative">
          <Avatar className="w-full h-full">
            <AvatarFallback className="bg-primary/10">
              <Bot className="w-16 h-16 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 right-0 bg-primary rounded-full p-2">
            <Waves className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Welcome Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Hoş Geldin! 👋
          </h1>
          <p className="text-xl text-muted-foreground">
            MentiUp ailesine katıldığın için çok mutluyuz!
          </p>
          <p className="text-muted-foreground">
            Sana daha iyi bir deneyim sunabilmek için birkaç soruya daha ihtiyacımız var.
            Bu bilgiler sayesinde sana en uygun mentörlük deneyimini sunabileceğiz.
          </p>
        </div>

        {/* Action Button */}
        <Button
          className="w-full mt-8"
          size="lg"
          onClick={() => router.push("/onboarding/mentorship-type")}
        >
          Hadi Başlayalım
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

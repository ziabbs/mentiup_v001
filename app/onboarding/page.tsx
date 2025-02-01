"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AuthForm } from "@/components/auth/auth-form"
import { Icons } from "@/components/ui/icons"
import { Separator } from "@/components/ui/separator"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger 
} from "@/components/ui/sheet"

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', session.user.id)
          .single()

        if (profile?.onboarding_completed) {
          router.push("/")
        } else {
          router.push("/onboarding/mentorship-type")
        }
      }
    }

    checkSession()
  }, [router, supabase])

  const handleLinkedInAuth = async () => {
    // LinkedIn auth işlemleri buraya gelecek
    console.log("LinkedIn auth clicked")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-background/95">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 text-center"
        >
          {/* Logo ve Başlık */}
          <div className="space-y-2">
            <Image
              src="/dsdaddsad.png"
              alt="Lola"
              width={120}
              height={120}
              className="mx-auto"
              priority
            />
            <h1 className="text-3xl font-bold tracking-tight">MentiUp</h1>
            <p className="text-muted-foreground">
              Kariyerinizi şekillendirin, deneyimli mentorlarla buluşun
            </p>
          </div>

          {/* LinkedIn ile Giriş */}
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full"
            onClick={handleLinkedInAuth}
          >
            <Icons.linkedin className="mr-2 h-5 w-5" />
            LinkedIn ile devam et
          </Button>

          {/* Ayraç */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ya da e-posta ile devam et
              </span>
            </div>
          </div>

          {/* Giriş Formu */}
          <AuthForm
            mode="login"
            submitText="Giriş Yap"
            showTerms={false}
          />

          {/* Kayıt Ol Seçeneği */}
          <div className="text-sm text-muted-foreground">
            Henüz hesabınız yok mu?{" "}
            <Sheet open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
              <SheetTrigger asChild>
                <Button variant="link" className="px-2 font-semibold">
                  Hemen Kayıt Ol
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[84%] sm:w-[540px]">
                <div className="h-full flex flex-col">
                  <SheetHeader className="space-y-2">
                    <SheetTitle>Yeni Hesap Oluştur</SheetTitle>
                    <SheetDescription>
                      MentiUp&apos;a hoş geldiniz! Hemen ücretsiz hesabınızı oluşturun ve mentorlarla tanışmaya başlayın.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto py-6">
                    <AuthForm
                      mode="register"
                      submitText="Kayıt Ol"
                      showTerms={true}
                      onSuccess={() => setIsRegisterOpen(false)}
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <p>Let&apos;s get started with your profile setup</p>
        </motion.div>
      </div>
    </div>
  )
}

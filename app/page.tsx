"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function Home() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .single()

        if (!profile?.onboarding_completed) {
          router.push('/onboarding/mentorship-type')
        }
      }
    }

    checkSession()
  }, [router, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">MentiUp</h1>
        <p className="text-xl text-muted-foreground">
          Kariyer yolculuğunuzda size rehberlik ediyoruz
        </p>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { SecuritySheet } from "./security-sheet"
import { TermsSheet } from "./terms-sheet"

interface LoginFormProps {
  onForgotPassword: () => void
}

export function LoginForm({ onForgotPassword }: LoginFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      router.push("/onboarding/mentorship-type")
      router.refresh()
    } catch (error) {
      setError("Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="ornek@email.com"
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Giriş Yap
          </Button>

          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={onForgotPassword}
            disabled={isLoading}
          >
            Şifremi Unuttum
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center gap-4 text-sm">
          <TermsSheet />
          <SecuritySheet />
        </CardFooter>
      </form>
    </Card>
  )
}

"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) throw error
      setSuccess(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main 
      className="flex-1 flex flex-col justify-center"
      role="main"
      aria-labelledby="forgot-password-heading"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 
          id="forgot-password-heading"
          className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
        >
          Şifrenizi mi Unuttunuz?
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>
                Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.
                Lütfen e-postanızı kontrol edin.
              </AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="email">
              E-posta
              <span className="text-destructive"> *</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              required
              className="mt-1"
              aria-required="true"
              aria-invalid={error ? 'true' : 'false'}
            />
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              aria-label="Şifre sıfırlama bağlantısı gönder"
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              )}
              Şifre Sıfırlama Bağlantısı Gönder
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/auth/login')}
              className="w-full"
              aria-label="Giriş sayfasına dön"
            >
              Giriş Sayfasına Dön
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}

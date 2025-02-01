"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
        return
      }
      if (session.user?.email) {
        setEmail(session.user.email)
      } else {
        router.push('/auth/login')
        return
      }
      setIsLoading(false)
    }
    getSession()
  }, [router, supabase])

  async function resendEmail() {
    if (!email) return
    
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })
      if (error) throw error
      setError('Doğrulama e-postası yeniden gönderildi.')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" aria-hidden="true" />
        <span className="sr-only">Yükleniyor...</span>
      </div>
    )
  }

  return (
    <main 
      className="flex-1 flex flex-col justify-center px-6"
      role="main"
      aria-labelledby="verify-email-heading"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-6">
        <h1 
          id="verify-email-heading"
          className="text-2xl font-bold leading-9 tracking-tight text-gray-900"
        >
          E-posta Adresinizi Doğrulayın
        </h1>
        
        <p className="text-sm text-gray-600">
          {email} adresine bir doğrulama e-postası gönderdik.
          Lütfen e-postanızı kontrol edin ve doğrulama bağlantısına tıklayın.
        </p>

        {error && (
          <Alert variant={error.includes('yeniden gönderildi') ? 'default' : 'destructive'}>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <Button
            onClick={resendEmail}
            disabled={isLoading}
            className="w-full"
            aria-label="Doğrulama e-postasını yeniden gönder"
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            E-postayı Yeniden Gönder
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push('/auth/login')}
            className="w-full"
            aria-label="Giriş sayfasına dön"
          >
            Giriş Sayfasına Dön
          </Button>
        </div>
      </div>
    </main>
  )
}

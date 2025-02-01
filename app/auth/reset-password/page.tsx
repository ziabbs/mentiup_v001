"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (password !== confirmPassword) {
        throw new Error('Şifreler eşleşmiyor')
      }

      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      // Başarılı şifre değişikliği sonrası giriş sayfasına yönlendir
      router.push('/auth/login?message=password-updated')
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
      aria-labelledby="reset-password-heading"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 
          id="reset-password-heading"
          className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
        >
          Yeni Şifre Belirleyin
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Lütfen yeni şifrenizi girin.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="password">
              Yeni Şifre
              <span className="text-destructive"> *</span>
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-1"
              aria-required="true"
              aria-invalid={error ? 'true' : 'false'}
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">
              Yeni Şifre Tekrar
              <span className="text-destructive"> *</span>
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-1"
              aria-required="true"
              aria-invalid={error ? 'true' : 'false'}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            aria-label="Şifreyi güncelle"
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            Şifreyi Güncelle
          </Button>
        </form>
      </div>
    </main>
  )
}

"use client"

import { useProfile } from '@/contexts/profile-context'
import { ProfileForm } from '@/components/profile/profile-form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'
import { ProfileHeader } from '@/components/profile/profile-header'

export default function ProfileEditPage() {
  const { profile, isLoading, error } = useProfile()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" aria-hidden="true" />
        <span className="sr-only">Yükleniyor...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>
            Profil bulunamadı. Lütfen giriş yapın.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <main 
      className="min-h-screen bg-background pt-14"
      role="main"
      aria-labelledby="edit-profile-heading"
    >
      <ProfileHeader profile={profile} isOwnProfile={true} />
      
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 
              id="edit-profile-heading"
              className="text-2xl font-bold"
            >
              Profili Düzenle
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Profil bilgilerinizi güncelleyin.
            </p>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <ProfileForm />
          </div>
        </div>
      </div>
    </main>
  )
}

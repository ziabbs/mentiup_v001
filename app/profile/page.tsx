"use client"

import { useProfile } from '@/contexts/profile-context'
import { ProfileHeader } from '@/components/profile/profile-header'
import { ProfileStats } from '@/components/profile/profile-stats'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'
import { CareerCheckupCard } from '@/components/profile/career-checkup-card'
import { FieldTestCard } from '@/components/profile/field-test-card'

export default function ProfilePage() {
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
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      aria-label={`${profile.full_name || profile.username || 'Kullanıcı'} profili`}
    >
      <ProfileHeader profile={profile} isOwnProfile={true} />
      
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <CareerCheckupCard />
          <FieldTestCard />
        </div>
      </div>

      
    </main>
  )
}

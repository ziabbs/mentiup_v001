"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Profile, ProfileContextType, ProfileProviderProps, ProfileUpdate } from '@/types/profile'

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: ProfileProviderProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  async function fetchProfile() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        setProfile(null)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error) throw error

      setProfile(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Profil yüklenirken bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  async function updateProfile(update: ProfileUpdate) {
    try {
      setIsLoading(true)
      setError(null)

      const { error } = await supabase
        .from('profiles')
        .update(update)
        .eq('id', update.id)

      if (error) throw error

      // Profili yenile
      await fetchProfile()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Profil güncellenirken bir hata oluştu')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Auth durumu değiştiğinde profili yenile
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchProfile()
    })

    fetchProfile()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const value = {
    profile,
    isLoading,
    error,
    updateProfile,
    refreshProfile: fetchProfile,
  }

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}

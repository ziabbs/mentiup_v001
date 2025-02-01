"use client"

import { useCallback, useEffect, useState } from 'react'
import { useSupabase } from '@/contexts/supabase-context'
import type { Profile } from '@/types/profile'

interface UseProfileReturn {
  profile: Profile | null
  isLoading: boolean
  error: string | null
  updateProfile: (update: Partial<Profile>) => Promise<void>
}

export function useProfile(): UseProfileReturn {
  const { supabase, session, isLoading: isSessionLoading } = useSupabase()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Profil verilerini yükle
  useEffect(() => {
    async function loadProfile() {
      try {
        if (isSessionLoading) return
        
        if (!session?.user?.id) {
          setProfile(null)
          setIsLoading(false)
          return
        }

        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (fetchError) throw fetchError

        // Eğer settings null ise, varsayılan değerleri ayarla
        if (!data.settings) {
          data.settings = {
            theme: 'system',
            language: 'tr',
            notifications: {
              email: true,
              push: true,
              marketing: false
            }
          }
        }

        setProfile(data)
        setError(null)
      } catch (error) {
        console.error('Profil yüklenirken hata:', error)
        setError('Profil yüklenirken bir hata oluştu')
        setProfile(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [session, supabase, isSessionLoading])

  // Profil güncelleme
  const updateProfile = useCallback(async (update: Partial<Profile>) => {
    try {
      if (!session?.user?.id) {
        throw new Error('Oturum bulunamadı')
      }

      // Önce mevcut profili kontrol et
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (fetchError) throw fetchError

      // Mevcut settings ile yeni settings'i birleştir
      const updatedSettings = {
        ...existingProfile?.settings,
        ...update.settings
      }

      // Profili güncelle
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          ...existingProfile,
          ...update,
          settings: updatedSettings,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id)

      if (updateError) throw updateError

      // Güncel profili getir
      const { data: updatedProfile, error: refetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (refetchError) throw refetchError

      setProfile(updatedProfile)
      setError(null)
    } catch (error) {
      console.error('Profil güncellenirken hata:', error)
      throw new Error('Profil güncellenirken bir hata oluştu')
    }
  }, [session, supabase])

  return {
    profile,
    isLoading: isLoading || isSessionLoading,
    error,
    updateProfile,
  }
}

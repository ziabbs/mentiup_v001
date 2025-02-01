"use client"

import { useCallback, useEffect, useState } from 'react'
import { useSupabase } from '@/contexts/supabase-context'
import type { Database } from '@/types/supabase'

type UserPreferences = Database['public']['Tables']['user_preferences']['Row']
type UserPreferencesUpdate = Database['public']['Tables']['user_preferences']['Update']

interface UsePreferencesReturn {
  preferences: UserPreferences | null
  isLoading: boolean
  error: string | null
  updatePreferences: (update: UserPreferencesUpdate) => Promise<void>
}

export function usePreferences(): UsePreferencesReturn {
  const { supabase, session, isLoading: isSessionLoading } = useSupabase()
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Tercihleri yükle
  useEffect(() => {
    async function loadPreferences() {
      try {
        if (isSessionLoading) return
        
        if (!session?.user?.id) {
          setPreferences(null)
          setIsLoading(false)
          return
        }

        const { data, error: fetchError } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', session.user.id)
          .single()

        if (fetchError) {
          // Eğer tercihler bulunamazsa, varsayılan değerlerle oluştur
          if (fetchError.code === 'PGRST116') {
            const defaultPreferences = {
              user_id: session.user.id,
              language: 'tr',
              theme: 'system',
              email_notifications: {
                mentorship_requests: true,
                messages: true,
                career_updates: true,
                learning_reminders: true,
                newsletter: true
              },
              push_notifications: {
                mentorship_requests: true,
                messages: true,
                career_updates: true,
                learning_reminders: true
              },
              mentorship_preferences: {
                available_for_mentoring: false,
                seeking_mentor: false,
                preferred_meeting_times: [],
                preferred_communication_methods: ['video', 'chat']
              },
              learning_preferences: {
                preferred_learning_style: 'visual',
                preferred_content_types: ['video', 'interactive'],
                daily_learning_goal_minutes: 30
              }
            }

            const { data: newPrefs, error: insertError } = await supabase
              .from('user_preferences')
              .insert(defaultPreferences)
              .select()
              .single()

            if (insertError) throw insertError
            setPreferences(newPrefs)
            return
          }
          throw fetchError
        }

        setPreferences(data)
        setError(null)
      } catch (error) {
        console.error('Tercihler yüklenirken hata:', error)
        setError('Tercihler yüklenirken bir hata oluştu')
        setPreferences(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadPreferences()
  }, [session, supabase, isSessionLoading])

  // Tercihleri güncelle
  const updatePreferences = useCallback(async (update: UserPreferencesUpdate) => {
    try {
      if (!session?.user?.id) {
        throw new Error('Oturum bulunamadı')
      }

      // Mevcut tercihleri al
      const { data: currentPrefs, error: fetchError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (fetchError) throw fetchError

      // Mevcut tercihlerle yeni güncellemeyi birleştir
      const updatedPrefs = {
        ...currentPrefs,
        ...update,
        updated_at: new Date().toISOString(),
      }

      // Tercihleri güncelle
      const { error: updateError } = await supabase
        .from('user_preferences')
        .update(updatedPrefs)
        .eq('user_id', session.user.id)

      if (updateError) throw updateError

      setPreferences(updatedPrefs)
      setError(null)
    } catch (error) {
      console.error('Tercihler güncellenirken hata:', error)
      throw new Error('Tercihler güncellenirken bir hata oluştu')
    }
  }, [session, supabase])

  return {
    preferences,
    isLoading: isLoading || isSessionLoading,
    error,
    updatePreferences,
  }
}

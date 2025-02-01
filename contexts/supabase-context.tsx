"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

interface SupabaseContext {
  supabase: SupabaseClient<Database>
  session: any | null
  isLoading: boolean
}

const SupabaseContext = createContext<SupabaseContext>({
  supabase: createClientComponentClient<Database>(),
  session: null,
  isLoading: true,
})

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    async function getSession() {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        setSession(currentSession)
      } catch (error) {
        console.error('Oturum alınırken hata:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // İlk oturumu al
    getSession()

    // Oturum değişikliklerini dinle
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <SupabaseContext.Provider value={{ supabase, session, isLoading }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}

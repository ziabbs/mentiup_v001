import { createServerClient } from '@/lib/supabase/server-client'
import { NextResponse } from 'next/server'

// GET /api/profiles/mentorship - Get mentorship preferences
export async function GET(request: Request) {
  try {
    const supabase = createServerClient()
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get mentorship preferences and related career info
    const { data: preferences, error: preferencesError } = await supabase
      .from('user_preferences')
      .select(`
        mentorship_preferences,
        career_profiles!inner (
          current_title,
          experience_years,
          skills,
          mentoring_areas,
          learning_areas,
          certifications
        )
      `)
      .eq('user_id', session.user.id)
      .single()

    if (preferencesError) {
      return NextResponse.json(
        { error: 'Failed to fetch mentorship preferences' },
        { status: 500 }
      )
    }

    return NextResponse.json(preferences)
  } catch (error) {
    console.error('Mentorship preferences fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/profiles/mentorship - Update mentorship preferences
export async function PATCH(request: Request) {
  try {
    const supabase = createServerClient()
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      mentorship_preferences,
      mentoring_areas,
      learning_areas
    } = body

    // Start a transaction to update both preferences and career profile
    const { data, error } = await supabase.rpc('update_mentorship_settings', {
      user_id: session.user.id,
      mentorship_prefs: mentorship_preferences,
      mentoring_areas_data: mentoring_areas,
      learning_areas_data: learning_areas
    })

    if (error) {
      console.error('Mentorship settings update error:', error)
      return NextResponse.json(
        { error: 'Failed to update mentorship settings' },
        { status: 500 }
      )
    }

    // Get updated preferences
    const { data: updatedPreferences, error: fetchError } = await supabase
      .from('user_preferences')
      .select(`
        mentorship_preferences,
        career_profiles!inner (
          mentoring_areas,
          learning_areas
        )
      `)
      .eq('user_id', session.user.id)
      .single()

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch updated preferences' },
        { status: 500 }
      )
    }

    return NextResponse.json(updatedPreferences)
  } catch (error) {
    console.error('Mentorship preferences update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

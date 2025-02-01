import { createServerClient } from '@/lib/supabase/server-client'
import { NextResponse } from 'next/server'

// GET /api/profiles/preferences - Get user preferences
export async function GET() {
  try {
    const supabase = createServerClient()
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user preferences with all related settings
    const { data: preferences, error: preferencesError } = await supabase
      .from('user_preferences')
      .select(`
        *,
        career_profiles!inner (
          mentoring_areas,
          learning_areas
        )
      `)
      .eq('user_id', session.user.id)
      .single()

    if (preferencesError) {
      return NextResponse.json(
        { error: 'Failed to fetch user preferences' },
        { status: 500 }
      )
    }

    return NextResponse.json(preferences)
  } catch (error) {
    console.error('Preferences fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/profiles/preferences - Update user preferences
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
      language,
      theme,
      email_notifications,
      push_notifications,
      mentorship_preferences,
      learning_preferences
    } = body

    // Validate language
    const supportedLanguages = ['tr', 'en']
    if (language && !supportedLanguages.includes(language)) {
      return NextResponse.json(
        { error: 'Unsupported language' },
        { status: 400 }
      )
    }

    // Validate theme
    const supportedThemes = ['light', 'dark', 'system']
    if (theme && !supportedThemes.includes(theme)) {
      return NextResponse.json(
        { error: 'Unsupported theme' },
        { status: 400 }
      )
    }

    // Update preferences
    const { data: preferences, error: updateError } = await supabase
      .from('user_preferences')
      .update({
        language,
        theme,
        email_notifications,
        push_notifications,
        mentorship_preferences,
        learning_preferences,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Preferences update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update preferences' },
        { status: 500 }
      )
    }

    return NextResponse.json(preferences)
  } catch (error) {
    console.error('Preferences update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

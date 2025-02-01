import { createServerClient } from '@/lib/supabase/server-client'
import { NextResponse } from 'next/server'

// GET /api/profiles/privacy - Get user's privacy settings
export async function GET(request: Request) {
  try {
    const supabase = createServerClient()
    
    // Get current user's session
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get privacy settings
    const { data: privacy, error: privacyError } = await supabase
      .from('privacy_settings')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    if (privacyError) {
      return NextResponse.json(
        { error: 'Failed to fetch privacy settings' },
        { status: 500 }
      )
    }

    return NextResponse.json(privacy)
  } catch (error) {
    console.error('Privacy settings fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/profiles/privacy - Update privacy settings
export async function PATCH(request: Request) {
  try {
    const supabase = createServerClient()
    
    // Get current user's session
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      profile_visibility,
      show_email,
      show_social_links,
      show_learning_progress,
      show_mentorship_status,
      show_skills,
      show_certifications,
      searchable,
      allow_messages_from
    } = body

    // Validate profile visibility
    if (profile_visibility && !['public', 'private', 'connections'].includes(profile_visibility)) {
      return NextResponse.json(
        { error: 'Invalid profile visibility setting' },
        { status: 400 }
      )
    }

    // Validate message settings
    if (allow_messages_from && !['all', 'connections', 'none'].includes(allow_messages_from)) {
      return NextResponse.json(
        { error: 'Invalid message settings' },
        { status: 400 }
      )
    }

    // Update privacy settings
    const { data: privacy, error: updateError } = await supabase
      .from('privacy_settings')
      .update({
        profile_visibility,
        show_email,
        show_social_links,
        show_learning_progress,
        show_mentorship_status,
        show_skills,
        show_certifications,
        searchable,
        allow_messages_from,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Privacy settings update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update privacy settings' },
        { status: 500 }
      )
    }

    return NextResponse.json(privacy)
  } catch (error) {
    console.error('Privacy settings update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { createServerClient } from '@/lib/supabase/server-client'
import { NextResponse } from 'next/server'

// GET /api/profiles/:id - Get a user's profile
export async function GET(request: Request) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user profile with privacy settings
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        privacy_settings!inner (
          profile_visibility,
          show_email,
          show_social_links,
          show_learning_progress,
          show_mentorship_status,
          show_skills,
          show_certifications
        )
      `)
      .eq('id', userId)
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      )
    }

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Get current user's session
    const { data: { session } } = await supabase.auth.getSession()
    const isOwnProfile = session?.user?.id === userId

    // Apply privacy settings
    if (!isOwnProfile) {
      const privacy = profile.privacy_settings
      if (privacy.profile_visibility === 'private') {
        return NextResponse.json(
          { error: 'This profile is private' },
          { status: 403 }
        )
      }

      // Mask fields based on privacy settings
      if (!privacy.show_email) delete profile.email
      if (!privacy.show_social_links) {
        delete profile.linkedin_url
        delete profile.github_url
        delete profile.portfolio_url
      }
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/profiles - Update user profile
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
      username,
      full_name,
      avatar_url,
      bio,
      email
    } = body

    // Validate username format if provided
    if (username && !/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      return NextResponse.json(
        { error: 'Invalid username format. Use 3-30 characters, alphanumeric and underscore only.' },
        { status: 400 }
      )
    }

    // Check if username is already taken
    if (username) {
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .neq('id', session.user.id)
        .single()

      if (existingUser) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 }
        )
      }
    }

    // Update profile
    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update({
        username,
        full_name,
        avatar_url,
        bio,
        email,
        updated_at: new Date().toISOString()
      })
      .eq('id', session.user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Profile update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

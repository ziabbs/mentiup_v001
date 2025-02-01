import { createServerClient } from '@/lib/supabase/server-client'
import { NextResponse } from 'next/server'

// GET /api/profiles/notifications - Get notification settings
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

    // Get notification settings from user preferences
    const { data: preferences, error: preferencesError } = await supabase
      .from('user_preferences')
      .select('email_notifications, push_notifications')
      .eq('user_id', session.user.id)
      .single()

    if (preferencesError) {
      return NextResponse.json(
        { error: 'Failed to fetch notification settings' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      email: preferences.email_notifications,
      push: preferences.push_notifications
    })
  } catch (error) {
    console.error('Notification settings fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/profiles/notifications - Update notification settings
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
    const { email_notifications, push_notifications } = body

    // Validate notification settings
    const validNotificationTypes = [
      'messages',
      'mentions',
      'comments',
      'follows',
      'learning_updates',
      'mentorship_requests',
      'system_updates'
    ]

    // Validate email notifications
    if (email_notifications) {
      for (const type of Object.keys(email_notifications)) {
        if (!validNotificationTypes.includes(type)) {
          return NextResponse.json(
            { error: `Invalid email notification type: ${type}` },
            { status: 400 }
          )
        }
      }
    }

    // Validate push notifications
    if (push_notifications) {
      for (const type of Object.keys(push_notifications)) {
        if (!validNotificationTypes.includes(type)) {
          return NextResponse.json(
            { error: `Invalid push notification type: ${type}` },
            { status: 400 }
          )
        }
      }
    }

    // Update notification settings
    const { data: preferences, error: updateError } = await supabase
      .from('user_preferences')
      .update({
        email_notifications,
        push_notifications,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', session.user.id)
      .select('email_notifications, push_notifications')
      .single()

    if (updateError) {
      console.error('Notification settings update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update notification settings' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      email: preferences.email_notifications,
      push: preferences.push_notifications
    })
  } catch (error) {
    console.error('Notification settings update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          email?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          language: string
          theme: string
          email_notifications: {
            mentorship_requests: boolean
            messages: boolean
            career_updates: boolean
            learning_reminders: boolean
            newsletter: boolean
          }
          push_notifications: {
            mentorship_requests: boolean
            messages: boolean
            career_updates: boolean
            learning_reminders: boolean
          }
          mentorship_preferences: {
            available_for_mentoring: boolean
            seeking_mentor: boolean
            preferred_meeting_times: string[]
            preferred_communication_methods: string[]
          }
          learning_preferences: {
            preferred_learning_style: string
            preferred_content_types: string[]
            daily_learning_goal_minutes: number
          }
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          language?: string
          theme?: string
          email_notifications?: {
            mentorship_requests?: boolean
            messages?: boolean
            career_updates?: boolean
            learning_reminders?: boolean
            newsletter?: boolean
          }
          push_notifications?: {
            mentorship_requests?: boolean
            messages?: boolean
            career_updates?: boolean
            learning_reminders?: boolean
          }
          mentorship_preferences?: {
            available_for_mentoring?: boolean
            seeking_mentor?: boolean
            preferred_meeting_times?: string[]
            preferred_communication_methods?: string[]
          }
          learning_preferences?: {
            preferred_learning_style?: string
            preferred_content_types?: string[]
            daily_learning_goal_minutes?: number
          }
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          language?: string
          theme?: string
          email_notifications?: {
            mentorship_requests?: boolean
            messages?: boolean
            career_updates?: boolean
            learning_reminders?: boolean
            newsletter?: boolean
          }
          push_notifications?: {
            mentorship_requests?: boolean
            messages?: boolean
            career_updates?: boolean
            learning_reminders?: boolean
          }
          mentorship_preferences?: {
            available_for_mentoring?: boolean
            seeking_mentor?: boolean
            preferred_meeting_times?: string[]
            preferred_communication_methods?: string[]
          }
          learning_preferences?: {
            preferred_learning_style?: string
            preferred_content_types?: string[]
            daily_learning_goal_minutes?: number
          }
          created_at?: string
          updated_at?: string
        }
      }
      roles: {
        Row: {
          id: string
          name: string
          description: string | null
          permissions: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          permissions?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          permissions?: Json
          created_at?: string
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          refresh_token: string | null
          user_agent: string | null
          ip_address: string | null
          created_at: string
          expires_at: string
          last_activity_at: string
        }
        Insert: {
          id?: string
          user_id: string
          refresh_token?: string | null
          user_agent?: string | null
          ip_address?: string | null
          created_at?: string
          expires_at: string
          last_activity_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          refresh_token?: string | null
          user_agent?: string | null
          ip_address?: string | null
          created_at?: string
          expires_at?: string
          last_activity_at?: string
        }
      }
      security_logs: {
        Row: {
          id: string
          user_id: string | null
          event_type: string
          ip_address: string | null
          user_agent: string | null
          details: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          event_type: string
          ip_address?: string | null
          user_agent?: string | null
          details?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          event_type?: string
          ip_address?: string | null
          user_agent?: string | null
          details?: Json
          created_at?: string
        }
      }
      career_profiles: {
        Row: {
          id: string
          user_id: string
          current_title: string | null
          experience_years: number | null
          education_level: string | null
          skills: Json | null
          interests: Json | null
          certifications: Json | null
          mentoring_areas: Json | null
          learning_areas: Json | null
          bio: string | null
          linkedin_url: string | null
          github_url: string | null
          portfolio_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          current_title?: string | null
          experience_years?: number | null
          education_level?: string | null
          skills?: Json | null
          interests?: Json | null
          certifications?: Json | null
          mentoring_areas?: Json | null
          learning_areas?: Json | null
          bio?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          portfolio_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_title?: string | null
          experience_years?: number | null
          education_level?: string | null
          skills?: Json | null
          interests?: Json | null
          certifications?: Json | null
          mentoring_areas?: Json | null
          learning_areas?: Json | null
          bio?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          portfolio_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      privacy_settings: {
        Row: {
          id: string
          user_id: string
          profile_visibility: string
          show_email: boolean
          show_social_links: boolean
          show_learning_progress: boolean
          show_mentorship_status: boolean
          show_skills: boolean
          show_certifications: boolean
          searchable: boolean
          allow_messages_from: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          profile_visibility?: string
          show_email?: boolean
          show_social_links?: boolean
          show_learning_progress?: boolean
          show_mentorship_status?: boolean
          show_skills?: boolean
          show_certifications?: boolean
          searchable?: boolean
          allow_messages_from?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          profile_visibility?: string
          show_email?: boolean
          show_social_links?: boolean
          show_learning_progress?: boolean
          show_mentorship_status?: boolean
          show_skills?: boolean
          show_certifications?: boolean
          searchable?: boolean
          allow_messages_from?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

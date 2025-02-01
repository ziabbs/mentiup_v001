export interface Profile {
  id: string
  username: string
  full_name: string
  avatar_url?: string
  bio?: string
  email: string
  settings?: {
    theme?: string
    language?: string
    notifications?: {
      email: boolean
      push: boolean
      marketing: boolean
    }
  }
  created_at?: string
  updated_at?: string
}

export type ProfileUpdate = Partial<Profile>

export interface ProfileContextType {
  profile: Profile | null
  isLoading: boolean
  error: string | null
  updateProfile: (update: ProfileUpdate) => Promise<void>
  refreshProfile: () => Promise<void>
}

export interface ProfileProviderProps {
  children: React.ReactNode
}

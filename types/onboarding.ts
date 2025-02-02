import { Database } from './supabase';

// Veritabanı tablolarından türetilen tipler
type Tables = Database['public']['Tables'];
type MentorshipType = Tables['onboarding_mentorship_types']['Row'];
type OptionCategory = Tables['onboarding_option_categories']['Row'];
type Option = Tables['onboarding_options']['Row'];
type UserSelection = Tables['onboarding_user_selections']['Row'];
type UserExpectation = Tables['onboarding_user_expectations']['Row'];

// Frontend'de kullanılacak tipler
export interface OnboardingMentorshipType {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export interface OnboardingOption {
  id: string;
  value: string;
  name: string;
  description?: string;
  icon?: string;
  subcategories?: string[];
}

export interface OnboardingCategory {
  id: string;
  slug: string;
  categoryType: string;
  name: string;
  description?: string;
  isRequired: boolean;
  allowMultiple: boolean;
  options: OnboardingOption[];
}

// Ana onboarding veri yapısı
export interface OnboardingData {
  mentorshipType: {
    id: string;
    label: string;
  };
  fields?: {
    [key: string]: string[];
  };
  industries?: {
    [key: string]: string[];
  };
  goals?: {
    [key: string]: string[];
  };
  expectations?: string;
}

// Form state için helper tipler
export type OnboardingFormData = {
  [K in keyof Omit<OnboardingData, 'mentorshipType'>]: OnboardingData[K];
};

export type OnboardingStep = {
  id: string;
  title: string;
  description?: string;
  isRequired: boolean;
  allowMultiple: boolean;
  options: OnboardingOption[];
};

// API response tipleri
export interface OnboardingResponse {
  success: boolean;
  data?: OnboardingData;
  error?: string;
}

// Validation için helper tipler
export type ValidationErrors = {
  [K in keyof OnboardingData]?: string;
};

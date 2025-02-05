import * as React from 'react';

export type IconType = 'rocket' | 'star' | 'lightbulb' | 'target'

export type MentorshipType = 'career-development' | 'senior-career' | 'startup' | 'senior-startup'

export interface Option {
  id: string
  title: string
  description?: string
  icon?: string | React.ReactNode
  type?: 'default' | 'custom'
}

export interface Message {
  id: string
  type: 'user' | 'lola'
  content: string
  subContent?: string
  options?: Option[]
  selectedOption?: string
  timestamp: number
}

export interface OnboardingState {
  mentorshipType?: MentorshipType
  // Career Development
  careerFields?: string[]
  careerIndustries?: string[]
  careerGoals?: string[]
  // Senior Career
  seniorCareerFields?: string[]
  seniorCareerIndustries?: string[]
  seniorCareerGoals?: string[]
  // Startup
  startupFields?: string[]
  startupStages?: string[]
  startupGoals?: string[]
  // Senior Startup
  seniorStartupFields?: string[]
  seniorStartupStages?: string[]
  seniorStartupGoals?: string[]
  // Final Steps
  expectation?: string
  // Legacy fields - to be removed
  seniorGoals?: string[]
  seniorFields?: string[]
  expectations?: string
  stepChoices?: {
    [key: string]: {
      label: string
      value: string
    }
  }
  industries?: { value: string; label: string }[]
  fields?: { value: string; label: string }[]
}

export interface FlowStep {
  id: string
  message: string
  subMessage?: string
  options?: Option[]
  nextStep?: (optionId: string) => keyof FlowSteps | undefined
}

export type StepId = 
  | 'mentorship-type'
  // Career Development Flow
  | 'career-development_fields'
  | 'career-development_industries'
  | 'career-development_goals'
  // Senior Career Flow
  | 'senior-career_fields'
  | 'senior-career_industries'
  | 'senior-career_goals'
  // Startup Flow
  | 'startup_fields'
  | 'startup_stages'
  | 'startup_goals'
  // Senior Startup Flow
  | 'senior-startup_fields'
  | 'senior-startup_stages'
  | 'senior-startup_goals'
  // Final Steps
  | 'expectation'
  | 'completion'

export type FlowSteps = {
  [K in StepId]: FlowStep
}

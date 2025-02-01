"use client"

import { ProfileLayout } from "@/components/layout/profile-layout"

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ProfileLayout>{children}</ProfileLayout>
}

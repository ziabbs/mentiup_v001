"use client"

import { useEffect } from "react"
import { useProfile } from '@/contexts/profile-context'
import { usePreferences } from "@/hooks/use-preferences"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/ui/icons"
import { ProfileHeader } from '@/components/profile/profile-header'
import { useState } from "react"
import type { Database } from "@/types/supabase"

export default function SettingsPage() {
  const { profile } = useProfile()
  const { preferences, isLoading, updatePreferences } = usePreferences()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async () => {
    try {
      setIsSaving(true)
      
      // Sadece değiştirilen alanları güncelle
      const updates: Database['public']['Tables']['user_preferences']['Update'] = {
        theme: formData.theme,
        language: formData.language,
      }

      // Email bildirimlerini güncelle
      if (preferences?.email_notifications) {
        updates.email_notifications = {
          mentorship_requests: preferences.email_notifications.mentorship_requests,
          messages: formData.notifications.email,
          career_updates: preferences.email_notifications.career_updates,
          learning_reminders: preferences.email_notifications.learning_reminders,
          newsletter: preferences.email_notifications.newsletter,
        }
      }

      // Push bildirimlerini güncelle
      if (preferences?.push_notifications) {
        updates.push_notifications = {
          mentorship_requests: preferences.push_notifications.mentorship_requests,
          messages: formData.notifications.push,
          career_updates: preferences.push_notifications.career_updates,
          learning_reminders: preferences.push_notifications.learning_reminders,
        }
      }

      await updatePreferences(updates)
      
      toast({
        title: "Başarılı",
        description: "Ayarlarınız güncellendi.",
      })
    } catch (error) {
      console.error('Ayarlar güncellenirken hata:', error)
      toast({
        title: "Hata",
        description: "Ayarlarınız güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Form verilerini state'te tut
  const [formData, setFormData] = useState({
    theme: preferences?.theme || 'system',
    language: preferences?.language || 'tr',
    notifications: {
      email: preferences?.email_notifications?.messages ?? true,
      push: preferences?.push_notifications?.messages ?? true,
    },
  })

  // Form verilerini güncelle
  useEffect(() => {
    if (preferences) {
      setFormData({
        theme: preferences.theme,
        language: preferences.language,
        notifications: {
          email: preferences.email_notifications?.messages ?? true,
          push: preferences.push_notifications?.messages ?? true,
        },
      })
    }
  }, [preferences])

  if (isLoading || !profile) {
    return (
      <div className="container max-w-2xl py-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main 
      className="min-h-screen bg-background pt-14"
      role="main"
      aria-labelledby="settings-heading"
    >
      <ProfileHeader profile={profile} isOwnProfile={true} />

      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle id="settings-heading">Ayarlar</CardTitle>
            <CardDescription>
              Tercihlerinizi ve bildirim ayarlarınızı yönetin.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tema Ayarları */}
            <div className="space-y-4">
              <div>
                <Label>Tema</Label>
                <RadioGroup
                  value={formData.theme}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, theme: value }))}
                  className="grid grid-cols-3 gap-4 mt-2"
                >
                  <Label
                    htmlFor="theme-system"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem value="system" id="theme-system" className="sr-only" />
                    <span>Sistem</span>
                  </Label>
                  <Label
                    htmlFor="theme-light"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem value="light" id="theme-light" className="sr-only" />
                    <span>Açık</span>
                  </Label>
                  <Label
                    htmlFor="theme-dark"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
                    <span>Koyu</span>
                  </Label>
                </RadioGroup>
              </div>
            </div>

            {/* Dil Ayarları */}
            <div className="space-y-4">
              <div>
                <Label>Dil</Label>
                <RadioGroup
                  value={formData.language}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                  className="grid grid-cols-2 gap-4 mt-2"
                >
                  <Label
                    htmlFor="lang-tr"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem value="tr" id="lang-tr" className="sr-only" />
                    <span>Türkçe</span>
                  </Label>
                  <Label
                    htmlFor="lang-en"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem value="en" id="lang-en" className="sr-only" />
                    <span>English</span>
                  </Label>
                </RadioGroup>
              </div>
            </div>

            {/* Bildirim Ayarları */}
            <div className="space-y-4">
              <Label>Bildirimler</Label>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Bildirimleri</Label>
                    <p className="text-sm text-muted-foreground">
                      Yeni mesajlar için email bildirimleri alın
                    </p>
                  </div>
                  <Switch
                    checked={formData.notifications.email}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          email: checked
                        }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Bildirimleri</Label>
                    <p className="text-sm text-muted-foreground">
                      Yeni mesajlar için anlık bildirimler alın
                    </p>
                  </div>
                  <Switch
                    checked={formData.notifications.push}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          push: checked
                        }
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSubmit} 
              disabled={isSaving}
              className="ml-auto"
            >
              {isSaving ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Kaydediliyor
                </>
              ) : (
                'Kaydet'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}

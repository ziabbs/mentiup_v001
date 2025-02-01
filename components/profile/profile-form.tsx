"use client"

import { useState } from 'react'
import { useProfile } from '@/contexts/profile-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'
import { AvatarUpload } from '@/components/profile/avatar-upload'
import type { ProfileUpdate } from '@/types/profile'

export function ProfileForm() {
  const { profile, updateProfile, isLoading, error } = useProfile()
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    avatar_url: profile?.avatar_url || '',
  })

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSuccess(false)

    try {
      if (!profile?.id) throw new Error('Profil bulunamadı')

      const update: ProfileUpdate = {
        id: profile.id,
        ...formData
      }

      await updateProfile(update)
      setSuccess(true)
    } catch (error) {
      console.error('Profil güncellenirken hata:', error)
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function handleAvatarUpload(url: string) {
    setFormData(prev => ({ ...prev, avatar_url: url }))
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>
            Profiliniz başarıyla güncellendi
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex justify-center">
          <AvatarUpload 
            onUploadComplete={handleAvatarUpload}
            className="w-full max-w-sm"
          />
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="username">
              Kullanıcı Adı
              <span className="text-destructive"> *</span>
            </Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          <div>
            <Label htmlFor="full_name">
              Ad Soyad
              <span className="text-destructive"> *</span>
            </Label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          <div>
            <Label htmlFor="bio">Hakkımda</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Kendinizden bahsedin..."
              className="h-32"
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading && (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        Profili Güncelle
      </Button>
    </form>
  )
}

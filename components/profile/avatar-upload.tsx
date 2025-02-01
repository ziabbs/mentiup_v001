"use client"

import { useCallback, useState } from 'react'
import { useProfile } from '@/contexts/profile-context'
import { useSupabase } from '@/contexts/supabase-context'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import Image from 'next/image'

interface AvatarUploadProps {
  onUploadComplete?: (url: string) => void
  className?: string
}

export function AvatarUpload({ onUploadComplete, className }: AvatarUploadProps) {
  const { profile } = useProfile()
  const { supabase } = useSupabase()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(profile?.avatar_url || null)

  const uploadAvatar = useCallback(async (file: File) => {
    try {
      setError(null)
      setIsUploading(true)

      // Dosya kontrolü
      if (!file.type.startsWith('image/')) {
        throw new Error('Lütfen bir resim dosyası seçin')
      }

      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Dosya boyutu 2MB\'dan küçük olmalı')
      }

      // Benzersiz dosya adı oluştur
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`

      // Eski avatarı sil
      if (profile?.avatar_url) {
        const oldAvatarPath = profile.avatar_url.split('/').pop()
        if (oldAvatarPath) {
          await supabase.storage
            .from('avatars')
            .remove([oldAvatarPath])
            .catch(console.error) // Silme hatası kritik değil
        }
      }

      // Yeni avatarı yükle
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      // Public URL oluştur
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Preview'i güncelle
      setPreviewUrl(publicUrl)
      
      // Parent'a bildir
      onUploadComplete?.(publicUrl)
    } catch (error) {
      console.error('Avatar yükleme hatası:', error)
      setError(error instanceof Error ? error.message : 'Avatar yüklenirken bir hata oluştu')
    } finally {
      setIsUploading(false)
    }
  }, [profile, supabase, onUploadComplete])

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await uploadAvatar(file)
    }
  }, [uploadAvatar])

  return (
    <div className={className}>
      <div className="flex flex-col items-center gap-4">
        {/* Preview */}
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Avatar"
              fill
              className="object-cover"
              sizes="128px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icons.user className="h-16 w-16 text-muted-foreground" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex flex-col items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="relative"
            disabled={isUploading}
          >
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept="image/*"
              disabled={isUploading}
              aria-label="Profil fotoğrafı seç"
            />
            {isUploading ? (
              <Icons.spinner className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Icons.camera className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="ml-2">
              {isUploading ? 'Yükleniyor...' : 'Fotoğraf Seç'}
            </span>
          </Button>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          
          <p className="text-xs text-muted-foreground">
            PNG, JPG veya GIF • Max 2MB
          </p>
        </div>
      </div>
    </div>
  )
}

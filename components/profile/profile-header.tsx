"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter, usePathname } from 'next/navigation'
import type { Profile } from '@/types/profile'
import { Camera, Edit, Settings, ArrowLeft, Menu, MessageCircle } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { VisuallyHidden } from '@/components/ui/visually-hidden'

const navigation = [
  { name: "Profil", href: "/profile" },
  { name: "Ayarlar", href: "/profile/settings" },
  { name: "Güvenlik", href: "/profile/security" },
  { name: "Bildirimler", href: "/profile/notifications" },
]

interface ProfileHeaderProps {
  profile: Profile
  isOwnProfile: boolean
}

export function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const showBackButton = pathname !== "/profile"

  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="h-14 flex items-center justify-between gap-4">
          {/* Sol Taraf - Geri Butonu, Menu ve Avatar */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2">
              {showBackButton ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  className="h-8 w-8 -ml-2"
                  aria-label="Geri git"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <VisuallyHidden>Geri git</VisuallyHidden>
                </Button>
              ) : (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 -ml-2 md:hidden"
                      aria-label="Menüyü aç"
                    >
                      <Menu className="h-4 w-4" />
                      <VisuallyHidden>Menüyü aç</VisuallyHidden>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] p-0">
                    <SheetHeader className="p-4 border-b">
                      <SheetTitle>Menü</SheetTitle>
                      <SheetDescription>
                        Profil sayfaları arasında gezinin
                      </SheetDescription>
                    </SheetHeader>
                    <nav className="grid px-2 py-2">
                      {navigation.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex w-full items-center rounded-md px-2 py-2 text-sm font-medium",
                            pathname === item.href 
                              ? "bg-primary/10 text-primary" 
                              : "text-muted-foreground hover:bg-accent hover:text-foreground"
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </nav>
                  </SheetContent>
                </Sheet>
              )}
            </div>

            <div className="relative shrink-0">
              <div className="relative h-8 w-8 sm:h-12 sm:w-12 rounded-full ring-2 ring-border overflow-hidden bg-muted">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={`${profile.full_name || profile.username || 'Kullanıcı'} profil fotoğrafı`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 32px, 48px"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    <span className="text-sm font-medium">
                      {(profile.full_name?.[0] || profile.username?.[0] || '?').toUpperCase()}
                    </span>
                  </div>
                )}
                {isOwnProfile && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-0 bottom-0 h-4 w-4 sm:h-5 sm:w-5 hidden sm:flex"
                    aria-label="Profil fotoğrafını değiştir"
                  >
                    <Camera className="h-2 w-2 sm:h-3 sm:w-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* İsim ve Bio - Desktop */}
            <div className="flex flex-col min-w-0 hidden sm:block">
              <h1 
                className="text-base font-semibold text-foreground truncate"
                aria-label={`${profile.full_name || profile.username || 'Kullanıcı'} profili`}
              >
                {profile.full_name || profile.username || 'İsimsiz Kullanıcı'}
              </h1>
              {profile.bio && (
                <p 
                  className="text-sm text-muted-foreground truncate"
                  aria-label="Kullanıcı biyografisi"
                >
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          {/* Orta - Mobil İsim ve Desktop Menu */}
          <div className="flex-1 min-w-0 flex items-center justify-between">
            {/* Mobil İsim */}
            <div className="sm:hidden">
              <h1 
                className="text-sm font-semibold text-foreground truncate"
                aria-label={`${profile.full_name || profile.username || 'Kullanıcı'} profili`}
              >
                {profile.full_name || profile.username || 'İsimsiz Kullanıcı'}
              </h1>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-1 ml-8">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Sağ Taraf - Eylem Butonları */}
          {isOwnProfile && (
            <div className="flex items-center gap-2">
              {/* Mobil Butonlar */}
              <div className="flex sm:hidden items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => router.push('/chat')}
                  aria-label="Mesajlar"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => router.push('/profile/edit')}
                  aria-label="Profili düzenle"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => router.push('/profile/settings')}
                  aria-label="Profil ayarları"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>

              {/* Desktop Butonlar */}
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2"
                  onClick={() => router.push('/chat')}
                  aria-label="Mesajlar"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Mesajlar</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2"
                  onClick={() => router.push('/profile/edit')}
                  aria-label="Profili düzenle"
                >
                  <Edit className="h-4 w-4" />
                  <span>Düzenle</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2"
                  onClick={() => router.push('/profile/settings')}
                  aria-label="Profil ayarları"
                >
                  <Settings className="h-4 w-4" />
                  <span>Ayarlar</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

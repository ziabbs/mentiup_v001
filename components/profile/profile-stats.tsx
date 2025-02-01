"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Profile } from '@/types/profile'

interface ProfileStatsProps {
  profile: Profile
}

export function ProfileStats({ profile }: ProfileStatsProps) {
  const stats = [
    {
      name: 'Mentorluk Seansları',
      value: '0',
      label: 'Toplam mentorluk seansı sayısı',
    },
    {
      name: 'Değerlendirmeler',
      value: '0',
      label: 'Toplam değerlendirme sayısı',
    },
    {
      name: 'Başarı Puanı',
      value: '0',
      label: 'Kullanıcının başarı puanı',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:gap-8">
      {stats.map((stat) => (
        <Card key={stat.name}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground" aria-label={stat.label}>
              {stat.label}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

"use client"

import * as React from 'react'
import { Card } from '@/components/ui/card'

export function ProfileStats() {
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
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">
              {stat.name}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground" aria-label={stat.label}>
              {stat.label}
            </p>
          </div>
        </Card>
      ))}
    </div>
  )
}

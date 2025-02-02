"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function MeetingHeader() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  
  return (
    <div className="border-b bg-white " role="banner" aria-label="Video konferans başlığı">
      <div className="relative p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-emerald-950/50 overflow-hidden">
                <Image
                  src="/dsdaddsad.png"
                  alt="Lola Avatar"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-950 ${mounted ? "bg-gray-400" : "bg-gray-400"}`}></div>
            </div>
            
            <div className="flex flex-col">
              <h2 className="text-sm lg:text-2xl font-bold tracking-tight flex flex-col items-start gap-1"
                  aria-label="MentiUp'ın Ana Sloganı">
                <span className="bg-gradient-to-r from-emerald-700 via-emerald-500 to-emerald-800 dark:from-emerald-300 dark:via-emerald-400 dark:to-emerald-200 bg-clip-text text-transparent animate-gradient">
                  <span className="hidden sm:inline">Öğrenme Yolculuğunda </span>
                  <span className="text-emerald-500 dark:text-emerald-300 animate-pulse">Lola</span>
                  <span className="hidden sm:inline"> ile Yeni Bir Sayfa Aç!</span>
                </span>
              </h2>
            </div>
          </div>
          
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${mounted ? "bg-gray-100 dark:bg-gray-800" : "bg-gray-100 dark:bg-gray-800"} text-gray-600 dark:text-gray-400`}>
            <div className={`h-2 w-2 rounded-full ${mounted ? "bg-gray-400" : "bg-gray-400"}`}
                 role="status" aria-label="Çevrimdışı gösterge" />
            <span className="text-xs font-medium">Hazırlanıyor</span>
          </div>
        </div>
      </div>
    </div>
  )
}

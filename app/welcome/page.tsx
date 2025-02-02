"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LolaMessage } from "@/components/onboarding/lola-message"
import Image from "next/image"
import { BadgeCheck, ArrowRight, Users, Target, Sparkles, Zap, BookOpen, LineChart, Shield } from "lucide-react"

export default function WelcomePage() {
  const router = useRouter()

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative isolate overflow-hidden">
              {/* Background Gradients */}
              <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
                <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emerald-200 to-emerald-400 opacity-20 dark:from-emerald-700 dark:to-emerald-900 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
              </div>

              {/* Content */}
              <div className="relative px-8 py-12 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-5xl">
                  <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    {/* Left Content */}
                    <div className="flex-1 text-center lg:text-left space-y-6">
                      {/* Badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
                        <Sparkles className="w-4 h-4" />
                        AI Powered Mentorluk
                      </div>

                      {/* Title */}
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                        <span className="inline-block bg-gradient-to-r from-emerald-600 to-emerald-400 dark:from-emerald-300 dark:to-emerald-500 bg-clip-text text-transparent">
                          Kariyerinde
                        </span>
                        <br />
                        <span className="text-gray-900 dark:text-white">
                          Yeni Bir Sayfa
                        </span>
                      </h1>

                      {/* Description */}
                      <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0">
                        Yapay zeka asistanı Lola ile kişiselleştirilmiş kariyer mentorluğu deneyimi seni bekliyor.
                      </p>

                      
                    </div>

                    {/* Right Content - Logo */}
                    <div className="relative hidden lg:block w-72 h-72">
                      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100 to-transparent dark:from-emerald-900/20 rounded-full blur-2xl" />
                      <div className="relative w-full h-full">
                        <Image
                          src="/MentiUp-Logo.png"
                          alt="MentiUp"
                          fill
                          className="object-contain drop-shadow-xl"
                          priority
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Gradient */}
              <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
                <div className="relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emerald-200 to-emerald-400 opacity-20 dark:from-emerald-700 dark:to-emerald-900 sm:left-[calc(50%+15rem)] sm:w-[72.1875rem]" />
              </div>
            </div>

            {/* Features Section */}
            <div className="space-y-6 max-w-3xl mx-auto">
              <h2 className="text-lg font-medium text-center text-emerald-900 dark:text-emerald-100">
                Neden MentiUp?
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="text-center space-y-2 group">
                  <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                    <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-medium">AI Asistan</h3>
                  <p className="text-sm text-emerald-700/70 dark:text-emerald-300/70">7/24 Kesintisiz Destek</p>
                </div>

                <div className="text-center space-y-2 group">
                  <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                    <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-medium">Özel Program</h3>
                  <p className="text-sm text-emerald-700/70 dark:text-emerald-300/70">Hedefine Özel Yol Haritası</p>
                </div>

                <div className="text-center space-y-2 group">
                  <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-medium">Hızlı İlerleme</h3>
                  <p className="text-sm text-emerald-700/70 dark:text-emerald-300/70">Anında Geri Bildirim</p>
                </div>

                <div className="text-center space-y-2 group">
                  <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-medium">Zengin İçerik</h3>
                  <p className="text-sm text-emerald-700/70 dark:text-emerald-300/70">Güncel Kaynak ve Öneriler</p>
                </div>

                <div className="text-center space-y-2 group">
                  <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                    <LineChart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-medium">Gelişim Takibi</h3>
                  <p className="text-sm text-emerald-700/70 dark:text-emerald-300/70">Ölçülebilir İlerleme</p>
                </div>

                <div className="text-center space-y-2 group">
                  <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-medium">Güvenli Ortam</h3>
                  <p className="text-sm text-emerald-700/70 dark:text-emerald-300/70">%100 Gizlilik Garantisi</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="flex items-center justify-center">
              <Button
                onClick={() => router.push("/onboarding/mentorship-type")}
                className="relative px-6 py-3 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white rounded-lg shadow-sm hover:shadow transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">Hemen Başla</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

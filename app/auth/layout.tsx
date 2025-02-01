import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Authentication - MentiUp',
  description: 'Authentication pages for MentiUp platform',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Auth form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Image
            src="/MentiUp-Logo.png"
            alt="MentiUp Logo"
            width={160}
            height={60}
            className="mx-auto"
            priority
          />
        </div>
        {children}
      </div>

      {/* Right side - Image and text */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30">
        <div className="max-w-2xl px-8">
          <Image
            src="/auth-illustration.png"
            alt="Authentication illustration"
            width={800}
            height={600}
            className="rounded-2xl shadow-xl"
            priority
          />
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Mentorluk Yolculuğuna Hoş Geldiniz
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              MentiUp ile kariyer gelişiminizi hızlandırın, deneyimli mentorlarla bağlantı kurun
              ve sürekli öğrenme yolculuğunuzda rehberlik alın.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Metadata } from 'next'
import { AuthForm } from '@/components/auth/auth-form'

export const metadata: Metadata = {
  title: 'Kayıt Ol - MentiUp',
  description: 'MentiUp platformuna üye olun',
}

export default function RegisterPage() {
  return (
    <main 
      className="flex-1 flex flex-col justify-center"
      role="main"
      aria-labelledby="register-heading"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 
          id="register-heading"
          className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
        >
          Yeni Hesap Oluşturun
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Zaten hesabınız var mı?{' '}
          <a
            href="/auth/login"
            className="font-medium text-primary hover:text-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            tabIndex={0}
          >
            Giriş yapın
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <AuthForm
          mode="register"
          submitText="Kayıt Ol"
          showTerms={true}
        />
      </div>
    </main>
  )
}

import { Metadata } from 'next'
import { AuthForm } from '@/components/auth/auth-form'

export const metadata: Metadata = {
  title: 'Giriş Yap - MentiUp',
  description: 'MentiUp platformuna giriş yapın',
}

export default function LoginPage() {
  return (
    <main 
      className="flex-1 flex flex-col justify-center"
      role="main"
      aria-labelledby="login-heading"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 
          id="login-heading"
          className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
        >
          Hesabınıza Giriş Yapın
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Hesabınız yok mu?{' '}
          <a
            href="/auth/register"
            className="font-medium text-primary hover:text-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            tabIndex={0}
          >
            Ücretsiz hesap oluşturun
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <AuthForm
          mode="login"
          submitText="Giriş Yap"
          showRememberMe={true}
          showForgotPassword={true}
        />
      </div>
    </main>
  )
}

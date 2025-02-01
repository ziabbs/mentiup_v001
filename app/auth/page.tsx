"use client"

import { useState } from "react"
import { AuthForm } from "@/components/auth/auth-form"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-background/95">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">MentiUp</h1>
          <p className="text-muted-foreground mt-2">
            Kariyer yolculuğunuza başlayın
          </p>
        </div>

        <Tabs
          defaultValue="login"
          className="w-full"
          onValueChange={(value) => setMode(value as 'login' | 'register')}
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Giriş Yap</TabsTrigger>
            <TabsTrigger value="register">Kayıt Ol</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="login" className="mt-0">
                <AuthForm
                  mode="login"
                  submitText="Giriş Yap"
                  showRememberMe={true}
                  showForgotPassword={true}
                />
              </TabsContent>

              <TabsContent value="register" className="mt-0">
                <AuthForm
                  mode="register"
                  submitText="Kayıt Ol"
                  showTerms={true}
                />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  )
}

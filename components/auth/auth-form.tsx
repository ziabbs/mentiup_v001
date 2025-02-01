"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/ui/icons"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { PolicyTabs } from "./policy-tabs"

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  mode: "login" | "register"
  submitText: string
  showTerms?: boolean
  onSuccess?: () => void
}

const formSchema = z.object({
  email: z.string().email({
    message: "Geçerli bir e-posta adresi giriniz.",
  }),
  password: z.string(),
  confirmPassword: z.string().optional(),
  terms: z.boolean().optional().refine(val => !val || val === true, {
    message: "Kullanım koşullarını kabul etmelisiniz.",
  }),
})

export function AuthForm({
  mode,
  submitText,
  showTerms = false,
  onSuccess,
  className,
  ...props
}: AuthFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)
  const [isPolicyOpen, setIsPolicyOpen] = React.useState(false)
  const supabase = createClientComponentClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        })

        if (error) throw error

      } else {
        if (values.password !== values.confirmPassword) {
          throw new Error('Şifreler eşleşmiyor')
        }

        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            emailRedirectTo: `${location.origin}/auth/callback`,
          },
        })

        if (error) throw error
      }

      // Başarılı işlem
      if (onSuccess) {
        onSuccess()
      }
      
      // Welcome sayfasına yönlendir
      router.push('/welcome')
      router.refresh()
    } catch (err) {
      console.error('Auth error:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else if (typeof err === 'object' && err && 'message' in err) {
        setError(err.message as string)
      } else {
        setError('Bir hata oluştu. Lütfen tekrar deneyin.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-posta</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ornek@email.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Şifre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="********"
                    type="password"
                    autoCapitalize="none"
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {mode === "register" && (
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şifre Tekrar</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      type="password"
                      autoCapitalize="none"
                      autoComplete="new-password"
                      autoCorrect="off"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {mode === "register" && showTerms && (
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      <span>
                        <Sheet open={isPolicyOpen} onOpenChange={setIsPolicyOpen}>
                          <SheetTrigger asChild>
                            <Button 
                              variant="link" 
                              className="h-auto p-0 text-primary font-semibold"
                              type="button"
                            >
                              Kullanım koşullarını
                            </Button>
                          </SheetTrigger>
                          <SheetContent side="right" className="w-[84%] sm:w-[540px]">
                            <SheetHeader className="mb-6">
                              <SheetTitle>Politikalar</SheetTitle>
                              <SheetDescription>
                                Lütfen kullanım koşullarını ve güvenlik politikamızı dikkatlice okuyun.
                              </SheetDescription>
                            </SheetHeader>
                            <PolicyTabs />
                          </SheetContent>
                        </Sheet>
                      </span>
                      {" "}okudum ve kabul ediyorum.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          )}
          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}
          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {submitText}
          </Button>
        </form>
      </Form>
    </div>
  )
}

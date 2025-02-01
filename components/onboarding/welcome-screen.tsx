import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface WelcomeScreenProps {
  username?: string
  onContinue: () => void
}

export function WelcomeScreen({ username, onContinue }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-background/95">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg space-y-8 text-center"
      >
        {/* Lola Görsel */}
        <div className="relative w-32 h-32 mx-auto">
          <Image
            src="/images/lola-avatar.png"
            alt="Lola - Yapay Zeka Asistanınız"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Hoş Geldiniz Mesajı */}
        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold tracking-tight"
          >
            Hoş Geldiniz{username ? `, ${username}` : ""}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-muted-foreground"
          >
            Lola, yaşam yolculuğunuzda kişiye özel mentorluk için yanınızda!
          </motion.p>
        </div>

        {/* Slogan */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-primary/10 rounded-lg p-6"
        >
          <p className="text-lg font-medium text-primary">
            "Potansiyelinizi keşfedin, geleceğinizi şekillendirin"
          </p>
        </motion.div>

        {/* Devam Et Butonu */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            onClick={onContinue}
            className="w-full sm:w-auto px-8"
            size="lg"
          >
            Devam Et
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { motion } from "framer-motion"
import { Linkedin, Mail } from "lucide-react"

interface AuthScreenProps {
  onLinkedInAuth: () => void
  onEmailAuth: () => void
}

export function AuthScreen({ onLinkedInAuth, onEmailAuth }: AuthScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-background/95">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader>
            <CardTitle>Lola&#39;ya Hoş Geldiniz!</CardTitle>
            <CardDescription>
              Devam etmek için bir yöntem seçin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* LinkedIn ile Devam Et */}
            <Button
              variant="outline"
              className="w-full"
              onClick={onLinkedInAuth}
            >
              <Linkedin className="mr-2 h-4 w-4" />
              LinkedIn ile Devam Et
            </Button>

            {/* E-posta ile Devam Et */}
            <Button
              variant="outline"
              className="w-full"
              onClick={onEmailAuth}
            >
              <Mail className="mr-2 h-4 w-4" />
              E-posta ile Devam Et
            </Button>

            {/* KVKK Bilgilendirmesi */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="link" className="text-xs text-muted-foreground">
                  Hangi bilgiler toplanıyor?
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[84%] sm:h-[440px]">
                <SheetHeader>
                  <SheetTitle>Veri Toplama ve KVKK</SheetTitle>
                  <SheetDescription>
                    Size daha iyi hizmet verebilmek için topladığımız veriler ve kullanım amaçları
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium">Profil Bilgileri</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ad, soyad, profil fotoğrafı, e-posta adresi
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Kariyer Bilgileri</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      İş deneyimi, eğitim geçmişi, yetenekler
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Tercihler</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      İlgi alanları, kariyer hedefleri, mentorluk tercihleri
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Kullanım Verileri</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Platform kullanım istatistikleri, etkileşim verileri
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

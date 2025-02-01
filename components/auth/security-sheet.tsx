"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Key, AlertTriangle, Eye } from "lucide-react"

export function SecuritySheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link" size="sm" className="text-muted-foreground">
          Güvenlik Politikası
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] sm:h-[85vh]">
        <SheetHeader className="mb-6">
          <SheetTitle>Güvenlik Politikası</SheetTitle>
          <SheetDescription>
            MentiUp olarak güvenliğinizi çok önemsiyoruz. İşte verilerinizi nasıl koruduğumuz:
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 pr-6 overflow-y-auto h-[calc(100%-100px)]">
          <section className="flex items-start gap-3">
            <Shield className="h-5 w-5 mt-1 text-primary" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Veri Şifreleme</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Tüm hassas verileriniz endüstri standardı şifreleme protokolleri ile korunmaktadır.
                İletişim SSL/TLS ile şifrelenmektedir.
              </p>
            </div>
          </section>

          <section className="flex items-start gap-3">
            <Lock className="h-5 w-5 mt-1 text-primary" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Hesap Güvenliği</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Güçlü şifre politikası ve iki faktörlü kimlik doğrulama ile hesabınız güvende.
                Şüpheli aktiviteler anında tespit edilip engellenmektedir.
              </p>
            </div>
          </section>

          <section className="flex items-start gap-3">
            <Key className="h-5 w-5 mt-1 text-primary" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Erişim Kontrolü</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Verilerinize sadece yetkilendirilmiş personel erişebilir.
                Tüm erişimler kayıt altına alınır ve düzenli olarak denetlenir.
              </p>
            </div>
          </section>

          <section className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 mt-1 text-primary" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Güvenlik İhlalleri</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Olası güvenlik ihlallerine karşı 7/24 izleme yapılmaktadır.
                Şüpheli durumlarda hesap sahipleri anında bilgilendirilir.
              </p>
            </div>
          </section>

          <section className="flex items-start gap-3">
            <Eye className="h-5 w-5 mt-1 text-primary" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Veri Şeffaflığı</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Hangi verilerinizin toplandığını ve nasıl kullanıldığını her zaman görebilirsiniz.
                Verilerinizi istediğiniz zaman indirip silebilirsiniz.
              </p>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}

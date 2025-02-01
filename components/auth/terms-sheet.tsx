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

export function TermsSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link" size="sm" className="text-muted-foreground">
          Kullanım Koşulları
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] sm:h-[85vh]">
        <SheetHeader className="mb-6">
          <SheetTitle>Kullanım Koşulları</SheetTitle>
          <SheetDescription>
            Lütfen MentiUp platformunu kullanmadan önce aşağıdaki koşulları dikkatlice okuyun.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 pr-6 overflow-y-auto h-[calc(100%-100px)]">
          <section>
            <h3 className="text-lg font-semibold mb-2">1. Hizmet Kullanımı</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              MentiUp platformunu kullanarak, bu koşulları kabul etmiş olursunuz. Platform, kariyer gelişimi ve mentorluk hizmetleri sunmaktadır.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">2. Hesap Güvenliği</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Hesabınızın güvenliğinden siz sorumlusunuz. Şifrenizi güvende tutun ve hesabınıza izinsiz erişim olduğunu düşünüyorsanız bize bildirin.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">3. Gizlilik Politikası</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Kişisel verileriniz KVKK kapsamında korunmaktadır. Detaylı bilgi için gizlilik politikamızı inceleyebilirsiniz.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">4. İçerik Politikası</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Platform üzerinde paylaşılan içerikler yasal ve etik kurallara uygun olmalıdır. Uygunsuz içerikler kaldırılacaktır.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">5. Ücretlendirme</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Premium özellikler için ücretlendirme yapılabilir. Ödeme koşulları ve iade politikası ayrıca belirtilecektir.
            </p>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}

"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PolicyTabs() {
  return (
    <Tabs defaultValue="terms" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="terms">Kullanım Koşulları</TabsTrigger>
        <TabsTrigger value="security">Güvenlik Politikası</TabsTrigger>
      </TabsList>
      <TabsContent value="terms" className="mt-4">
        <div className="space-y-6 pr-6 overflow-y-auto h-[calc(100vh-300px)]">
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
      </TabsContent>
      <TabsContent value="security" className="mt-4">
        <div className="space-y-6 pr-6 overflow-y-auto h-[calc(100vh-300px)]">
          <section>
            <h3 className="text-lg font-semibold mb-2">Veri Şifreleme</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Tüm hassas verileriniz endüstri standardı şifreleme protokolleri ile korunmaktadır.
              İletişim SSL/TLS ile şifrelenmektedir.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Hesap Güvenliği</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Güçlü şifre politikası ve iki faktörlü kimlik doğrulama ile hesabınız güvende.
              Şüpheli aktiviteler anında tespit edilip engellenmektedir.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Erişim Kontrolü</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Verilerinize sadece yetkilendirilmiş personel erişebilir.
              Tüm erişimler kayıt altına alınır ve düzenli olarak denetlenir.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Güvenlik İhlalleri</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Olası güvenlik ihlallerine karşı 7/24 izleme yapılmaktadır.
              Şüpheli durumlarda hesap sahipleri anında bilgilendirilir.
            </p>
          </section>
        </div>
      </TabsContent>
    </Tabs>
  )
}

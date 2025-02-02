# Onboarding Veri Yapısı Güncellemeleri

## Öncelik 1: Veritabanı Yapısı
- [x] SQL dosyalarının uygulanması
  - [x] [Tablo yapıları](./sql/onboarding-tables.sql)
  - [x] [Trigger tanımlamaları](./sql/onboarding-triggers.sql)
  - [x] [Güvenlik politikaları](./sql/onboarding-policies.sql)

## Öncelik 2: Temel Veri Yapısı ve Tipler
- [x] `types/onboarding.ts` - Tip tanımlamaları
  ```typescript
  export interface OnboardingData {
    mentorshipType: {
      id: string;
      label: string;
    };
    fields?: {
      [key: string]: string[];
    };
    industries?: {
      [key: string]: string[];
    };
    goals?: {
      [key: string]: string[];
    };
    expectations?: string;
  }
  ```

## Öncelik 3: Layout ve Context Güncellemesi
- [x] `layout.tsx` dosyasında güncelleme
  - [x] OnboardingData tipini yeni yapıya göre güncelleme
  - [x] Context tiplerini güncelleme

## Öncelik 4: Mentorluk Tipi Sayfası (Step 1)
- [ ] `(step01)/mentorship-type/page.tsx` güncelleme
  - [ ] Mentorluk tipi seçimlerini Türkçe karşılıklarıyla eşleştirme
  ```typescript
  const mentorshipTypes = {
    "career-development": "Kariyer-Gelişim Mentoru",
    "senior-career": "Usta Kariyer Mentoru",
    "startup": "Girişim Mentoru",
    "senior-startup": "Usta StartUP Mentoru"
  }
  ```

## Öncelik 5: Alan ve Hedef Sayfaları (Step 2)
### Kariyer-Gelişim Mentoru Sayfası
- [x] `(step02)/career-development/page.tsx`
  - [x] Field seçimlerini `career_development_field` prefixleme
  - [x] Industry seçimlerini `career_development_industry` prefixleme
  - [x] Goals seçimlerini `career_development_goal` prefixleme

### Usta Kariyer Mentoru Sayfası
- [ ] `(step02)/senior-career/page.tsx`
  - [ ] Field seçimlerini `senior_career_field` prefixleme
  - [ ] Industry seçimlerini `senior_career_industry` prefixleme
  - [ ] Goals seçimlerini `senior_career_goal` prefixleme

### Girişim Mentoru Sayfası
- [ ] `(step02)/startup/page.tsx`
  - [ ] Field seçimlerini `startup_field` prefixleme
  - [ ] Industry seçimlerini `startup_industry` prefixleme
  - [ ] Goals seçimlerini `startup_goal` prefixleme

### Usta StartUP Mentoru Sayfası
- [ ] `(step02)/senior-startup/page.tsx`
  - [ ] Field seçimlerini `senior_startup_field` prefixleme
  - [ ] Industry seçimlerini `senior_startup_industry` prefixleme
  - [ ] Goals seçimlerini `senior_startup_goal` prefixleme

## Öncelik 6: Beklentiler Sayfası (Step 3)
- [ ] `(step03)/expectation/page.tsx`
  - [ ] Beklentileri `user_expectations` olarak prefixleme
  - [ ] Önerileri veritabanından çekecek yapıyı kurma

## Öncelik 7: Completion Sayfası (Step 4)
- [ ] `(step04)/completion/page.tsx`
  - [ ] Prefixli alan isimlerini doğru şekilde görüntüleme
  - [ ] Türkçe mentorluk tipi gösterimini güncelleme
  - [ ] Chat formatını yeni yapıya göre güncelleme

## Notlar
- Her değişiklik minimum bağımlılık prensibiyle yapılmalı
- TypeScript tip güvenliği sağlanmalı
- Erişilebilirlik özellikleri korunmalı
- Mobil uyumluluk kontrol edilmeli
- Her adımda Supabase ile senkronizasyon sağlanmalı

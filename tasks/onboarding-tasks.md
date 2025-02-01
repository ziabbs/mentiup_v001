# Onboarding Süreci Geliştirme Görevleri

## 1. Hoş Geldiniz Ekranı
- [ ] Tasarım
  - [ ] Responsive hero bileşeni
  - [ ] Lola görsel entegrasyonu
  - [ ] Animasyonlu slogan/mesaj
  - [ ] İlerleme göstergesi (stepper)
  - [ ] "Devam Et" butonu tasarımı

- [ ] Kişiselleştirme
  - [ ] Dinamik kullanıcı adı gösterimi
  - [ ] Motivasyonel mesaj sistemi
  - [ ] Görsel/animasyon varyasyonları

## 2. Giriş Yöntemleri Ekranı
- [ ] LinkedIn Entegrasyonu
  - [ ] LinkedIn OAuth yapılandırması
  - [ ] LinkedIn API entegrasyonu
  - [ ] Veri eşleme (LinkedIn -> Supabase)
  - [ ] Hata yönetimi
  - [ ] Loading states

- [ ] E-posta ile Giriş
  - [ ] Form tasarımı revizyonu
  - [ ] Validasyon kuralları
  - [ ] Error states
  - [ ] Success feedback

## 3. KVKK ve İzinler
- [ ] KVKK Bildirimi
  - [ ] Detaylı bilgilendirme metni
  - [ ] Kategorize edilmiş veri listesi
  - [ ] Onay mekanizması

- [ ] İzin Yönetimi
  - [ ] İzin kategorileri tabları
  - [ ] Progress gösterimi (%84 sheet)
  - [ ] Toggle kontrolleri
  - [ ] İzin geçmişi

## 4. Supabase Entegrasyonu
- [ ] Veri Modeli
  ```sql
  -- onboarding_progress tablosu
  CREATE TABLE onboarding_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    current_step TEXT NOT NULL,
    completed_steps JSONB DEFAULT '[]',
    linkedin_data JSONB,
    permissions JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- permissions_history tablosu
  CREATE TABLE permissions_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    permission_type TEXT NOT NULL,
    status BOOLEAN NOT NULL,
    changed_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] RLS Politikaları
  ```sql
  -- onboarding_progress için
  CREATE POLICY "Users can view own progress"
    ON onboarding_progress FOR SELECT
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can update own progress"
    ON onboarding_progress FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  -- permissions_history için
  CREATE POLICY "Users can view own permission history"
    ON permissions_history FOR SELECT
    USING (auth.uid() = user_id);
  ```

## 5. State Management
- [ ] Onboarding Context
  - [ ] İlerleme durumu
  - [ ] Kullanıcı tercihleri
  - [ ] İzin durumları
  - [ ] LinkedIn verisi

- [ ] Persistence
  - [ ] Local storage sync
  - [ ] Supabase sync
  - [ ] Offline support

## 6. Erişilebilirlik
- [ ] ARIA labels
- [ ] Klavye navigasyonu
- [ ] Screen reader desteği
- [ ] Focus management
- [ ] Color contrast

## 7. Test ve Dokümantasyon
- [ ] Unit Tests
  - [ ] Form validasyonları
  - [ ] State yönetimi
  - [ ] API entegrasyonları

- [ ] E2E Tests
  - [ ] LinkedIn flow
  - [ ] Email flow
  - [ ] KVKK onay süreci

- [ ] Dokümantasyon
  - [ ] LinkedIn entegrasyon guide
  - [ ] Veri modeli diyagramı
  - [ ] State flow diyagramı

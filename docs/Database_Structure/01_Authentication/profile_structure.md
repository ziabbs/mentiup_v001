# Kariyer ve Profil Yapısı Dokümantasyonu

## Tablolar

### 1. Career Profiles (`public.career_profiles`)

Kullanıcıların kariyer bilgilerini ve profesyonel profillerini içerir.

#### Alanlar:
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key -> auth.users)
- `current_title`: TEXT - Mevcut iş unvanı
- `experience_years`: INTEGER - Toplam deneyim yılı
- `education_level`: TEXT - Eğitim seviyesi
- `skills`: JSONB - Yetenekler listesi
- `interests`: JSONB - İlgi alanları
- `certifications`: JSONB - Sertifikalar
- `mentoring_areas`: JSONB - Mentorluk yapabileceği alanlar
- `learning_areas`: JSONB - Öğrenmek istediği alanlar
- `bio`: TEXT - Profesyonel biyografi
- `linkedin_url`: TEXT - LinkedIn profil linki
- `github_url`: TEXT - GitHub profil linki
- `portfolio_url`: TEXT - Portfolyo sitesi linki
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ

### 2. User Preferences (`public.user_preferences`)

Kullanıcı tercihlerini ve ayarlarını içerir.

#### Alanlar:
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key -> auth.users)
- `language`: TEXT - Tercih edilen dil (default: 'tr')
- `theme`: TEXT - UI teması (default: 'light')
- `email_notifications`: JSONB - Email bildirim tercihleri
- `push_notifications`: JSONB - Push bildirim tercihleri
- `mentorship_preferences`: JSONB - Mentorluk tercihleri
- `learning_preferences`: JSONB - Öğrenme tercihleri
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ

### 3. Privacy Settings (`public.privacy_settings`)

Kullanıcı gizlilik ayarlarını içerir.

#### Alanlar:
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key -> auth.users)
- `profile_visibility`: TEXT - Profil görünürlüğü (public, connections, private)
- `show_email`: BOOLEAN - Email görünürlüğü
- `show_social_links`: BOOLEAN - Sosyal medya linklerinin görünürlüğü
- `show_learning_progress`: BOOLEAN - Öğrenme ilerlemesi görünürlüğü
- `show_mentorship_status`: BOOLEAN - Mentorluk durumu görünürlüğü
- `show_skills`: BOOLEAN - Yeteneklerin görünürlüğü
- `show_certifications`: BOOLEAN - Sertifikaların görünürlüğü
- `searchable`: BOOLEAN - Profil arama görünürlüğü
- `allow_messages_from`: TEXT - Mesaj izinleri (all, connections, none)
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ

## Güvenlik Politikaları

### Row Level Security (RLS)

Tüm tablolarda RLS aktiftir ve aşağıdaki politikalar uygulanır:

1. Career Profiles:
   - Kullanıcılar kendi profillerini görüntüleyebilir ve düzenleyebilir
   - Public profiller herkes tarafından görüntülenebilir
   - Profil silme sadece profil sahibi tarafından yapılabilir

2. User Preferences:
   - Sadece kullanıcının kendisi tercihlerini görüntüleyebilir ve düzenleyebilir
   - Tercihler başkaları tarafından görüntülenemez

3. Privacy Settings:
   - Sadece kullanıcının kendisi gizlilik ayarlarını görüntüleyebilir ve düzenleyebilir
   - Gizlilik ayarları başkaları tarafından görüntülenemez

### Veri Maskeleme

Hassas veriler için maskeleme fonksiyonları:

1. `mask_email()`: Email adreslerini maskelemek için
   - Örnek: `john.doe@example.com` -> `jo***@example.com`

2. `mask_url()`: Sosyal medya linklerini maskelemek için
   - LinkedIn URL -> "LinkedIn Profile"
   - GitHub URL -> "GitHub Profile"
   - Diğer URL'ler -> "External Profile"

## Tetikleyiciler

1. `handle_new_user_career()`:
   - Yeni kullanıcı kaydında otomatik profil oluşturur
   - Varsayılan tercihleri ve gizlilik ayarlarını oluşturur

2. `handle_privacy_changes()`:
   - Gizlilik ayarı değişikliklerini loglar
   - Önemli değişiklikleri security_logs tablosuna kaydeder

3. `handle_career_profile_updates()`:
   - Profil güncellemelerini validate eder
   - URL formatlarını kontrol eder
   - Önemli değişiklikleri loglar

4. `handle_user_preferences_update()`:
   - Kullanıcı tercihlerini validate eder
   - Geçersiz değerleri varsayılan değerlerle değiştirir

## Performans Optimizasyonu

1. İndeksler:
   - `idx_career_profiles_user_id`
   - `idx_user_preferences_user_id`
   - `idx_privacy_settings_user_id`

2. Kısıtlamalar:
   - Maximum 50 skill
   - Maximum 10 mentorluk alanı
   - Geçerli URL formatları

# Kullanıcı Profilleri ve Kariyer Bilgileri Yapısı

Bu dokümantasyon, MentiUp uygulamasının kullanıcı profilleri ve kariyer bilgileri sisteminin veritabanı yapısını açıklar.

## Migration Dosyaları
- [00001_career_schema.sql](./migrations/00001_career_schema.sql) - Temel tablo yapıları
- [00002_career_policies.sql](./migrations/00002_career_policies.sql) - Güvenlik politikaları
- [00003_career_triggers.sql](./migrations/00003_career_triggers.sql) - Tetikleyiciler ve otomatik işlemler

## Tablolar ve Amaçları

### Kariyer Profili (public.career_profiles)
Kullanıcının kariyer bilgilerini ve hedeflerini içerir.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID | Benzersiz tanımlayıcı |
| user_id | UUID | Kullanıcı ID (profiles tablosuna referans) |
| title | TEXT | Profesyonel başlık |
| current_position | TEXT | Mevcut pozisyon |
| industry | TEXT | Çalışılan sektör |
| experience_years | INTEGER | Deneyim yılı |
| education_level | TEXT | Eğitim seviyesi |
| skills | JSONB | Yetenekler listesi |
| interests | JSONB | İlgi alanları |
| bio | TEXT | Profesyonel özgeçmiş |
| linkedin_url | TEXT | LinkedIn profil linki |
| github_url | TEXT | GitHub profil linki |
| portfolio_url | TEXT | Portfolyo sitesi |
| achievements | JSONB | Başarılar listesi |
| certifications | JSONB | Sertifikalar listesi |
| mentor_preferences | JSONB | Mentorluk tercihleri |
| profile_completion_rate | INTEGER | Profil tamamlanma yüzdesi (0-100) |
| is_looking_for_mentor | BOOLEAN | Mentor arama durumu |
| is_available_as_mentor | BOOLEAN | Mentor olarak müsaitlik |
| last_updated | TIMESTAMPTZ | Son güncelleme tarihi |
| created_at | TIMESTAMPTZ | Oluşturulma tarihi |

### Belge Yönetimi (public.user_documents)
Kullanıcının CV, sertifika ve diğer belgelerini yönetir.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID | Benzersiz tanımlayıcı |
| user_id | UUID | Kullanıcı ID |
| document_type | TEXT | Belge tipi (cv, certificate, portfolio, other) |
| title | TEXT | Belge başlığı |
| description | TEXT | Belge açıklaması |
| file_path | TEXT | Dosya yolu |
| file_size | BIGINT | Dosya boyutu (bytes) |
| file_type | TEXT | Dosya tipi (pdf, doc, vb.) |
| is_primary | BOOLEAN | Ana belge mi? |
| metadata | JSONB | Ek meta veriler |
| uploaded_at | TIMESTAMPTZ | Yüklenme tarihi |
| last_updated | TIMESTAMPTZ | Son güncelleme tarihi |

### Kullanıcı Tercihleri (public.user_preferences)
Kullanıcının uygulama ve bildirim tercihlerini içerir.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID | Benzersiz tanımlayıcı |
| user_id | UUID | Kullanıcı ID |
| email_notifications | JSONB | Email bildirim tercihleri |
| app_preferences | JSONB | Uygulama tercihleri |
| mentor_matching_preferences | JSONB | Mentor eşleştirme tercihleri |
| last_updated | TIMESTAMPTZ | Son güncelleme tarihi |

#### Email Notifications Yapısı
```jsonc
{
    "mentor_requests": true,    // Mentor istekleri
    "messages": true,          // Yeni mesajlar
    "career_opportunities": true, // Kariyer fırsatları
    "profile_views": true,     // Profil görüntülenmeleri
    "system_updates": true     // Sistem güncellemeleri
}
```

#### App Preferences Yapısı
```jsonc
{
    "theme": "light",          // Tema (light/dark)
    "language": "tr",          // Dil tercihi
    "accessibility": {
        "high_contrast": false,  // Yüksek kontrast
        "font_size": "medium",   // Yazı boyutu
        "screen_reader": false   // Ekran okuyucu uyumluluğu
    }
}
```

#### Mentor Matching Preferences Yapısı
```jsonc
{
    "industries": [],           // Tercih edilen sektörler
    "experience_level": "any",  // Deneyim seviyesi
    "meeting_frequency": "weekly", // Görüşme sıklığı
    "communication_style": "any", // İletişim stili
    "languages": ["tr"]        // İletişim dilleri
}
```

### Gizlilik Ayarları (public.privacy_settings)
Kullanıcının profil ve belge görünürlük ayarlarını yönetir.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID | Benzersiz tanımlayıcı |
| user_id | UUID | Kullanıcı ID |
| profile_visibility | TEXT | Profil görünürlüğü (public, connections, private) |
| contact_info_visibility | JSONB | İletişim bilgileri görünürlüğü |
| document_visibility | JSONB | Belge görünürlük ayarları |
| searchable | BOOLEAN | Arama sonuçlarında görünme |
| show_online_status | BOOLEAN | Online durumu gösterme |
| last_updated | TIMESTAMPTZ | Son güncelleme tarihi |

## Otomatik İşlemler

### Yeni Kullanıcı Kaydı
Kullanıcı kayıt başarılı olduğunda:
1. Kariyer profili oluşturulur
2. Varsayılan kullanıcı tercihleri ayarlanır
3. Varsayılan gizlilik ayarları oluşturulur
4. Güvenlik loglarına kayıt eklenir

### Profil Güncellemeleri
1. Profil tamamlanma oranı otomatik hesaplanır
2. Son güncelleme tarihi otomatik güncellenir
3. Değişiklikler güvenlik loglarına kaydedilir

### Belge Yönetimi
1. Belge yüklemeleri loglanır
2. Dosya boyutu ve tipi kontrol edilir
3. Belge meta verileri otomatik çıkarılır

## Güvenlik Politikaları

### Profil Görünürlüğü
- Public: Herkes görebilir
- Connections: Sadece bağlantılar görebilir
- Private: Sadece kullanıcının kendisi görebilir

### Veri Maskeleme
Hassas veriler (iletişim bilgileri, sosyal medya linkleri) kullanıcının gizlilik ayarlarına göre maskelenir.

### RLS Politikaları
Her tablo için Row Level Security (RLS) politikaları tanımlanmıştır:

#### career_profiles
- Herkes public profilleri görüntüleyebilir
- Kullanıcılar kendi profillerini yönetebilir
- Adminler tüm profillere erişebilir

#### user_documents
- Belge görünürlüğü ayarlara göre kontrol edilir
- Kullanıcılar kendi belgelerini yönetebilir
- Adminler tüm belgelere erişebilir

#### user_preferences
- Kullanıcılar sadece kendi tercihlerini görebilir ve yönetebilir
- Adminler tüm tercihlere erişebilir

#### privacy_settings
- Kullanıcılar sadece kendi gizlilik ayarlarını görebilir ve yönetebilir
- Adminler tüm gizlilik ayarlarına erişebilir

## Güvenlik ve İzleme

### Rate Limiting

Her endpoint için özel olarak tanımlanmış istek limitleri:

| Endpoint | Max İstek | Zaman Penceresi | Açıklama |
|----------|-----------|-----------------|-----------|
| /profile/view | 60 | 60 dakika | Profil görüntüleme |
| /profile/update | 10 | 30 dakika | Profil güncelleme |
| /document/upload | 20 | 60 dakika | Belge yükleme |
| /document/download | 30 | 60 dakika | Belge indirme |
| /mentor/request | 5 | 24 saat | Mentor isteği |

### Güvenlik Olayları (Event Types)

Sistem tarafından izlenen ve loglanan olaylar:

#### Profil İşlemleri
- `profile_viewed`: Profil görüntüleme
- `career_profile_created`: Yeni kariyer profili oluşturma
- `career_profile_updated`: Kariyer profili güncelleme
- `privacy_settings_changed`: Gizlilik ayarları değişikliği

#### Belge İşlemleri
- `document_uploaded`: Yeni belge yükleme
- `document_accessed`: Belge erişimi
- `document_deleted`: Belge silme

#### Mentorluk İşlemleri
- `mentor_request_sent`: Mentor isteği gönderme
- `mentor_request_accepted`: Mentor isteği kabul
- `mentor_request_rejected`: Mentor isteği red

### Güvenlik Metrikleri

Sistem tarafından saatlik olarak toplanan ve analiz edilen metrikler:

#### Profil Erişim Metrikleri
```jsonc
{
    "metric_name": "profile_views_24h",
    "metric_value": {
        "total_views": 150,
        "by_visibility": {
            "public": 100,
            "connections": 40,
            "private": 10
        }
    }
}
```

#### Belge Erişim Metrikleri
```jsonc
{
    "metric_name": "document_access_24h",
    "metric_value": {
        "total_access": 75,
        "by_type": [
            {
                "document_type": "cv",
                "count": 30
            },
            {
                "document_type": "certificate",
                "count": 25
            },
            {
                "document_type": "portfolio",
                "count": 20
            }
        ]
    }
}
```

### Veri Maskeleme ve Erişim Kontrolü

#### Profil Verisi Maskeleme
- Email adresleri: İlk 2 karakter görünür (ör: "jo***@example.com")
- Telefon numaraları: İlk 3 ve son 2 rakam görünür (ör: "123***45")
- Sosyal medya linkleri: Gizlilik ayarlarına göre maskelenir

#### Belge Erişim Kontrolü
- CV'ler varsayılan olarak sadece bağlantılara açık
- Sertifikalar varsayılan olarak herkese açık
- Özel belgeler sadece kullanıcının kendisine görünür

### Otomatik Güvenlik İşlemleri

1. **Saatlik İşlemler**
   - Profil erişim metriklerinin güncellenmesi
   - Belge erişim istatistiklerinin toplanması
   - Güvenlik olaylarının analizi

2. **Günlük İşlemler**
   - Eski rate limit kayıtlarının temizlenmesi
   - Şüpheli aktivite raporlarının oluşturulması
   - Bloklanmış IP'lerin gözden geçirilmesi

3. **Olay Bazlı İşlemler**
   - Rate limit aşımlarının loglanması
   - Profil görüntüleme olaylarının kaydı
   - Belge erişim izinlerinin kontrolü

## İndeksler

| Tablo | İndeks | Kolonlar | Amaç |
|-------|---------|----------|------|
| career_profiles | idx_career_profiles_user_id | (user_id) | Kullanıcı bazlı sorguları hızlandırma |
| career_profiles | idx_career_profiles_skills | (skills) | Yetenek bazlı aramaları hızlandırma |
| career_profiles | idx_career_profiles_industry | (industry) | Sektör bazlı sorguları hızlandırma |
| user_documents | idx_user_documents_user_id | (user_id) | Kullanıcı bazlı belge sorgularını hızlandırma |
| user_documents | idx_user_documents_type | (document_type) | Belge tipi bazlı sorguları hızlandırma |
| user_preferences | idx_user_preferences_user_id | (user_id) | Kullanıcı bazlı tercihleri hızlandırma |
| privacy_settings | idx_privacy_settings_user_id | (user_id) | Kullanıcı bazlı gizlilik sorgularını hızlandırma |

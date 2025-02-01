# Kimlik Doğrulama Sistemi Veritabanı Yapısı

Bu dokümantasyon, MentiUp uygulamasının kimlik doğrulama sisteminin veritabanı yapısını açıklar.

## Migration Dosyaları
- [00001_auth_schema.sql](./migrations/00001_auth_schema.sql) - Temel tablo yapıları
- [00002_auth_policies.sql](./migrations/00002_auth_policies.sql) - Güvenlik politikaları
- [00003_auth_triggers.sql](./migrations/00003_auth_triggers.sql) - Tetikleyiciler ve fonksiyonlar
- [00004_security_policies.sql](./migrations/00004_security_policies.sql) - Gelişmiş güvenlik önlemleri

## Tablolar ve Amaçları

### 1. profiles
Kullanıcı profil bilgilerini tutar.

| Sütun | Tür | Açıklama |
|-------|-----|----------|
| id | UUID | Kullanıcı ID (auth.users'dan referans) |
| username | TEXT | Benzersiz kullanıcı adı |
| full_name | TEXT | Tam ad |
| avatar_url | TEXT | Profil resmi URL'i |
| bio | TEXT | Kullanıcı biyografisi |
| email | TEXT | Benzersiz email adresi |
| phone | TEXT | Telefon numarası |
| created_at | TIMESTAMPTZ | Oluşturulma tarihi |
| updated_at | TIMESTAMPTZ | Son güncelleme tarihi |

### 2. roles
Sistem rollerini ve yetkilerini tanımlar.

| Sütun | Tür | Açıklama |
|-------|-----|----------|
| id | UUID | Rol ID |
| name | TEXT | Rol adı (admin, moderator, vb.) |
| description | TEXT | Rol açıklaması |
| permissions | JSONB | Rol yetkileri. Örnek format: {"feature_name": ["action1", "action2"]} <br> Örneğin: {"content": ["read", "write"], "users": ["view"]} |
| created_at | TIMESTAMPTZ | Oluşturulma tarihi |
| updated_at | TIMESTAMPTZ | Son güncelleme tarihi |

#### Permissions JSONB Yapısı
Her rol için izinler JSON formatında tutulur. Her alan (content, users vb.) bir özellik grubunu temsil eder ve içindeki dizi o gruptaki izinleri belirtir.

1. **İçerik Yönetimi (content)**
   ```json
   "content": ["read", "write", "delete"]
   ```
   - `read`: İçerikleri görüntüleme
   - `write`: Yeni içerik oluşturma ve düzenleme
   - `delete`: İçerik silme

2. **Kullanıcı Yönetimi (users)**
   ```json
   "users": ["view", "edit", "delete"]
   ```
   - `view`: Kullanıcı profillerini görüntüleme
   - `edit`: Kullanıcı bilgilerini düzenleme
   - `delete`: Kullanıcı hesaplarını silme

3. **Sohbet Sistemi (chat)**
   ```json
   "chat": ["read", "write", "moderate"]
   ```
   - `read`: Sohbet mesajlarını görüntüleme
   - `write`: Mesaj gönderme
   - `moderate`: Mesajları düzenleme/silme, kullanıcıları susturma

4. **AI Özellikleri (ai)**
   ```json
   "ai": ["basic", "advanced", "unlimited"]
   ```
   - `basic`: Günlük sınırlı AI kullanımı (örn: 10 soru)
   - `advanced`: Gelişmiş özellikler ve arttırılmış limit
   - `unlimited`: Sınırsız AI kullanımı

5. **Destek Sistemi (support)**
   ```json
   "support": ["view", "respond", "escalate"]
   ```
   - `view`: Destek taleplerini görüntüleme
   - `respond`: Taleplere cevap verme
   - `escalate`: Talepleri üst seviyeye yükseltme

### Rol Bazlı İzin Örnekleri

1. **Admin Rolü**
```json
{
    "content": ["read", "write", "delete"],
    "users": ["view", "edit", "delete"],
    "chat": ["read", "write", "moderate"],
    "ai": ["unlimited"],
    "support": ["view", "respond", "escalate"]
}
```

2. **Moderatör Rolü**
```json
{
    "content": ["read", "write"],
    "users": ["view"],
    "chat": ["read", "write", "moderate"],
    "ai": ["advanced"],
    "support": ["view", "respond"]
}
```

3. **Premium Kullanıcı Rolü**
```json
{
    "content": ["read", "write"],
    "users": ["view"],
    "chat": ["read", "write"],
    "ai": ["advanced"],
    "support": ["view"]
}
```

4. **Standart Kullanıcı Rolü**
```json
{
    "content": ["read"],
    "users": ["view"],
    "chat": ["read", "write"],
    "ai": ["basic"],
    "support": ["view"]
}
```

5. **Misafir Rolü**
```json
{
    "content": ["read"],
    "users": [],
    "chat": ["read"],
    "ai": ["basic"],
    "support": ["view"]
}
```

### İzin Kontrolü Örneği
```sql
-- Bir kullanıcının belirli bir eylemi yapıp yapamayacağını kontrol etme
SELECT check_user_permission(
    auth.uid(),
    'content:write'  -- İstenen yetki
);
```

### 3. user_roles
Kullanıcı-rol ilişkilerini tutar.

| Sütun | Tür | Açıklama |
|-------|-----|----------|
| id | UUID | İlişki ID |
| user_id | UUID | Kullanıcı ID |
| role_id | UUID | Rol ID |
| created_at | TIMESTAMPTZ | Atanma tarihi |
| updated_at | TIMESTAMPTZ | Son güncelleme tarihi |

### 4. security_logs
Güvenlik olaylarını kaydeder.

| Sütun | Tür | Açıklama |
|-------|-----|----------|
| id | UUID | Log ID |
| user_id | UUID | Kullanıcı ID |
| event_type | TEXT | Olay tipi (login, logout, vb.) |
| ip_address | INET | IP adresi |
| user_agent | TEXT | Tarayıcı/cihaz bilgisi |
| details | JSONB | Olay detayları JSON formatında |
| created_at | TIMESTAMPTZ | Kayıt tarihi |

## Güvenlik Yapılandırması

### Rate Limiting Tablosu (public.rate_limits)
API isteklerinin sayısını ve zamanını takip eder.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID | Benzersiz tanımlayıcı |
| ip_address | TEXT | İstek yapan IP adresi |
| endpoint | TEXT | İstek yapılan endpoint |
| request_count | INTEGER | İstek sayısı |
| window_start | TIMESTAMPTZ | Zaman penceresi başlangıcı |

```sql
-- Örnek rate limit kontrolü
SELECT check_rate_limit(
    '192.168.1.1',        -- IP adresi
    '/api/auth/login',    -- Endpoint
    5,                    -- Maximum istek sayısı
    15                    -- Zaman penceresi (dakika)
);
```

### Güvenlik Audit Log Tablosu (public.security_audit_logs)
Güvenlikle ilgili tüm olayları kaydeder.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID | Benzersiz tanımlayıcı |
| user_id | UUID | İlgili kullanıcı ID (opsiyonel) |
| event_type | TEXT | Olay tipi (Bkz: Olay Tipleri) |
| event_details | JSONB | Olay detayları (Bkz: Event Details Yapısı) |
| ip_address | TEXT | İstek yapan IP adresi |
| user_agent | TEXT | Kullanıcı tarayıcı bilgisi |
| severity | TEXT | Önem derecesi (info, warning, error, critical) |
| created_at | TIMESTAMPTZ | Kayıt zamanı |

#### Olay Tipleri (event_type)
- `login_failed`: Başarısız giriş denemesi
  - Sebepler: invalid_password, user_not_found, account_locked
- `login_success`: Başarılı giriş
- `logout`: Kullanıcı çıkışı
- `password_reset_requested`: Şifre sıfırlama talebi
- `password_changed`: Şifre değişikliği
- `rate_limit_exceeded`: Rate limit aşımı
- `role_changed`: Kullanıcı rolü değişikliği
- `account_locked`: Hesap kilitleme
- `suspicious_activity`: Şüpheli aktivite tespiti

#### Event Details Yapısı (event_details)
```jsonc
// login_failed için örnek
{
    "reason": "invalid_password", // Başarısızlık sebebi
    "email": "user@example.com",  // İlgili email
    "attempt_count": 3,           // Deneme sayısı
    "ip_location": "TR"           // IP lokasyonu
}

// rate_limit_exceeded için örnek
{
    "endpoint": "/api/auth/login",
    "limit": 5,
    "window_minutes": 15,
    "current_count": 6
}

// suspicious_activity için örnek
{
    "type": "multiple_locations",
    "details": {
        "previous_login": "TR/Istanbul",
        "current_login": "US/NewYork",
        "time_difference_minutes": 30
    }
}
```

### Güvenlik Metrikleri Tablosu (public.security_metrics)
Güvenlik olaylarının istatistiklerini tutar.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID | Benzersiz tanımlayıcı |
| metric_name | TEXT | Metrik adı (Bkz: Metrik Tipleri) |
| metric_value | JSONB | Metrik değeri ve detayları (Bkz: Metric Value Yapısı) |
| measured_at | TIMESTAMPTZ | Ölçüm zamanı |

#### Metrik Tipleri (metric_name)
- `failed_login_attempts_24h`: Son 24 saatteki başarısız giriş denemeleri
- `rate_limit_exceeded_24h`: Son 24 saatteki rate limit aşımları
- `suspicious_activities_24h`: Son 24 saatteki şüpheli aktiviteler
- `active_sessions`: Aktif oturum sayısı
- `password_resets_24h`: Son 24 saatteki şifre sıfırlama sayısı

#### Metric Value Yapısı (metric_value)
```jsonc
// failed_login_attempts_24h için örnek
{
    "count": 150,              // Toplam sayı
    "details": [
        {
            "ip_address": "192.168.1.1",
            "count": 25,
            "location": "TR",
            "success_rate": 0.2
        }
    ],
    "trend": {                 // Saatlik trend
        "00:00": 10,
        "01:00": 15,
        // ...
    }
}

// rate_limit_exceeded_24h için örnek
{
    "count": 50,
    "details": [
        {
            "endpoint": "/api/auth/login",
            "count": 30,
            "unique_ips": 5
        }
    ],
    "blocked_ips": [          // Geçici olarak bloklanmış IP'ler
        {
            "ip": "192.168.1.1",
            "until": "2024-01-27T21:00:00Z"
        }
    ]
}
```

### Veri Maskeleme
Hassas veriler (email, telefon) otomatik olarak maskelenir. Sadece veri sahibi ve admin kullanıcılar maskelenmemiş verileri görebilir.

Örnek:
- Normal kullanıcı için: `jo***@example.com`
- Veri sahibi için: `john@example.com`

### İndeksler
Performans optimizasyonu için oluşturulan indeksler:

| Tablo | İndeks | Kolonlar | Amaç |
|-------|---------|----------|------|
| rate_limits | idx_rate_limits_window | (ip_address, endpoint, window_start) | Rate limit kontrollerini hızlandırma |
| security_audit_logs | idx_security_audit_logs_event | (event_type, created_at) | Olay bazlı sorguları hızlandırma |
| security_audit_logs | idx_security_audit_logs_user | (user_id, created_at) | Kullanıcı bazlı sorguları hızlandırma |
| security_metrics | idx_security_metrics_name | (metric_name, measured_at) | Metrik sorgularını hızlandırma |

### Rate Limiting
Rate limiting sistemi, API endpoint'lerine yapılan istekleri kontrol eder ve aşırı kullanımı engeller.

```sql
-- Örnek rate limit kontrolü
SELECT check_rate_limit(
    '192.168.1.1',        -- IP adresi
    '/api/auth/login',    -- Endpoint
    5,                    -- Maximum istek sayısı
    15                    -- Zaman penceresi (dakika)
);
```

### Güvenlik Logları
Tüm güvenlik olayları (başarısız girişler, rate limit aşımları vb.) otomatik olarak loglanır.

```sql
-- Örnek güvenlik logu
SELECT log_security_event(
    'login_failed',
    jsonb_build_object(
        'reason', 'invalid_password',
        'email', 'user@example.com'
    ),
    'warning'
);
```

### Güvenlik Metrikleri
Sistem güvenlik metriklerini otomatik olarak toplar ve analiz eder:
- Son 24 saatteki başarısız giriş denemeleri
- Rate limit aşım istatistikleri
- Şüpheli aktivite raporları

## Oturum Yönetimi

Uygulama, Supabase'in built-in JWT (JSON Web Token) sistemini kullanır:

### JWT Yapısı
```json
{
    "aud": "authenticated",
    "exp": 1735689600,
    "sub": "user_id",
    "email": "user@example.com",
    "role": "authenticated",
    "session_id": "session_id"
}
```

### Oturum Özellikleri
- Access Token süresi: 1 saat
- Refresh Token süresi: 7 gün
- Otomatik token yenileme
- Güvenli token saklama (httpOnly cookies)
- Cross-site request forgery (CSRF) koruması

## Otomatik İşlemler

### Yeni Kullanıcı Kaydı
Kullanıcı kayıt olduğunda:
1. `auth.users` tablosuna kaydedilir
2. `profiles` tablosunda profil oluşturulur
3. `user_roles` tablosunda 'standard_user' rolü atanır
4. `security_logs` tablosuna kayıt logu eklenir
5. `rate_limits` tablosunda kullanıcıya özel limit kaydı oluşturulur

### Email Doğrulama
Kullanıcı emailini doğruladığında:
1. `auth.users` tablosunda email_confirmed_at güncellenir
2. `security_logs` tablosuna doğrulama logu eklenir

### Güvenlik Metrikleri Güncelleme
Her saat başı otomatik olarak:
1. Eski rate limit kayıtları temizlenir
2. Güvenlik metrikleri güncellenir
3. Şüpheli aktiviteler analiz edilir
4. Bloklanmış IP'ler kontrol edilir

## Güvenlik Politikaları

Her tablo için Row Level Security (RLS) politikaları tanımlanmıştır:

### profiles
- Herkes profilleri görüntüleyebilir
- Kullanıcılar kendi profillerini güncelleyebilir

### roles
- Authenticated kullanıcılar rolleri görüntüleyebilir
- Sadece adminler rolleri düzenleyebilir

### user_roles
- Kullanıcılar kendi rollerini görüntüleyebilir
- Sadece adminler rol atama/değiştirme yapabilir

### security_logs
- Kullanıcılar kendi loglarını görüntüleyebilir
- Adminler tüm logları görüntüleyebilir

### rate_limits
- Kullanıcılar kendi rate limit durumlarını görüntüleyebilir
- Adminler tüm rate limit kayıtlarını görüntüleyebilir ve yönetebilir
- Sistem otomatik olarak rate limit kontrolü yapabilir

### security_metrics
- Sadece adminler metrik verilerini görüntüleyebilir
- Sistem otomatik olarak metrikleri güncelleyebilir

### Veri Maskeleme Politikaları
- Email ve telefon numaraları otomatik olarak maskelenir
- Sadece veri sahibi ve adminler maskelenmemiş verileri görebilir
- Maskeleme politikaları tüm sorgularda otomatik uygulanır

### Rate Limiting Politikaları
- Her endpoint için ayrı limit tanımlanabilir
- IP bazlı ve kullanıcı bazlı limitler uygulanır
- Limit aşımları otomatik olarak loglanır
- Tekrarlanan aşımlar için IP otomatik bloklanır

## Veritabanı Yapısı

### Auth Şemaları

#### auth.users
Supabase'in dahili auth.users tablosu kullanılır.

#### public.profiles

```sql
create table public.profiles (
  id uuid references auth.users(id) primary key,
  email text unique not null,
  first_name text,
  last_name text,
  phone_number text,
  avatar_url text,
  bio text,
  career_goals jsonb default '[]'::jsonb,
  skills jsonb default '[]'::jsonb,
  interests jsonb default '[]'::jsonb,
  education jsonb default '[]'::jsonb,
  experience jsonb default '[]'::jsonb,
  privacy_settings jsonb default '{
    "profile_visibility": "public",
    "email_visibility": "private",
    "phone_visibility": "private",
    "career_visibility": "public"
  }'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Politikaları
alter table public.profiles enable row level security;

-- Profil görüntüleme politikası
create policy "Profilleri herkes görüntüleyebilir"
  on public.profiles for select
  using (
    case 
      when privacy_settings->>'profile_visibility' = 'public' then true
      when privacy_settings->>'profile_visibility' = 'private' then auth.uid() = id
      else false
    end
  );

-- Profil güncelleme politikası
create policy "Kullanıcılar kendi profillerini güncelleyebilir"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Profil oluşturma politikası
create policy "Kullanıcılar kendi profillerini oluşturabilir"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Profil silme politikası
create policy "Kullanıcılar kendi profillerini silebilir"
  on public.profiles for delete
  using (auth.uid() = id);

-- Tetikleyiciler
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create trigger on_profiles_updated
  before update on public.profiles
  for each row
  execute procedure public.handle_updated_at();

-- Storage Bucket
insert into storage.buckets (id, name)
values ('avatars', 'avatars');

-- Storage RLS
create policy "Avatar yükleme politikası"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Avatar görüntüleme politikası"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Avatar silme politikası"
  on storage.objects for delete
  using (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

## Veri Tipleri

### Profile
```typescript
interface Profile {
  id: string;              // UUID
  email: string;           // Email adresi
  first_name?: string;     // Ad
  last_name?: string;      // Soyad
  phone_number?: string;   // Telefon numarası
  avatar_url?: string;     // Avatar URL
  bio?: string;           // Biyografi
  career_goals?: string[]; // Kariyer hedefleri
  skills?: string[];      // Yetenekler
  interests?: string[];   // İlgi alanları
  education?: Education[]; // Eğitim geçmişi
  experience?: Experience[]; // İş deneyimi
  privacy_settings: PrivacySettings; // Gizlilik ayarları
  created_at: Date;       // Oluşturulma tarihi
  updated_at: Date;       // Güncellenme tarihi
}

interface Education {
  institution: string;    // Kurum adı
  degree: string;        // Derece
  field_of_study: string; // Çalışma alanı
  start_date: string;    // Başlangıç tarihi
  end_date?: string;     // Bitiş tarihi
  description?: string;  // Açıklama
}

interface Experience {
  company: string;       // Şirket adı
  position: string;      // Pozisyon
  location?: string;     // Konum
  start_date: string;    // Başlangıç tarihi
  end_date?: string;     // Bitiş tarihi
  description?: string;  // Açıklama
}

interface PrivacySettings {
  profile_visibility: 'public' | 'private' | 'connections';
  email_visibility: 'public' | 'private' | 'connections';
  phone_visibility: 'public' | 'private' | 'connections';
  career_visibility: 'public' | 'private' | 'connections';
}

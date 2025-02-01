# Kimlik Doğrulama ve Yetkilendirme

Bu bölüm, Lola kariyer mentoru uygulamasının kimlik doğrulama ve yetkilendirme sistemini açıklar.

## İçerik

1. [Kullanıcı Kimlik Doğrulama Akışı](./auth_flow.md)
2. [Rol Tabanlı Erişim Kontrolü](./rbac.md)
3. [Güvenlik Politikaları](./security_policies.md)
4. [Oturum Yönetimi](./session_management.md)

## Veritabanı Tabloları

- `auth.users`: Supabase tarafından yönetilen ana kullanıcı tablosu
- `public.user_profiles`: Genişletilmiş kullanıcı profil bilgileri
- `public.user_roles`: Kullanıcı rolleri ve izinleri
- `public.user_sessions`: Oturum takibi ve güvenlik logları

## Güvenlik Özellikleri

- JWT tabanlı kimlik doğrulama
- Rol tabanlı erişim kontrolü (RBAC)
- İki faktörlü kimlik doğrulama (2FA)
- Oturum süresi ve yenileme politikaları
- Güvenli parola politikaları

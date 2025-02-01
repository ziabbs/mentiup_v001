# İzin Sistemi Kullanım Kılavuzu

## Frontend Kullanımı

### 1. İzin Hook'u
```typescript
// hooks/usePermission.ts
export const usePermission = () => {
  const { user } = useAuth();
  const { data: permissions } = useQuery(['permissions', user?.id], 
    () => supabase.rpc('get_user_permissions'));

  const hasPermission = (feature: string, action: string) => {
    if (!permissions) return false;
    return permissions[feature]?.includes(action) ?? false;
  };

  return { hasPermission };
};
```

### 2. Koruma Komponenti
```typescript
// components/PermissionGate.tsx
interface PermissionGateProps {
  feature: string;
  action: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGate = ({
  feature,
  action,
  fallback = null,
  children
}: PermissionGateProps) => {
  const { hasPermission } = usePermission();
  
  if (!hasPermission(feature, action)) {
    return fallback;
  }

  return children;
};
```

### 3. Kullanım Örnekleri

```tsx
// İçerik düzenleme butonu
<PermissionGate 
  feature="content" 
  action="write"
  fallback={<Tooltip content="Bu işlem için yetkiniz yok">
    <span><DisabledButton/></span>
  </Tooltip>}
>
  <Button onClick={handleEdit}>Düzenle</Button>
</PermissionGate>

// AI özelliklerini sınırlama
<PermissionGate 
  feature="ai" 
  action="advanced"
  fallback={<PremiumUpgradeCard />}
>
  <AIFeatures />
</PermissionGate>

// Moderasyon araçları
<PermissionGate 
  feature="chat" 
  action="moderate"
>
  <ModeratorTools />
</PermissionGate>
```

### 4. Erişilebilirlik ve SEO

```typescript
// components/AccessiblePermissionGate.tsx
export const AccessiblePermissionGate = ({
  feature,
  action,
  fallback = null,
  children,
  ariaLabel
}: PermissionGateProps & { ariaLabel?: string }) => {
  const { hasPermission } = usePermission();
  
  if (!hasPermission(feature, action)) {
    return (
      <div 
        role="alert" 
        aria-label={ariaLabel || `Bu özellik için ${action} izniniz yok`}
      >
        {fallback}
      </div>
    );
  }

  return children;
};
```

### 5. Mobil Uyumluluk

```tsx
// components/MobilePermissionCard.tsx
export const MobilePermissionCard = ({
  feature,
  action,
  title,
  description
}: {
  feature: string;
  action: string;
  title: string;
  description: string;
}) => {
  const { hasPermission } = usePermission();
  
  return (
    <div className="p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      
      {!hasPermission(feature, action) && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-red-500">
            Bu özellik için yetkiniz yok
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/upgrade')}
          >
            Premium'a Geç
          </Button>
        </div>
      )}
    </div>
  );
};
```

## Backend Kullanımı

### 1. RPC Fonksiyonu
```sql
CREATE OR REPLACE FUNCTION get_user_permissions(user_id UUID)
RETURNS JSONB AS $$
  SELECT permissions FROM roles r
  JOIN user_roles ur ON ur.role_id = r.id
  WHERE ur.user_id = user_id
  ORDER BY r.name = 'admin' DESC
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;
```

### 2. API Middleware
```typescript
// middleware/checkPermission.ts
export const checkPermission = (feature: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { data, error } = await supabase.rpc('check_user_permission', {
      user_id: req.user.id,
      feature,
      action
    });

    if (error || !data) {
      return res.status(403).json({
        error: 'Bu işlem için yetkiniz yok'
      });
    }

    next();
  };
};
```

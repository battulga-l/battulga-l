# Supabase API Keys Migration Guide

## Өөрчлөлтийн тухай

Supabase шинэ API key format нэвтрүүлж байна. Хуучин JWT format түлхүүрүүд ажиллах хэвээр байх ч шинэ format руу шилжихийг зөвлөж байна.

## API Key Formats

### Хуучин формат (Legacy JWT)

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGci..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGci..."
```

**Онцлог:**
- JWT (JSON Web Token) формат
- Header.Payload.Signature бүтэцтэй
- Expires хугацаатай (exp claim)
- Role-based (anon, service_role)

### Шинэ формат (Recommended)

```env
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."
SUPABASE_SECRET_KEY="sb_secret_..."
```

**Онцлог:**
- Илүү ойлгомжтой prefix (`sb_publishable_`, `sb_secret_`)
- Multiple secret keys үүсгэх боломжтой
- Secret key нь optional
- Disable/enable хийх боломжтой

## Харьцуулалт

| Feature | Legacy JWT | New Format |
|---------|-----------|------------|
| **Format** | JWT token | Prefixed string |
| **Client-side** | `anon` key | `publishable` key |
| **Server-side** | `service_role` key | `secret` key |
| **Multiple keys** | ❌ No | ✅ Yes (secret only) |
| **Revocable** | ❌ No | ✅ Yes |
| **Optional admin** | ❌ Required | ✅ Optional |
| **Migration period** | ✅ Supported | ✅ Supported |

## Migration хийх алхамууд

### 1. Одоогийн түлхүүрүүдээ шалгах

```bash
# Supabase dashboard руу нэвтрэх
https://app.supabase.com/project/YOUR_PROJECT_ID/settings/api

# Settings → API хэсэгт шинэ түлхүүрүүд харагдана
```

### 2. Шинэ түлхүүрүүд үүсгэх

**Publishable key** (automatic):
- Supabase автоматаар үүсгэсэн байх
- Project settings дээр харагдана
- `sb_publishable_` prefix-тэй

**Secret key** (optional):
- "Create secret key" товч дарах
- Нэр өгөх (жишээ: "production", "staging")
- Copy хийх (дахиад харагдахгүй!)

### 3. Environment variables шинэчлэх

**Development (.env.local)**:
```env
# Хуучин түлхүүрүүдийг comment хийх
# NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGci..."
# SUPABASE_SERVICE_ROLE_KEY="eyJhbGci..."

# Шинэ түлхүүрүүд нэмэх
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."
SUPABASE_SECRET_KEY="sb_secret_..."  # Хэрэгтэй бол
```

**Production (Vercel/Azure)**:
1. Dashboard руу нэвтрэх
2. Environment Variables хэсэгт очих
3. Шинэ түлхүүрүүд нэмэх
4. Redeploy хийх

### 4. Кодоо шинэчлэх

**packages/config/src/env.ts**:

```typescript
// Хоёр форматыг дэмжих
const envSchema = z.object({
  // ... бусад env vars
  
  // Supabase - хоёр формат дэмжинэ
  supabase: z.object({
    url: z.string().url(),
    
    // Publishable key (шинэ) эсвэл anon key (хуучин)
    publishableKey: z.string()
      .optional()
      .transform((val) => val || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    
    // Secret key (шинэ) эсвэл service role key (хуучин)  
    secretKey: z.string()
      .optional()
      .transform((val) => val || process.env.SUPABASE_SERVICE_ROLE_KEY),
  }),
});

// Helper function
export function getSupabaseKeys() {
  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    key: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
         env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    adminKey: env.SUPABASE_SECRET_KEY || 
              env.SUPABASE_SERVICE_ROLE_KEY,
  };
}
```

**apps/web/src/lib/supabase.ts**:

```typescript
import { createClient } from '@supabase/supabase-js';
import { getSupabaseKeys } from '@edu-sphere/config';

const { url, key, adminKey } = getSupabaseKeys();

// Client-side
export const supabase = createClient(url, key);

// Server-side (admin)
export const supabaseAdmin = createClient(url, adminKey);
```

### 5. Тестлэх

```bash
# Local development тест
npm run dev

# Build тест
npm run build

# Production deploy
git push origin main
```

### 6. Хуучин түлхүүрүүдийг disable хийх (optional)

Шинэ түлхүүрүүд амжилттай ажиллаж байвал:

1. Supabase dashboard → Settings → API
2. Legacy keys хэсэгт очих
3. "Disable" товч дарах
4. Хэрэв асуудал гарвал "Enable" дарж буцааж болно

## Migration timeline

### Phase 1: Transition (2-4 долоо хоног)

- ✅ Хоёр формат хамтад ажиллана
- ✅ Хуучин түлхүүрүүд идэвхтэй
- ✅ Шинэ түлхүүрүүд тестлэх

### Phase 2: Migration (1 сар)

- 🔄 Бүх environment шинэ түлхүүр рүү шилжих
- 🔄 Production дээр тестлэх
- 🔄 Monitoring хийх

### Phase 3: Complete (2-3 сарын дараа)

- ✅ Хуучин түлхүүрүүдийг disable хийх
- ✅ Code cleanup (хуучин түлхүүр лавлалт устгах)
- ✅ Documentation шинэчлэх

## Давуу тал

### 1. Security сайжруулалт

- **Revocable keys**: Түлхүүр алдагдсан тохиолдолд хурдан disable хийж болно
- **Multiple secrets**: Өөр өөр үйлчилгээнд өөр түлхүүр ашиглах
- **Granular control**: Secret key хэрэггүй бол үүсгэхгүй байж болно

### 2. Key management

```bash
# Олон secret key-тэй ажиллах
SUPABASE_SECRET_KEY_PRODUCTION="sb_secret_prod_..."
SUPABASE_SECRET_KEY_STAGING="sb_secret_staging_..."
SUPABASE_SECRET_KEY_BACKUP="sb_secret_backup_..."
```

### 3. Monitoring

Supabase dashboard дээр:
- API key usage statistics харах
- Unusual activity илрүүлэх
- Key rotation timeline хянах

## Common Issues

### Issue 1: "Invalid API key" error

**Шийдэл:**
```env
# Түлхүүр зөв copy хийгдсэн эсэхийг шалгах
# Space эсвэл newline оруулаагүй эсэхийг шалгах
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."  # Quotes-ын дотор
```

### Issue 2: Environment variable танигдахгүй байна

**Шийдэл:**
```bash
# Development server дахин эхлүүлэх
npm run dev

# Vercel дээр redeploy хийх
vercel --prod
```

### Issue 3: "Insufficient permissions" error

**Шийдэл:**
```typescript
// Admin операц хийхдээ secret key ашиглах
import { supabaseAdmin } from '@/lib/supabase';

// ❌ Буруу
const { data } = await supabase.from('tbl_users').delete();

// ✅ Зөв
const { data } = await supabaseAdmin.from('tbl_users').delete();
```

## Best Practices

### 1. Түлхүүр хадгалах

```bash
# ❌ Git commit хийхгүй
git add .env.local

# ✅ .gitignore дээр байгаа эсэхийг шалгах
cat .gitignore | grep .env.local

# ✅ Password manager ашиглах
# - 1Password
# - LastPass
# - Bitwarden
```

### 2. Key rotation

```bash
# Жилд 1 удаа эсвэл:
# - Team member явах үед
# - Security incident үед
# - Major deployment-ийн өмнө

# Old key disable → New key үүсгэх → Update everywhere → Test → Delete old
```

### 3. Environment-specific keys

```typescript
// Development
const keys = {
  dev: 'sb_publishable_dev_...',
  staging: 'sb_publishable_staging_...',
  prod: 'sb_publishable_prod_...',
};

// Automatic selection
const key = process.env.NODE_ENV === 'production' 
  ? keys.prod 
  : keys.dev;
```

## Resources

- [Supabase API Keys Docs](https://supabase.com/docs/guides/api/api-keys)
- [Migration Announcement](https://supabase.com/blog/api-key-changes)
- [Security Best Practices](https://supabase.com/docs/guides/platform/going-into-prod)

## Support

Асуудал гарвал:
- 📧 Email: support@edusphere.mn
- 💬 Supabase Discord: https://discord.supabase.com
- 📚 Documentation: https://supabase.com/docs

---

**Last Updated**: November 29, 2025
**Status**: Migration in progress

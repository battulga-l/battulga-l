# Production Deployment Guide

EduSphere-ийг production орчинд deploy хийх заавар.

## Шаардлагатай зүйлс

### 1. Supabase Project
1. [supabase.com](https://supabase.com) дээр бүртгүүлэх
2. Шинэ project үүсгэх
3. Database connection string авах
4. API keys авах (anon key, service role key)

### 2. Vercel Account
1. [vercel.com](https://vercel.com) дээр бүртгүүлэх
2. GitHub repository холбох
3. Environment variables тохируулах

### 3. OpenAI API Key
1. [platform.openai.com](https://platform.openai.com) дээр бүртгүүлэх
2. API key үүсгэх
3. Usage limits тохируулах

## Deployment Steps

### 1. Database Setup

```bash
# Prisma generate
cd packages/database
npx prisma generate

# Push schema to Supabase
npx prisma db push

# Optional: Seed initial data
npx prisma db seed
```

### 2. Environment Variables

Vercel дээр дараах environment variables-уудыг тохируулах:

```env
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# OpenAI
OPENAI_API_KEY=sk-...

# App URLs (production)
NEXT_PUBLIC_APP_URL=https://edusphere.mn
NEXT_PUBLIC_API_URL=https://edusphere.mn/api

# Feature Flags (production)
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_VIDEO_CALLS=false
NEXT_PUBLIC_ENABLE_MOBILE_APP=false
```

### 3. Vercel Deployment

#### Option A: Automatic (GitHub Integration)

1. Vercel дээр "New Project" дарах
2. GitHub repository сонгох
3. Build settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && npx turbo run build --filter=web`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. Environment variables оруулах
5. Deploy дарах

#### Option B: Manual (CLI)

```bash
# Vercel CLI суулгах
npm install -g vercel

# Login
vercel login

# Deploy
cd apps/web
vercel --prod
```

### 4. Domain Setup

1. Vercel Settings → Domains
2. Custom domain нэмэх (edusphere.mn)
3. DNS records тохируулах:
   ```
   A     @     76.76.21.21
   CNAME www   cname.vercel-dns.com
   ```

### 5. Cloudflare Setup (Optional)

1. Domain Cloudflare руу шилжүүлэх
2. SSL/TLS → Full (strict)
3. Speed → Optimization → Enable
4. Page Rules үүсгэх

### 6. Database Migrations

Production database-д migration хийх:

```bash
# Migration үүсгэх
cd packages/database
npx prisma migrate dev --name init

# Production-д apply хийх
DATABASE_URL="production-url" npx prisma migrate deploy
```

### 7. Post-Deployment Checklist

- [ ] Website нээгдэж байгаа эсэх
- [ ] Database холболт ажиллаж байгаа эсэх
- [ ] Authentication ажиллаж байгаа эсэх
- [ ] API endpoints ажиллаж байгаа эсэх
- [ ] Error logging идэвхтэй эсэх
- [ ] SSL certificate идэвхтэй эсэх
- [ ] Security headers тохируулагдсан эсэх

## Monitoring & Maintenance

### 1. Vercel Analytics

```bash
# Vercel Analytics-ийг идэвхжүүлэх
npm install @vercel/analytics
```

```typescript
// apps/web/src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### 3. Database Backups

Supabase Dashboard → Settings → Backups
- Daily automatic backups идэвхжүүлэх
- Manual backup хийх боломжтой

### 4. Performance Monitoring

- Vercel Analytics дээр хандах
- Core Web Vitals шалгах
- Lighthouse score шалгах

### 5. Security Updates

```bash
# Dependencies шинэчлэх
npm audit
npm update

# Security vulnerabilities засах
npm audit fix
```

## Rollback Process

Алдаа гарвал өмнөх version руу буцаах:

1. Vercel Dashboard → Deployments
2. Previous deployment сонгох
3. "Promote to Production" дарах

## CI/CD Pipeline

GitHub Actions автоматаар ажиллана:

```yaml
# .github/workflows/deploy-production.yml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Scaling Considerations

### Database
- Supabase Pro plan руу шилжих (Connection pooling)
- Read replicas нэмэх
- Indexes optimize хийх

### Application
- Vercel Pro plan (дээд хурд, илүү bandwidth)
- Edge functions ашиглах
- Redis cache нэмэх

### CDN
- Cloudflare Pro plan
- Static assets-ыг edge-д cache хийх

## Хэрэглэгчдийн тусламж

- **Documentation**: https://docs.edusphere.mn
- **Support Email**: support@edusphere.mn
- **Status Page**: https://status.edusphere.mn

## Backup & Disaster Recovery

1. **Database**: Daily automatic backups (Supabase)
2. **Code**: GitHub repository (version control)
3. **Environment Variables**: Secure notes (1Password/Bitwarden)
4. **Recovery Time Objective (RTO)**: < 1 hour
5. **Recovery Point Objective (RPO)**: < 24 hours

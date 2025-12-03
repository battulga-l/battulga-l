# GitHub Actions Workflows

Төслийн CI/CD автоматжуулалт.

## Workflows

### 1. CI Pipeline (.github/workflows/ci.yml)
- Код шалгалт (lint, typecheck)
- Тест ажиллуулалт
- Build шалгалт

### 2. Deploy Production (.github/workflows/deploy-production.yml)
- Main branch руу merge хийхэд автоматаар Vercel дээр deploy
- Database migration

### 3. Deploy Preview (.github/workflows/deploy-preview.yml)
- Pull request үүсгэхэд preview environment үүсгэх

## Setup

1. GitHub Secrets тохируулах:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
   - `SUPABASE_ACCESS_TOKEN`
   - `DATABASE_URL`

2. Supabase CI/CD тохируулах
3. Vercel integration холбох

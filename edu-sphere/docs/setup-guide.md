# Development Setup Guide

## Системийн шаардлага

- **Node.js**: 18.0.0 эсвэл түүнээс дээш
- **npm**: 9.0.0 эсвэл түүнээс дээш
- **Git**: Latest version
- **Code Editor**: VS Code (санал болгох)

## Local Development Setup

### 1. Repository татаж авах

```bash
git clone https://github.com/battulga-l/edu-sphere.git
cd edu-sphere
```

### 2. Dependencies суулгах

```bash
# Root directory дээр
npm install

# Бүх packages-д dependencies суулгана
```

### 3. Environment Variables тохируулах

```bash
# .env.example файлыг .env.local руу хуулах
cp .env.example .env.local

# .env.local файлд өөрийн credentials оруулах
```

### 4. Database тохируулах

#### Option A: Supabase Cloud (Санал болгох)

1. [supabase.com](https://supabase.com) дээр account үүсгэх
2. Шинэ project үүсгэх
3. Database connection string авах
4. `.env.local` файлд оруулах:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"
```

#### Option B: Local PostgreSQL

```bash
# PostgreSQL суулгах (macOS)
brew install postgresql@15
brew services start postgresql@15

# Database үүсгэх
createdb edusphere_dev

# .env.local
DATABASE_URL="postgresql://localhost:5432/edusphere_dev"
DIRECT_URL="postgresql://localhost:5432/edusphere_dev"
```

### 5. Prisma Setup

```bash
cd packages/database

# Prisma client generate хийх
npx prisma generate

# Database schema apply хийх
npx prisma db push

# Prisma Studio нээх (optional)
npx prisma studio
```

### 6. Development Server ажиллуулах

```bash
# Root directory дээр буцаж ирэх
cd ../..

# Development server эхлүүлэх
npm run dev

# Browser дээр нээх: http://localhost:3000
```

## VS Code Extensions

Төслийн ажлыг хөнгөвчлөх extensions:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

`.vscode/extensions.json` файлд энийг хадгална.

## VS Code Settings

`.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## Scripts

### Development

```bash
# All apps эхлүүлэх
npm run dev

# Specific app эхлүүлэх
npm run dev --filter=web

# Type checking
npm run typecheck

# Linting
npm run lint

# Format code
npm run format
```

### Database

```bash
# Prisma Studio нээх
npm run db:studio

# Migration үүсгэх
npm run db:migrate

# Database reset
npx prisma migrate reset
```

### Testing

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Build

```bash
# Production build
npm run build

# Build specific app
npm run build --filter=web
```

## Project Structure

```
edu-sphere/
├── apps/
│   └── web/                    # Next.js web application
│       ├── src/
│       │   ├── app/           # Next.js App Router
│       │   ├── components/    # React components
│       │   ├── lib/          # Utilities, helpers
│       │   └── contexts/     # React contexts
│       ├── public/           # Static files
│       └── package.json
│
├── packages/
│   ├── database/             # Prisma schema & client
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── src/
│   │
│   ├── config/              # Shared configuration
│   │   └── src/
│   │       ├── constants.ts  # Constants, enums
│   │       ├── env.ts       # Environment validation
│   │       └── errors.ts    # Error classes
│   │
│   └── ui/                  # Shared UI components (future)
│
├── docs/                    # Documentation
│   ├── README.md
│   ├── architecture.md
│   ├── database-schema.md
│   ├── naming-convention.md
│   └── deployment-guide.md
│
├── .github/                 # GitHub Actions
│   └── workflows/
│
├── package.json            # Root package.json (workspace)
├── turbo.json             # Turborepo config
├── tsconfig.json          # TypeScript config
└── README.md              # Project README
```

## Common Issues & Solutions

### Issue: Port already in use

```bash
# Port 3000 busy байвал
lsof -ti:3000 | xargs kill -9

# Эсвэл өөр port ашиглах
PORT=3001 npm run dev
```

### Issue: Prisma generate failed

```bash
# node_modules устгаж дахин суулгах
rm -rf node_modules
npm install
cd packages/database
npx prisma generate
```

### Issue: TypeScript errors

```bash
# TypeScript cache цэвэрлэх
rm -rf **/*.tsbuildinfo
npm run typecheck
```

### Issue: Environment variables not loading

- `.env.local` файл байгаа эсэхийг шалгах
- Next.js server дахин ажиллуулах (Ctrl+C, npm run dev)
- `NEXT_PUBLIC_` prefix зөв байгаа эсэхийг шалгах

## Development Workflow

### 1. Feature Development

```bash
# Feature branch үүсгэх
git checkout -b feature/new-feature

# Code өөрчлөлт хийх
# ...

# Commit хийх (conventional commits)
git commit -m "feat: add new feature"

# Push хийх
git push origin feature/new-feature

# Pull Request үүсгэх GitHub дээр
```

### 2. Before Committing

```bash
# Lint check
npm run lint

# Type check
npm run typecheck

# Test
npm run test

# Build check
npm run build
```

### 3. Code Review Process

1. Pull Request үүсгэх
2. CI/CD checks pass болох хүртэл хүлээх
3. Review хүсэх
4. Approve болсны дараа merge хийх

## Additional Tools

### Database Management

- **Prisma Studio**: Visual database editor
  ```bash
  npm run db:studio
  ```

- **pgAdmin**: PostgreSQL GUI client
  - Download: https://www.pgadmin.org/

### API Testing

- **Postman**: API testing tool
- **Thunder Client**: VS Code extension
- **curl**: Command line tool

### Debugging

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

## Getting Help

- 📖 [Documentation](./README.md)
- 🐛 [GitHub Issues](https://github.com/battulga-l/edu-sphere/issues)
- 💬 [Discussions](https://github.com/battulga-l/edu-sphere/discussions)
- 📧 [Email Support](mailto:support@edusphere.mn)

## Next Steps

1. ✅ Setup бүрдүүлэх
2. 📚 [Architecture docs](./architecture.md) унших
3. 🗄️ [Database schema](./database-schema.md) судлах
4. 🎨 [Naming conventions](./naming-convention.md) дагаж ажиллах
5. 🚀 Feature хөгжүүлэх эхлэх!

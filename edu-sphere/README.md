# EduSphere - Cloud Solutions for Educational Institutions

## Төслийн тодорхойлолт

EduSphere нь боловсролын салбарын сургалтын байгууллагуудад зориулсан cloud шийдэлд суурилсан систем бөгөөд School Management System (SMS), Learning Management System (LMS) болон бусад холбогдох үйлчилгээг агуулна.

## Технологийн стек

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Context / Zustand
- **Form Handling**: React Hook Form + Zod

### Backend
- **BaaS**: Supabase (PostgreSQL, Authentication, Storage)
- **ORM**: Prisma
- **API**: Next.js API Routes / tRPC
- **AI Integration**: OpenAI API

### Infrastructure
- **Hosting**: Vercel (Frontend), Azure (Backend Services)
- **CDN**: Cloudflare
- **CI/CD**: GitHub Actions
- **Database**: PostgreSQL (Supabase)

## Төслийн зорилго

- Боловсролын байгууллагуудад зориулсан орчин үеийн, уян хатан cloud шийдэл бий болгох
- Сургалтын менежмент болон сургуулийн үйл ажиллагааг автоматжуулах
- Хэрэглэгчийн туршлагыг сайжруулах

## Үйлчилгээний хүрээ

1. ✅ Системийн дизайн ба хөгжүүлэлт
2. ✅ Cloud суурилсан платформын нэвтрүүлэлт
3. ✅ Сургалтын менежментийн систем (LMS) интеграцчилал
4. ✅ Сургуулийн менежментийн систем (SMS) интеграцчилал
5. ✅ Хэрэглэгчийн сургалт ба дэмжлэг

## Функциональ шинж чанарууд

### 1. Хэрэглэгчийн удирдлага
- Multi-tenant архитектур
- Role-based access control (RBAC)
- Суралцагч, багш, админ, эцэг эх зэрэг дүрүүд
- OAuth 2.0 / SSO дэмжлэг

### 2. Сургалтын хөтөлбөр ба агуулга
- Хичээлийн хөтөлбөр менежмент
- Контент менежмент (видео, баримт бичиг, интерактив контент)
- Даалгавар ба тест үүсгэх
- AI-assisted контент үүсгэлт

### 3. Үнэлгээ ба дүнгийн менежмент
- Автомат үнэлгээ
- Прогресс tracking
- Тайлан үүсгэлт
- Дүн шинжилгээ ба visualization

### 4. Харилцаа холбоо
- Real-time мэдэгдлэл
- Чат систем
- Имэйл интеграцчилал
- Эцэг эх-багш харилцаа

### 5. Тайлан ба дүн шинжилгээ
- Dashboard бүхий админ панел
- Суралцагчийн гүйцэтгэл analytics
- Байгууллагын түвшний тайлан
- Дата export ба API

## Төслийн үе шат

### Phase 1: MVP (Сургуулийн өмнөх боловсрол)
- 🎯 Target: 2 сургалтын байгууллага
- ⏱️ Timeline: 3-4 сар
- 📦 Features: Үндсэн SMS + LMS функцууд

### Phase 2: Ерөнхий боловсролын сургуулиуд
- 📈 Scalability сайжруулалт
- 🎓 Ахисан түвшний LMS функцууд

### Phase 3: Дээд боловсролын байгууллагууд
- 🏫 Multi-campus дэмжлэг
- 📊 Advanced analytics

### Phase 4: Мэргэжлийн сургалтын төвүүд
- 🎖️ Сертификат менежмент
- 💼 Career tracking

## Аюулгүй байдал ба нийцэл

- 🔐 GDPR compliant
- 🔒 End-to-end encryption
- 🛡️ Regular security audits
- 📜 Data privacy controls
- 🔑 Multi-factor authentication

## 🚀 Quick Start

### Дэлгэрэнгүй заавар

- **Development Setup**: [docs/setup-guide.md](./docs/setup-guide.md)
- **Production Deployment**: [docs/deployment-guide.md](./docs/deployment-guide.md)
- **Production Checklist**: [PRODUCTION-CHECKLIST.md](./PRODUCTION-CHECKLIST.md)
- **Naming Conventions**: [docs/naming-convention.md](./docs/naming-convention.md)

### Хурдан эхлүүлэх

```bash
# 1. Repository татаж авах
git clone https://github.com/battulga-l/edu-sphere.git
cd edu-sphere

# 2. Dependencies суулгах
npm install

# 3. Environment variables тохируулах
cp .env.example .env.local
# .env.local файлд credentials оруулах

# 4. Database тохируулах
cd packages/database
npx prisma generate
npx prisma db push
cd ../..

# 5. Development server ажиллуулах
npm run dev

# Browser: http://localhost:3000
```

## 📦 Төслийн бүтэц

```
edu-sphere/
├── apps/
│   └── web/              # Main Next.js application
├── packages/
│   ├── database/         # Prisma schema with naming conventions
│   │   └── schema.prisma # All tables with tbl_ prefix
│   └── config/           # Shared constants, errors, env validation
│       ├── constants.ts  # Enums & types
│       ├── errors.ts     # Custom error classes
│       └── env.ts        # Environment validation
├── docs/
│   ├── architecture.md      # System architecture
│   ├── database-schema.md   # Database documentation
│   ├── naming-convention.md # Naming standards
│   ├── setup-guide.md       # Development setup
│   └── deployment-guide.md  # Production deployment
├── .vscode/                 # VS Code configuration
└── PRODUCTION-CHECKLIST.md  # Pre-launch checklist
```

## ✅ Production-Ready Features

### Naming Convention
- **Database**: `tbl_` prefix, `snake_case` columns
- **Views**: `vw_` prefix
- **Functions**: `fn_` prefix  
- **Procedures**: `prc_` prefix
- **TypeScript**: camelCase, PascalCase, UPPER_SNAKE_CASE

### Error Handling
- Custom error classes hierarchy
- Structured error responses
- Mongolian error messages
- API error middleware

### Security
- Security headers configured
- Input validation with Zod
- Rate limiting on API routes
- Authentication & authorization
- SQL injection protection (Prisma ORM)

### Performance
- Code splitting & lazy loading
- Next.js Image optimization
- Webpack optimization
- Database indexes

### Testing
- Jest + React Testing Library
- Unit test examples
- Test utilities

### Logging & Monitoring
- Multi-level logging system
- Request/response logging
- Error tracking ready (Sentry)

### Documentation
- Comprehensive setup guide
- Production deployment guide
- Naming convention standards
- Architecture documentation
- Production checklist

## Contributing

Төсөлд хувь нэмэр оруулахыг хүсвэл [CONTRIBUTING.md](./CONTRIBUTING.md) уншина уу.

## License

MIT License - [LICENSE](./LICENSE) файл үзнэ үү.

## Холбоо барих

- 📧 Email: support@edusphere.mn
- 🌐 Website: https://edusphere.mn
- 💬 Support: https://support.edusphere.mn

---

**Built with ❤️ for Mongolian Educational Institutions**

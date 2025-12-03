# Naming Convention Guide

## Ерөнхий зарчим

EduSphere төсөл нь стандартчилсан naming convention-г бүх түвшинд дагана.

## Database Level

### Хүснэгтийн нэрс (Tables)
- **Prefix**: `tbl_`
- **Format**: `tbl_<entity_name_plural>` (snake_case)
- **Жишээ**:
  - `tbl_organizations`
  - `tbl_users`
  - `tbl_courses`
  - `tbl_classes`

### View-ийн нэрс (Views)
- **Prefix**: `vw_`
- **Format**: `vw_<descriptive_name>` (snake_case)
- **Жишээ**:
  - `vw_active_students`
  - `vw_course_enrollment_stats`
  - `vw_student_grades`

### Function-ий нэрс (Functions)
- **Prefix**: `fn_`
- **Format**: `fn_<action_description>` (snake_case)
- **Жишээ**:
  - `fn_calculate_grade_average`
  - `fn_get_user_permissions`
  - `fn_validate_enrollment`

### Stored Procedure-ийн нэрс (Procedures)
- **Prefix**: `prc_`
- **Format**: `prc_<action_description>` (snake_case)
- **Жишээ**:
  - `prc_enroll_student`
  - `prc_generate_report`
  - `prc_bulk_import_users`

### Баганын нэрс (Columns)
- **Format**: `snake_case` (жижиг үсэг, доогуур зураастай)
- **Жишээ**:
  - `first_name`
  - `created_at`
  - `subscription_plan`
  - `is_published`

### Index нэрс
- **Format**: `idx_<table>_<column(s)>`
- **Жишээ**:
  - `idx_users_email`
  - `idx_courses_organization_id`
  - `idx_enrollments_user_status`

### Constraint нэрс
- **Primary Key**: `pk_<table>`
- **Foreign Key**: `fk_<table>_<referenced_table>`
- **Unique**: `uq_<table>_<column(s)>`
- **Check**: `chk_<table>_<condition>`

**Жишээ**:
- `pk_tbl_users`
- `fk_tbl_users_tbl_organizations`
- `uq_tbl_users_email`
- `chk_tbl_users_age`

## TypeScript/JavaScript Level

### Файлын нэрс
- **Components**: `PascalCase.tsx`
  - `UserProfile.tsx`
  - `CourseCard.tsx`
  
- **Utilities**: `camelCase.ts`
  - `dateFormatter.ts`
  - `apiClient.ts`
  
- **Types**: `PascalCase.types.ts`
  - `User.types.ts`
  - `Course.types.ts`
  
- **Constants**: `UPPER_SNAKE_CASE.ts`
  - `API_ENDPOINTS.ts`
  - `ERROR_MESSAGES.ts`

### Хувьсагчийн нэрс

#### Variables & Functions
```typescript
// camelCase
const userName = 'John';
const isActive = true;

function getUserProfile() {}
function calculateTotalScore() {}
```

#### Constants
```typescript
// UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 10485760;
const API_BASE_URL = 'https://api.edusphere.mn';
const DEFAULT_LANGUAGE = 'mn';
```

#### Classes & Interfaces
```typescript
// PascalCase
class UserService {}
class CourseRepository {}

interface IUser {}
interface ICourse {}
type UserRole = 'admin' | 'teacher' | 'student';
```

#### React Components
```typescript
// PascalCase
export function UserProfileCard() {}
export const CourseList = () => {};
```

#### Hooks
```typescript
// camelCase with 'use' prefix
function useAuth() {}
function useCourseData() {}
function useDebounce() {}
```

### Type нэрс
```typescript
// PascalCase with descriptive suffix
type UserProps = {};
type CourseData = {};
type ApiResponse<T> = {};

// Interface: 'I' prefix эсвэл prefix-гүй
interface IUser {}
interface User {} // Энийг илүүд үздэг

// Enum: PascalCase
enum UserRole {
  SuperAdmin = 'super_admin',
  Admin = 'admin',
  Teacher = 'teacher',
  Student = 'student',
}

enum CourseStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived',
}
```

## API Level

### Route нэрс
- **Format**: `kebab-case`
- **REST principles**
```
/api/organizations
/api/users
/api/courses
/api/courses/:id/lessons
/api/assessments/:id/submissions
```

### Query Parameters
- **Format**: `snake_case`
```
/api/courses?page_size=20&sort_by=created_at&order=desc
/api/users?organization_id=xxx&role=teacher
```

### JSON Response Keys
- **Format**: `camelCase` (JavaScript стандарт)
```json
{
  "userId": "123",
  "firstName": "John",
  "createdAt": "2024-11-29T00:00:00Z",
  "enrolledCourses": []
}
```

## Folder Structure

```
src/
├── components/          # React components (PascalCase)
│   ├── common/
│   ├── features/
│   └── layouts/
├── lib/                 # Utilities (camelCase)
│   ├── utils/
│   ├── helpers/
│   └── validators/
├── types/              # Type definitions (PascalCase.types.ts)
├── constants/          # Constants (UPPER_SNAKE_CASE.ts)
├── hooks/              # Custom hooks (use*.ts)
├── services/           # API services (camelCase)
├── store/              # State management
└── app/                # Next.js app router (kebab-case)
```

## Git Commit Messages

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: Шинэ функц
- `fix`: Bug засвар
- `docs`: Документ өөрчлөлт
- `style`: Код форматлах (logic өөрчлөлтгүй)
- `refactor`: Code refactoring
- `test`: Test нэмэх/өөрчлөх
- `chore`: Build процесс, dependencies

### Жишээ
```
feat(auth): add password reset functionality

Implemented password reset flow with email verification.
Users can now reset their password using email link.

Closes #123
```

## Environment Variables

### Format: `UPPER_SNAKE_CASE`
```env
# Database
DATABASE_URL=
DIRECT_URL=

# API Keys
OPENAI_API_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App Config
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_API_URL=
```

### Prefix Conventions
- `NEXT_PUBLIC_`: Client-side хандах боломжтой
- Prefix-гүй: Server-side only

## CSS/Tailwind Classes

### Custom CSS Classes: `kebab-case`
```css
.user-profile-card {}
.course-list-item {}
.nav-menu-item {}
```

### BEM Methodology (Optional)
```css
.card {}
.card__header {}
.card__body {}
.card--featured {}
```

## Test Files

### Format: `<filename>.test.ts` эсвэл `<filename>.spec.ts`
```
userService.test.ts
CourseCard.test.tsx
apiClient.spec.ts
```

### Test Suites & Cases
```typescript
describe('UserService', () => {
  describe('getUserById', () => {
    it('should return user when found', () => {});
    it('should throw error when not found', () => {});
  });
});
```

## Documentation Files

- **README**: `README.md` (project root)
- **Guides**: `kebab-case.md`
  - `setup-guide.md`
  - `deployment-guide.md`
  - `api-documentation.md`

## Дүгнэлт

| Зүйл | Convention | Жишээ |
|------|------------|-------|
| Database Tables | `tbl_snake_case` | `tbl_users` |
| Database Views | `vw_snake_case` | `vw_active_students` |
| Database Functions | `fn_snake_case` | `fn_calculate_grade` |
| Database Procedures | `prc_snake_case` | `prc_enroll_student` |
| Columns | `snake_case` | `first_name` |
| TypeScript Variables | `camelCase` | `userName` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_FILE_SIZE` |
| Classes/Interfaces | `PascalCase` | `UserService` |
| Components | `PascalCase` | `UserProfile` |
| Files (utility) | `camelCase.ts` | `dateFormatter.ts` |
| Files (component) | `PascalCase.tsx` | `UserCard.tsx` |
| API Routes | `kebab-case` | `/api/users` |
| Folders | `kebab-case` | `user-profile/` |

Эдгээр стандартыг дагаснаар код уншихад хялбар, засварлахад хялбар болно.

# Database Schema

EduSphere системийн өгөгдлийн сангийн бүтэц. PostgreSQL ашиглан Supabase дээр хэрэгжсэн.

## Үндсэн зарчим

- Multi-tenant архитектур (байгууллага бүр `organization_id`-аар ялгагдана)
- Row Level Security (RLS) ашиглан tenant тусгаарлалт
- UUID primary keys
- Timestamps (created_at, updated_at)
- Soft deletes (deleted_at)

## ERD Диаграм

```
┌─────────────────┐         ┌──────────────────┐
│ Organizations   │────────<│ Users            │
│                 │         │                  │
│ - id (PK)      │         │ - id (PK)        │
│ - name         │         │ - org_id (FK)    │
│ - type         │         │ - role           │
│ - status       │         │ - email          │
└────────┬────────┘         └────────┬─────────┘
         │                           │
         │                           │
         │        ┌──────────────────┴─────────┐
         │        │                            │
         └────────>┌─────────────┐      ┌──────────────┐
                  │ Courses     │      │ Classes      │
                  │             │      │              │
                  │ - id (PK)   │──────│ - id (PK)    │
                  │ - org_id    │      │ - course_id  │
                  └──────┬──────┘      └──────┬───────┘
                         │                    │
                         │                    │
                  ┌──────┴──────┐      ┌──────┴───────┐
                  │ Lessons     │      │ Enrollments  │
                  │             │      │              │
                  │ - id (PK)   │      │ - id (PK)    │
                  │ - course_id │      │ - class_id   │
                  └──────┬──────┘      │ - user_id    │
                         │             └──────────────┘
                         │
                  ┌──────┴──────┐
                  │ Assessments │
                  │             │
                  │ - id (PK)   │
                  │ - lesson_id │
                  └─────────────┘
```

## Хүснэгтүүд

### 1. Organizations (Байгууллага)

Сургалтын байгууллагууд.

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'preschool', 'school', 'university', 'training_center'
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'suspended'
  settings JSONB,
  subscription_plan VARCHAR(50) DEFAULT 'free',
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_type ON organizations(type);
```

### 2. Users (Хэрэглэгч)

Системийн бүх хэрэглэгчид.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'super_admin', 'admin', 'teacher', 'student', 'parent'
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  phone VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(10),
  address TEXT,
  status VARCHAR(20) DEFAULT 'active',
  settings JSONB,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### 3. Courses (Хичээл)

Сургалтын хөтөлбөрүүд.

```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  category VARCHAR(100),
  level VARCHAR(50), -- 'beginner', 'intermediate', 'advanced'
  language VARCHAR(10) DEFAULT 'mn',
  duration_hours INTEGER,
  price DECIMAL(10,2) DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  instructor_id UUID REFERENCES users(id),
  settings JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(organization_id, slug)
);

CREATE INDEX idx_courses_organization ON courses(organization_id);
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_category ON courses(category);
```

### 4. Classes (Анги)

Хичээлийн ангиуд (физик анги эсвэл группүүд).

```sql
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  course_id UUID REFERENCES courses(id),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  academic_year VARCHAR(20),
  semester VARCHAR(20),
  start_date DATE,
  end_date DATE,
  schedule JSONB, -- { "monday": ["9:00-10:30"], ... }
  max_students INTEGER,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_classes_organization ON classes(organization_id);
CREATE INDEX idx_classes_course ON classes(course_id);
```

### 5. Enrollments (Элсэлт)

Суралцагчдын анги/хичээлд элссэн мэдээлэл.

```sql
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES classes(id),
  user_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'dropped', 'suspended'
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  progress INTEGER DEFAULT 0, -- 0-100
  grade DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_id, user_id)
);

CREATE INDEX idx_enrollments_class ON enrollments(class_id);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
```

### 6. Lessons (Хичээлийн контент)

Хичээлийн агуулга, модулиуд.

```sql
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id),
  parent_id UUID REFERENCES lessons(id), -- for nested structure
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  content_type VARCHAR(50), -- 'video', 'text', 'quiz', 'assignment'
  order_index INTEGER,
  duration_minutes INTEGER,
  is_free BOOLEAN DEFAULT false,
  resources JSONB, -- files, links, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_lessons_course ON lessons(course_id);
CREATE INDEX idx_lessons_parent ON lessons(parent_id);
CREATE INDEX idx_lessons_order ON lessons(course_id, order_index);
```

### 7. Assessments (Үнэлгээ)

Даалгавар, шалгалтууд.

```sql
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50), -- 'quiz', 'assignment', 'exam', 'project'
  total_points DECIMAL(10,2),
  passing_score DECIMAL(10,2),
  time_limit_minutes INTEGER,
  attempts_allowed INTEGER DEFAULT 1,
  questions JSONB,
  is_published BOOLEAN DEFAULT false,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_assessments_lesson ON assessments(lesson_id);
```

### 8. Submissions (Даалгавар өгөх)

Суралцагчдын даалгавар өгсөн мэдээлэл.

```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES assessments(id),
  user_id UUID REFERENCES users(id),
  answers JSONB,
  files JSONB,
  score DECIMAL(10,2),
  feedback TEXT,
  status VARCHAR(20) DEFAULT 'submitted', -- 'draft', 'submitted', 'graded'
  attempt_number INTEGER DEFAULT 1,
  submitted_at TIMESTAMPTZ,
  graded_at TIMESTAMPTZ,
  graded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_submissions_assessment ON submissions(assessment_id);
CREATE INDEX idx_submissions_user ON submissions(user_id);
```

### 9. Attendance (Ирц)

Суралцагчдын ирцийн мэдээлэл.

```sql
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES classes(id),
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  status VARCHAR(20), -- 'present', 'absent', 'late', 'excused'
  notes TEXT,
  recorded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_id, user_id, date)
);

CREATE INDEX idx_attendance_class ON attendance(class_id);
CREATE INDEX idx_attendance_user ON attendance(user_id);
CREATE INDEX idx_attendance_date ON attendance(date);
```

### 10. Notifications (Мэдэгдэл)

Системийн мэдэгдлүүд.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  message TEXT,
  type VARCHAR(50), -- 'info', 'warning', 'success', 'error'
  category VARCHAR(50), -- 'assignment', 'grade', 'attendance', 'announcement'
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
```

## Row Level Security (RLS)

Supabase-ийн RLS ашиглан tenant тусгаарлалт:

```sql
-- Organizations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their organization"
  ON organizations FOR SELECT
  USING (id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view users in their organization"
  ON users FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Courses
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view courses in their organization"
  ON courses FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));
```

## Indexes

Гүйцэтгэлийг сайжруулах үндсэн индексүүд:

```sql
-- Composite indexes for common queries
CREATE INDEX idx_enrollments_user_status ON enrollments(user_id, status);
CREATE INDEX idx_submissions_user_assessment ON submissions(user_id, assessment_id);
CREATE INDEX idx_attendance_class_date ON attendance(class_id, date);

-- Full-text search indexes
CREATE INDEX idx_courses_search ON courses USING GIN(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_lessons_search ON lessons USING GIN(to_tsvector('english', title || ' ' || content));
```

## Triggers

Автомат хугацаа шинэчлэх:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Бусад хүснэгтүүд дээр мөн адилхан...
```

## Дүгнэлт

Энэхүү database schema нь:
- ✅ Scalable (multi-tenant)
- ✅ Secure (RLS)
- ✅ Flexible (JSONB fields)
- ✅ Performant (indexes)
- ✅ Maintainable (clear structure)

Дараагийн үе шатуудад нэмэлт хүснэгтүүд нэмэгдэнэ:
- Messages (чат)
- Files (файл менежмент)
- Reports (тайлан)
- Analytics (дүн шинжилгээ)

/**
 * Input Validation Utilities
 * 
 * Zod schemas ашиглан input validation
 */

import { z } from 'zod';
import { USER_ROLES, ORGANIZATION_TYPES } from '@edu-sphere/config';

/**
 * Common field validators
 */
export const commonValidators = {
  email: z.string().email('Буруу имэйл хаяг'),
  
  password: z
    .string()
    .min(8, 'Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой')
    .regex(/[A-Z]/, 'Нууц үг том үсэг агуулах ёстой')
    .regex(/[a-z]/, 'Нууц үг жижиг үсэг агуулах ёстой')
    .regex(/[0-9]/, 'Нууц үг тоо агуулах ёстой'),

  phone: z
    .string()
    .regex(/^[0-9]{8}$/, 'Утасны дугаар 8 оронтой байх ёстой')
    .optional(),

  uuid: z.string().uuid('Буруу ID формат'),

  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Slug зөвхөн жижиг үсэг, тоо, зураас агуулна')
    .min(3, 'Slug хамгийн багадаа 3 тэмдэгт байх ёстой'),

  url: z.string().url('Буруу URL хаяг'),

  date: z.coerce.date(),

  positiveInt: z.number().int().positive(),
};

/**
 * User validation schemas
 */
export const userSchemas = {
  signUp: z.object({
    email: commonValidators.email,
    password: commonValidators.password,
    firstName: z.string().min(1, 'Нэр оруулна уу'),
    lastName: z.string().min(1, 'Овог оруулна уу'),
    role: z.enum([
      USER_ROLES.ADMIN,
      USER_ROLES.TEACHER,
      USER_ROLES.STUDENT,
      USER_ROLES.PARENT,
    ] as [string, ...string[]]),
    organizationId: commonValidators.uuid,
  }),

  signIn: z.object({
    email: commonValidators.email,
    password: z.string().min(1, 'Нууц үг оруулна уу'),
  }),

  updateProfile: z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    phone: commonValidators.phone,
    dateOfBirth: commonValidators.date.optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    address: z.string().optional(),
  }),

  resetPassword: z.object({
    email: commonValidators.email,
  }),

  changePassword: z.object({
    currentPassword: z.string().min(1),
    newPassword: commonValidators.password,
    confirmPassword: z.string().min(1),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Нууц үг таарахгүй байна',
    path: ['confirmPassword'],
  }),
};

/**
 * Organization validation schemas
 */
export const organizationSchemas = {
  create: z.object({
    name: z.string().min(3, 'Нэр хамгийн багадаа 3 тэмдэгт байх ёстой'),
    slug: commonValidators.slug,
    type: z.enum([
      ORGANIZATION_TYPES.PRESCHOOL,
      ORGANIZATION_TYPES.SCHOOL,
      ORGANIZATION_TYPES.UNIVERSITY,
      ORGANIZATION_TYPES.TRAINING_CENTER,
    ] as [string, ...string[]]),
  }),

  update: z.object({
    name: z.string().min(3).optional(),
    settings: z.record(z.any()).optional(),
  }),
};

/**
 * Course validation schemas
 */
export const courseSchemas = {
  create: z.object({
    title: z.string().min(3, 'Гарчиг хамгийн багадаа 3 тэмдэгт байх ёстой'),
    slug: commonValidators.slug,
    description: z.string().optional(),
    category: z.string().optional(),
    level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    language: z.string().default('mn'),
    durationHours: commonValidators.positiveInt.optional(),
    price: z.number().min(0).optional(),
  }),

  update: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    isPublished: z.boolean().optional(),
  }),
};

/**
 * Class validation schemas
 */
export const classSchemas = {
  create: z.object({
    courseId: commonValidators.uuid,
    name: z.string().min(1, 'Ангийн нэр оруулна уу'),
    code: z.string().optional(),
    academicYear: z.string().optional(),
    semester: z.string().optional(),
    startDate: commonValidators.date.optional(),
    endDate: commonValidators.date.optional(),
    maxStudents: commonValidators.positiveInt.optional(),
  }),

  update: z.object({
    name: z.string().min(1).optional(),
    code: z.string().optional(),
    academicYear: z.string().optional(),
    semester: z.string().optional(),
    startDate: commonValidators.date.optional(),
    endDate: commonValidators.date.optional(),
    maxStudents: commonValidators.positiveInt.optional(),
    status: z.enum(['active', 'completed', 'cancelled', 'draft']).optional(),
  }),
};

/**
 * Assessment validation schemas
 */
export const assessmentSchemas = {
  create: z.object({
    lessonId: commonValidators.uuid,
    title: z.string().min(1, 'Гарчиг оруулна уу'),
    description: z.string().optional(),
    type: z.enum(['quiz', 'assignment', 'exam', 'project']),
    totalPoints: z.number().min(0).optional(),
    passingScore: z.number().min(0).optional(),
    timeLimitMinutes: commonValidators.positiveInt.optional(),
    attemptsAllowed: commonValidators.positiveInt.default(1),
    dueDate: commonValidators.date.optional(),
  }),

  submit: z.object({
    assessmentId: commonValidators.uuid,
    answers: z.record(z.any()).optional(),
    files: z.array(z.string()).optional(),
  }),
};

/**
 * Pagination schema
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Validate input helper
 */
export async function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<T> {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
      );
    }
    throw error;
  }
}

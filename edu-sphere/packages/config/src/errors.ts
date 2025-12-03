/**
 * Custom Error Classes
 * 
 * Төслийн бүх алдаануудыг энд тодорхойлно
 */

/**
 * Base application error
 */
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR',
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error (400)
 */
export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', public errors?: any) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

/**
 * Authentication Error (401)
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

/**
 * Authorization Error (403)
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'You do not have permission to perform this action') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

/**
 * Not Found Error (404)
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

/**
 * Conflict Error (409)
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409, 'CONFLICT_ERROR');
  }
}

/**
 * Rate Limit Error (429)
 */
export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_ERROR');
  }
}

/**
 * Database Error (500)
 */
export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, 'DATABASE_ERROR', false);
  }
}

/**
 * External API Error (502)
 */
export class ExternalApiError extends AppError {
  constructor(
    service: string,
    message: string = 'External service unavailable'
  ) {
    super(`${service}: ${message}`, 502, 'EXTERNAL_API_ERROR', false);
  }
}

/**
 * Error Messages - Монгол хэл
 */
export const ERROR_MESSAGES = {
  // Auth
  AUTH_INVALID_CREDENTIALS: 'Имэйл эсвэл нууц үг буруу байна',
  AUTH_EMAIL_EXISTS: 'Энэ имэйл аль хэдийн бүртгэлтэй байна',
  AUTH_ACCOUNT_SUSPENDED: 'Таны бүртгэл түр хаагдсан байна',
  AUTH_SESSION_EXPIRED: 'Нэвтрэлт дууссан байна. Дахин нэвтэрнэ үү',
  AUTH_INVALID_TOKEN: 'Хүчингүй токен байна',
  AUTH_PASSWORD_WEAK: 'Нууц үг хангалтгүй хүчтэй байна',

  // User
  USER_NOT_FOUND: 'Хэрэглэгч олдсонгүй',
  USER_ALREADY_ENROLLED: 'Хэрэглэгч аль хэдийн элссэн байна',
  USER_NOT_ENROLLED: 'Хэрэглэгч элсээгүй байна',

  // Organization
  ORG_NOT_FOUND: 'Байгууллага олдсонгүй',
  ORG_SUBSCRIPTION_EXPIRED: 'Захиалга дууссан байна',
  ORG_LIMIT_REACHED: 'Захиалгын хязгаарт хүрсэн байна',

  // Course
  COURSE_NOT_FOUND: 'Хичээл олдсонгүй',
  COURSE_NOT_PUBLISHED: 'Хичээл нийтлэгдээгүй байна',
  COURSE_FULL: 'Хичээл дүүрсэн байна',

  // Class
  CLASS_NOT_FOUND: 'Анги олдсонгүй',
  CLASS_FULL: 'Анги дүүрсэн байна',
  CLASS_ENDED: 'Анги дууссан байна',

  // Assessment
  ASSESSMENT_NOT_FOUND: 'Үнэлгээ олдсонгүй',
  ASSESSMENT_CLOSED: 'Үнэлгээ хаагдсан байна',
  ASSESSMENT_ATTEMPTS_EXCEEDED: 'Оролдлогын хязгаарт хүрсэн байна',
  ASSESSMENT_TIME_LIMIT: 'Хугацаа дууссан байна',

  // Submission
  SUBMISSION_NOT_FOUND: 'Даалгавар олдсонгүй',
  SUBMISSION_ALREADY_GRADED: 'Даалгавар аль хэдийн үнэлэгдсэн байна',

  // File
  FILE_TOO_LARGE: 'Файлын хэмжээ хэтэрсэн байна',
  FILE_TYPE_NOT_ALLOWED: 'Зөвшөөрөгдөөгүй файлын төрөл байна',
  FILE_UPLOAD_FAILED: 'Файл хуулахад алдаа гарлаа',

  // General
  INTERNAL_ERROR: 'Серверийн алдаа гарлаа',
  VALIDATION_ERROR: 'Өгөгдөл буруу байна',
  PERMISSION_DENIED: 'Эрх хүрэхгүй байна',
  RESOURCE_NOT_FOUND: 'Мэдээлэл олдсонгүй',
  RATE_LIMIT_EXCEEDED: 'Хэт олон хүсэлт илгээсэн байна. Түр хүлээнэ үү',
} as const;

export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;

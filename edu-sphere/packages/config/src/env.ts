/**
 * Environment Configuration
 * 
 * Environment variable-уудыг validate хийж, type-safe байдлаар ашиглах
 */

import { z } from 'zod';

/**
 * Environment schema
 */
const envSchema = z.object({
  // Node environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Database
  DATABASE_URL: z.string().url().min(1, 'DATABASE_URL is required'),
  DIRECT_URL: z.string().url().optional(),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url()
    .min(1, 'NEXT_PUBLIC_SUPABASE_URL is required'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),

  // OpenAI
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),

  // App URLs
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3000/api'),

  // Email (Optional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),

  // File Upload
  NEXT_PUBLIC_MAX_FILE_SIZE: z.string().default('10485760'),
  NEXT_PUBLIC_ALLOWED_FILE_TYPES: z
    .string()
    .default('image/*,application/pdf,.doc,.docx'),

  // Azure (Optional)
  AZURE_STORAGE_CONNECTION_STRING: z.string().optional(),
  AZURE_STORAGE_CONTAINER: z.string().optional(),

  // Cloudflare (Optional)
  CLOUDFLARE_API_TOKEN: z.string().optional(),
  CLOUDFLARE_ZONE_ID: z.string().optional(),

  // Analytics (Optional)
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),

  // Feature Flags
  NEXT_PUBLIC_ENABLE_AI_FEATURES: z.string().default('true'),
  NEXT_PUBLIC_ENABLE_VIDEO_CALLS: z.string().default('false'),
  NEXT_PUBLIC_ENABLE_MOBILE_APP: z.string().default('false'),
});

/**
 * Validate and parse environment variables
 */
function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => `  - ${err.path.join('.')}: ${err.message}`)
        .join('\n');

      throw new Error(
        `❌ Environment validation failed:\n\n${missingVars}\n\nPlease check your .env.local file.`
      );
    }
    throw error;
  }
}

/**
 * Typed environment variables
 */
export const env = validateEnv();

/**
 * Helper functions
 */
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

/**
 * Feature flags
 */
export const featureFlags = {
  enableAiFeatures: env.NEXT_PUBLIC_ENABLE_AI_FEATURES === 'true',
  enableVideoCalls: env.NEXT_PUBLIC_ENABLE_VIDEO_CALLS === 'true',
  enableMobileApp: env.NEXT_PUBLIC_ENABLE_MOBILE_APP === 'true',
};

/**
 * File upload config
 */
export const fileUploadConfig = {
  maxFileSize: parseInt(env.NEXT_PUBLIC_MAX_FILE_SIZE, 10),
  allowedFileTypes: env.NEXT_PUBLIC_ALLOWED_FILE_TYPES.split(','),
};

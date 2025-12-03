import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email('Invalid email format'),
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name must be less than 50 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100, 'Password must be less than 100 characters').optional().or(z.literal('')),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT'], {
    errorMap: () => ({ message: 'Invalid role selected' }),
  }),
  phone: z.string().min(8, 'Phone number must be at least 8 characters').max(20, 'Phone number must be less than 20 characters').optional().or(z.literal('')),
  address: z.string().max(200, 'Address must be less than 200 characters').optional().or(z.literal('')),
  avatarUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
  organizationId: z.string().min(1, 'Organization is required').optional(),
});

export type UserFormData = z.infer<typeof userSchema>;

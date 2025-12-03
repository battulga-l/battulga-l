import { z } from 'zod';

export const organizationSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100, 'Name must be less than 100 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').max(100, 'Slug must be less than 100 characters').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  type: z.enum(['SCHOOL', 'UNIVERSITY', 'TRAINING_CENTER', 'CORPORATE'], {
    errorMap: () => ({ message: 'Invalid organization type' }),
  }),
  address: z.string().min(5, 'Address must be at least 5 characters').max(200, 'Address must be less than 200 characters').optional().or(z.literal('')),
  phone: z.string().min(8, 'Phone number must be at least 8 characters').max(20, 'Phone number must be less than 20 characters').optional().or(z.literal('')),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  website: z.string().url('Invalid URL format').optional().or(z.literal('')),
  logoUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;

import { z } from 'zod';

export const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be less than 200 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').max(100, 'Slug must be less than 100 characters').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000, 'Description must be less than 5000 characters'),
  category: z.string().min(1, 'Category is required').max(50, 'Category must be less than 50 characters'),
  level: z.enum(['beginner', 'intermediate', 'advanced'], {
    errorMap: () => ({ message: 'Level must be beginner, intermediate, or advanced' }),
  }),
  durationHours: z.number().min(1, 'Duration must be at least 1 hour').max(1000, 'Duration must be less than 1000 hours'),
  price: z.number().min(0, 'Price must be at least 0').max(999999.99, 'Price must be less than 999999.99'),
  instructorId: z.string().min(1, 'Instructor is required'),
  thumbnailUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
});

export type CourseFormData = z.infer<typeof courseSchema>;

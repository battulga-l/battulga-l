import { z } from 'zod';

export const classSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100, 'Name must be less than 100 characters'),
  code: z.string().min(2, 'Code must be at least 2 characters').max(20, 'Code must be less than 20 characters'),
  courseId: z.string().min(1, 'Course is required'),
  academicYear: z.string().min(4, 'Academic year must be at least 4 characters').max(20, 'Academic year must be less than 20 characters'),
  semester: z.string().min(1, 'Semester is required').max(20, 'Semester must be less than 20 characters'),
  status: z.enum(['active', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'Invalid status' }),
  }),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  maxStudents: z.number().min(1, 'Max students must be at least 1').max(1000, 'Max students must be less than 1000').optional(),
  schedule: z.string().optional().or(z.literal('')),
});

export type ClassFormData = z.infer<typeof classSchema>;

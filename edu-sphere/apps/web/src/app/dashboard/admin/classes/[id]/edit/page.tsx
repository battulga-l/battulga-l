'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { classSchema, type ClassFormData } from '@/lib/validations/class';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  category: string;
}

export default function EditClassPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params.id as string;

  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingClass, setLoadingClass] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
  });

  useEffect(() => {
    fetchCourses();
    fetchClass();
  }, [classId]);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses?isPublished=true&limit=100');
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchClass = async () => {
    try {
      const res = await fetch(`/api/classes/${classId}`);
      if (res.ok) {
        const classData = await res.json();
        setValue('name', classData.name);
        setValue('code', classData.code);
        setValue('courseId', classData.courseId);
        setValue('academicYear', classData.academicYear);
        setValue('semester', classData.semester);
        setValue('status', classData.status);
        setValue('startDate', classData.startDate ? new Date(classData.startDate).toISOString().split('T')[0] : '');
        setValue('endDate', classData.endDate ? new Date(classData.endDate).toISOString().split('T')[0] : '');
        setValue('maxStudents', classData.maxStudents);
        setValue('schedule', classData.schedule || '');
      } else {
        toast.error('Failed to load class');
        router.push('/dashboard/admin/classes');
      }
    } catch (error) {
      console.error('Failed to fetch class:', error);
      toast.error('Failed to load class');
      router.push('/dashboard/admin/classes');
    } finally {
      setLoadingClass(false);
    }
  };

  const onSubmit = async (data: ClassFormData) => {
    try {
      const submitData = {
        ...data,
        maxStudents: data.maxStudents ? Number(data.maxStudents) : undefined,
      };

      const res = await fetch(`/api/classes/${classId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (res.ok) {
        toast.success('Class updated successfully!');
        router.push('/dashboard/admin/classes');
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to update class');
      }
    } catch (error) {
      console.error('Failed to update class:', error);
      toast.error('Failed to update class');
    }
  };

  if (loadingClass) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading class...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Class</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Update class information</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="space-y-6">
            {/* Name & Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Class Name *
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="CS101-A"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Class Code *
                </label>
                <input
                  id="code"
                  type="text"
                  {...register('code')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="CS101A"
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.code.message}</p>
                )}
              </div>
            </div>

            {/* Course */}
            <div>
              <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Course *
              </label>
              {loadingCourses ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">Loading courses...</div>
              ) : (
                <select
                  id="courseId"
                  {...register('courseId')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title} ({course.category})
                    </option>
                  ))}
                </select>
              )}
              {errors.courseId && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.courseId.message}</p>
              )}
            </div>

            {/* Academic Year & Semester */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Academic Year *
                </label>
                <input
                  id="academicYear"
                  type="text"
                  {...register('academicYear')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2024-2025"
                />
                {errors.academicYear && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.academicYear.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="semester" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Semester *
                </label>
                <select
                  id="semester"
                  {...register('semester')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Fall">Fall</option>
                  <option value="Winter">Winter</option>
                </select>
                {errors.semester && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.semester.message}</p>
                )}
              </div>
            </div>

            {/* Start Date & End Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date *
                </label>
                <input
                  id="startDate"
                  type="date"
                  {...register('startDate')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date *
                </label>
                <input
                  id="endDate"
                  type="date"
                  {...register('endDate')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            {/* Status & Max Students */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status *
                </label>
                <select
                  id="status"
                  {...register('status')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="maxStudents" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Students
                </label>
                <input
                  id="maxStudents"
                  type="number"
                  {...register('maxStudents', { valueAsNumber: true })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="30"
                />
                {errors.maxStudents && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.maxStudents.message}</p>
                )}
              </div>
            </div>

            {/* Schedule */}
            <div>
              <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Schedule (Optional)
              </label>
              <textarea
                id="schedule"
                {...register('schedule')}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Monday & Wednesday, 10:00 AM - 12:00 PM"
              />
              {errors.schedule && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.schedule.message}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/dashboard/admin/classes"
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Updating...' : 'Update Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

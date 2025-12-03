'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organization: {
    id: string;
    name: string;
  };
}

export default function TeacherDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        router.push('/auth/login');
        return;
      }
      const data = await response.json();
      if (data.user.role !== 'TEACHER') {
        router.push('/dashboard');
        return;
      }
      setUser(data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Уншиж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-xl font-bold">EduSphere</span>
            </Link>
            <span className="text-sm text-gray-500">Teacher Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {user?.firstName} {user?.lastName}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Гарах
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 border-r min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            <Link
              href="/dashboard/teacher"
              className="block px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg font-medium"
            >
              📊 Dashboard
            </Link>
            <Link
              href="/dashboard/teacher/courses"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              📚 Миний хичээлүүд
            </Link>
            <Link
              href="/dashboard/teacher/classes"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              🎓 Миний ангиуд
            </Link>
            <Link
              href="/dashboard/teacher/lessons"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              📖 Хичээлүүд
            </Link>
            <Link
              href="/dashboard/teacher/assessments"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              📝 Үнэлгээ
            </Link>
            <Link
              href="/dashboard/teacher/attendance"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              ✅ Ирц
            </Link>
            <Link
              href="/dashboard/teacher/students"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              👨‍🎓 Сурагчид
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                Сайн байна уу, Багш {user?.firstName}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {user?.organization.name}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Миний хичээлүүд
                  </h3>
                  <span className="text-2xl">📚</span>
                </div>
                <p className="text-3xl font-bold">3</p>
                <p className="text-sm text-blue-600 mt-2">Идэвхтэй</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Миний ангиуд
                  </h3>
                  <span className="text-2xl">🎓</span>
                </div>
                <p className="text-3xl font-bold">2</p>
                <p className="text-sm text-blue-600 mt-2">Энэ улиралд</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Сурагчид
                  </h3>
                  <span className="text-2xl">👨‍🎓</span>
                </div>
                <p className="text-3xl font-bold">45</p>
                <p className="text-sm text-blue-600 mt-2">Нийт</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Хянах даалгавар
                  </h3>
                  <span className="text-2xl">📝</span>
                </div>
                <p className="text-3xl font-bold">12</p>
                <p className="text-sm text-orange-600 mt-2">Хүлээгдэж буй</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border mb-8">
              <h2 className="text-xl font-bold mb-4">Түргэн үйлдлүүд</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/dashboard/teacher/lessons/new"
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow text-center"
                >
                  <span className="text-3xl mb-2 block">➕</span>
                  <p className="text-sm font-medium">Хичээл нэмэх</p>
                </Link>
                <Link
                  href="/dashboard/teacher/assessments/new"
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow text-center"
                >
                  <span className="text-3xl mb-2 block">📝</span>
                  <p className="text-sm font-medium">Даалгавар өгөх</p>
                </Link>
                <Link
                  href="/dashboard/teacher/attendance"
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow text-center"
                >
                  <span className="text-3xl mb-2 block">✅</span>
                  <p className="text-sm font-medium">Ирц тэмдэглэх</p>
                </Link>
                <Link
                  href="/dashboard/teacher/students"
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow text-center"
                >
                  <span className="text-3xl mb-2 block">👨‍🎓</span>
                  <p className="text-sm font-medium">Сурагчид үзэх</p>
                </Link>
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                <h2 className="text-xl font-bold mb-4">Өнөөдрийн хичээл</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-2xl">📚</span>
                    <div className="flex-1">
                      <p className="font-medium">Web Development</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        10:00 - 12:00 • 301 тоот
                      </p>
                      <p className="text-xs text-blue-600 mt-1">20 минутын дараа</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <span className="text-2xl">💻</span>
                    <div className="flex-1">
                      <p className="font-medium">Дата бүтэц ба алгоритм</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        14:00 - 16:00 • 305 тоот
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                <h2 className="text-xl font-bold mb-4">Хянах даалгавар</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <span className="text-2xl">📝</span>
                    <div className="flex-1">
                      <p className="font-medium">HTML/CSS дасгал</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        8 илгээсэн • Web Development
                      </p>
                      <p className="text-xs text-orange-600 mt-1">Өнөөдөр дуусах</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <span className="text-2xl">💻</span>
                    <div className="flex-1">
                      <p className="font-medium">Binary Tree бодлого</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        4 илгээсэн • Дата бүтэц
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Маргааш дуусах</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

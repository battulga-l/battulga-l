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

export default function StudentDashboard() {
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
      if (data.user.role !== 'STUDENT') {
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
            <span className="text-sm text-gray-500">Student Dashboard</span>
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
              href="/dashboard/student"
              className="block px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg font-medium"
            >
              📊 Dashboard
            </Link>
            <Link
              href="/dashboard/student/courses"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              📚 Миний хичээлүүд
            </Link>
            <Link
              href="/dashboard/student/lessons"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              📖 Хичээл үзэх
            </Link>
            <Link
              href="/dashboard/student/assignments"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              📝 Даалгавар
            </Link>
            <Link
              href="/dashboard/student/grades"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              🏆 Дүн
            </Link>
            <Link
              href="/dashboard/student/attendance"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              ✅ Ирц
            </Link>
            <Link
              href="/dashboard/student/profile"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              👤 Профайл
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                Сайн байна уу, {user?.firstName}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {user?.organization.name} - Таны суралцах явц
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Элссэн хичээл
                  </h3>
                  <span className="text-2xl">📚</span>
                </div>
                <p className="text-3xl font-bold">4</p>
                <p className="text-sm text-blue-600 mt-2">Энэ улиралд</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Даалгавар
                  </h3>
                  <span className="text-2xl">📝</span>
                </div>
                <p className="text-3xl font-bold">3</p>
                <p className="text-sm text-orange-600 mt-2">Хүлээгдэж буй</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Дундаж дүн
                  </h3>
                  <span className="text-2xl">🏆</span>
                </div>
                <p className="text-3xl font-bold">3.8</p>
                <p className="text-sm text-green-600 mt-2">+0.2 сүүлийн сараас</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Ирц
                  </h3>
                  <span className="text-2xl">✅</span>
                </div>
                <p className="text-3xl font-bold">92%</p>
                <p className="text-sm text-green-600 mt-2">Маш сайн</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border mb-8">
              <h2 className="text-xl font-bold mb-4">Түргэн үйлдлүүд</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/dashboard/student/courses"
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow text-center"
                >
                  <span className="text-3xl mb-2 block">📚</span>
                  <p className="text-sm font-medium">Хичээл үзэх</p>
                </Link>
                <Link
                  href="/dashboard/student/assignments"
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow text-center"
                >
                  <span className="text-3xl mb-2 block">📝</span>
                  <p className="text-sm font-medium">Даалгавар илгээх</p>
                </Link>
                <Link
                  href="/dashboard/student/grades"
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow text-center"
                >
                  <span className="text-3xl mb-2 block">🏆</span>
                  <p className="text-sm font-medium">Дүн харах</p>
                </Link>
                <Link
                  href="/dashboard/student/attendance"
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow text-center"
                >
                  <span className="text-3xl mb-2 block">✅</span>
                  <p className="text-sm font-medium">Ирц харах</p>
                </Link>
              </div>
            </div>

            {/* Today's Classes */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                <h2 className="text-xl font-bold mb-4">Өнөөдрийн хичээл</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-2xl">📚</span>
                    <div className="flex-1">
                      <p className="font-medium">Web Development</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Багш: Б.Доржийн • 10:00 - 12:00
                      </p>
                      <p className="text-xs text-blue-600 mt-1">Удахгүй эхэлнэ</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <span className="text-2xl">💻</span>
                    <div className="flex-1">
                      <p className="font-medium">Дата бүтэц ба алгоритм</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Багш: С.Баяртулга • 14:00 - 16:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                <h2 className="text-xl font-bold mb-4">Хүлээгдэж буй даалгавар</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded">
                    <span className="text-2xl">📝</span>
                    <div className="flex-1">
                      <p className="font-medium">HTML/CSS дасгал</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Web Development
                      </p>
                      <p className="text-xs text-orange-600 mt-1">Өнөөдөр дуусна</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <span className="text-2xl">💻</span>
                    <div className="flex-1">
                      <p className="font-medium">Binary Tree бодлого</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Дата бүтэц ба алгоритм
                      </p>
                      <p className="text-xs text-gray-600 mt-1">2 өдрийн дараа</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Progress */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
              <h2 className="text-xl font-bold mb-4">Хичээлийн явц</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Web Development</span>
                    <span className="text-sm text-gray-600">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Дата бүтэц ба алгоритм</span>
                    <span className="text-sm text-gray-600">60%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: '60%' }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Mobile Development</span>
                    <span className="text-sm text-gray-600">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{ width: '45%' }}
                    ></div>
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

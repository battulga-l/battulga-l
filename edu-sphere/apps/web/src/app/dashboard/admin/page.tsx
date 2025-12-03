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

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    classes: 0,
    students: 0,
  });

  useEffect(() => {
    fetchUser();
    fetchStats();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        router.push('/auth/login');
        return;
      }
      const data = await response.json();
      if (data.user.role !== 'ADMIN' && data.user.role !== 'SUPER_ADMIN') {
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

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
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
            <span className="text-sm text-gray-500">Admin Dashboard</span>
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
              href="/dashboard/admin"
              className="block px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg font-medium"
            >
              📊 Dashboard
            </Link>
            <Link
              href="/dashboard/admin/organizations"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              🏢 Байгууллагууд
            </Link>
            <Link
              href="/dashboard/admin/users"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              👥 Хэрэглэгчид
            </Link>
            <Link
              href="/dashboard/admin/courses"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              📚 Хичээлүүд
            </Link>
            <Link
              href="/dashboard/admin/classes"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              🎓 Ангиуд
            </Link>
            <Link
              href="/dashboard/admin/reports"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              📈 Тайлан
            </Link>
            <Link
              href="/dashboard/admin/settings"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              ⚙️ Тохиргоо
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
                {user?.organization.name} - Админ хяналтын самбар
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Нийт хэрэглэгч
                  </h3>
                  <span className="text-2xl">👥</span>
                </div>
                <p className="text-3xl font-bold">{stats.users}</p>
                <p className="text-sm text-green-600 mt-2">+12% энэ сараас</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Хичээлүүд
                  </h3>
                  <span className="text-2xl">📚</span>
                </div>
                <p className="text-3xl font-bold">{stats.courses}</p>
                <p className="text-sm text-green-600 mt-2">+8% энэ сараас</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Ангиуд
                  </h3>
                  <span className="text-2xl">🎓</span>
                </div>
                <p className="text-3xl font-bold">{stats.classes}</p>
                <p className="text-sm text-green-600 mt-2">+5% энэ сараас</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Сурагчид
                  </h3>
                  <span className="text-2xl">👨‍🎓</span>
                </div>
                <p className="text-3xl font-bold">{stats.students}</p>
                <p className="text-sm text-green-600 mt-2">+15% энэ сараас</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border mb-8">
              <h2 className="text-xl font-bold mb-4">Түргэн үйлдлүүд</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/dashboard/admin/users/new"
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow text-center"
                >
                  <span className="text-3xl mb-2 block">➕</span>
                  <p className="text-sm font-medium">Хэрэглэгч нэмэх</p>
                </Link>
                <Link
                  href="/dashboard/admin/courses/new"
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow text-center"
                >
                  <span className="text-3xl mb-2 block">📖</span>
                  <p className="text-sm font-medium">Хичээл нэмэх</p>
                </Link>
                <Link
                  href="/dashboard/admin/classes/new"
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow text-center"
                >
                  <span className="text-3xl mb-2 block">🏫</span>
                  <p className="text-sm font-medium">Анги нэмэх</p>
                </Link>
                <Link
                  href="/dashboard/admin/reports"
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow text-center"
                >
                  <span className="text-3xl mb-2 block">📊</span>
                  <p className="text-sm font-medium">Тайлан үзэх</p>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
              <h2 className="text-xl font-bold mb-4">Сүүлийн үйл ажиллагаа</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 pb-4 border-b">
                  <span className="text-2xl">👤</span>
                  <div className="flex-1">
                    <p className="font-medium">Шинэ хэрэглэгч бүртгэгдсэн</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Баяр Доржийн - Багш • 5 минутын өмнө
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 pb-4 border-b">
                  <span className="text-2xl">📚</span>
                  <div className="flex-1">
                    <p className="font-medium">Шинэ хичээл нэмэгдсэн</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      &ldquo;Дата бүтэц ба алгоритм&rdquo; • 1 цагийн өмнө
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 pb-4 border-b">
                  <span className="text-2xl">🎓</span>
                  <div className="flex-1">
                    <p className="font-medium">Сурагч элссэн</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      10 сурагч &ldquo;Web Development&rdquo; ангид элслээ • 2 цагийн өмнө
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">✅</span>
                  <div className="flex-1">
                    <p className="font-medium">Даалгавар илгээсэн</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      25 сурагч даалгавар илгээлээ • 3 цагийн өмнө
                    </p>
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

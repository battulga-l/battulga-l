import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              EduSphere
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 dark:text-gray-300">Онцлог</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 dark:text-gray-300">Үнэ</a>
            <a href="#about" className="text-gray-600 hover:text-blue-600 dark:text-gray-300">Бидний тухай</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-300"
            >
              Нэвтрэх
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Бүртгүүлэх
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
            Боловсролын
            <br />
            Cloud Шийдэл
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            Сургууль, сургалтын төвүүдэд зориулсан орчин үеийн<br />
            платформ - LMS болон SMS нэг дороос
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              Үнэгүй эхлэх →
            </Link>
            <Link
              href="/demo"
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors text-lg font-semibold"
            >
              Demo үзэх
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            ✨ Кредит карт шаардлагагүй • 🚀 2 минутад эхлэх
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600">500+</div>
            <div className="text-gray-600 dark:text-gray-400 mt-2">Байгууллага</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">50,000+</div>
            <div className="text-gray-600 dark:text-gray-400 mt-2">Хэрэглэгч</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">99.9%</div>
            <div className="text-gray-600 dark:text-gray-400 mt-2">Uptime</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">24/7</div>
            <div className="text-gray-600 dark:text-gray-400 mt-2">Дэмжлэг</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Таны хэрэгцээнд бүх зүйл
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Боловсролын бүх үйл ажиллагааг нэг платформоос удирдах
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: '🎓',
              title: 'Сургалтын Менежмент (LMS)',
              description: 'Хичээл, даалгавар, үнэлгээ, контент менежмент',
            },
            {
              icon: '🏫',
              title: 'Сургуулийн Менежмент (SMS)',
              description: 'Сурагч, багш, анги, ирц, дүнгийн бүртгэл',
            },
            {
              icon: '📊',
              title: 'Analytics & Reports',
              description: 'Real-time дүн шинжилгээ, тайлан, graph',
            },
            {
              icon: '🔔',
              title: 'Мэдэгдэл',
              description: 'Real-time push, email, SMS notification',
            },
            {
              icon: '🤖',
              title: 'AI Assistant',
              description: 'Контент үүсгэлт, автомат үнэлгээ, зөвлөмж',
            },
            {
              icon: '📱',
              title: 'Mobile App',
              description: 'iOS болон Android апп дээр бүх үйлдэл',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-8 border rounded-2xl hover:shadow-xl transition-all hover:-translate-y-1 bg-white dark:bg-gray-800"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="bg-blue-50 dark:bg-gray-800/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Бүх оролцогчдод тохирсон
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Админ, Багш, Сурагч, Эцэг эх - бүгдэд өөрийн интерфэйс
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                role: 'Админ',
                icon: '👨‍💼',
                features: ['Систем удирдлага', 'Хэрэглэгч менежмент', 'Тайлан үзэх'],
              },
              {
                role: 'Багш',
                icon: '👩‍🏫',
                features: ['Контент оруулах', 'Үнэлгээ өгөх', 'Ирц тэмдэглэх'],
              },
              {
                role: 'Сурагч',
                icon: '👨‍🎓',
                features: ['Хичээл үзэх', 'Даалгавар гүйцэтгэх', 'Явц хянах'],
              },
              {
                role: 'Эцэг эх',
                icon: '👨‍👩‍👧',
                features: ['Явц хянах', 'Багштай харилцах', 'Мэдэгдэл авах'],
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl text-center"
              >
                <div className="text-6xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-4">{item.role}</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  {item.features.map((feature, i) => (
                    <li key={i} className="flex items-center justify-center">
                      <span className="mr-2">✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto p-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Өнөөдөр эхэлцгээе!
          </h2>
          <p className="text-xl mb-8 opacity-90">
            2 минутад бүртгүүлж, таны сургуулийг шинэ түвшинд гаргацгаая
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold"
          >
            Үнэгүй эхлэх →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">E</span>
                </div>
                <span className="text-xl font-bold">EduSphere</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Боловсролын салбарын<br />cloud шийдэл
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Бүтээгдэхүүн</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-blue-600">LMS</a></li>
                <li><a href="#" className="hover:text-blue-600">SMS</a></li>
                <li><a href="#" className="hover:text-blue-600">Mobile App</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Компани</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-blue-600">Бидний тухай</a></li>
                <li><a href="#" className="hover:text-blue-600">Блог</a></li>
                <li><a href="#" className="hover:text-blue-600">Ажлын байр</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Холбоо барих</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>📧 support@edusphere.mn</li>
                <li>📞 +976-7777-7777</li>
                <li>📍 Улаанбаатар, Монгол</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© 2025 EduSphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

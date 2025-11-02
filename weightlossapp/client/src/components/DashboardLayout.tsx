import { Link, useLocation } from 'wouter';
import {
  Home,
  TrendingDown,
  Utensils,
  Dumbbell,
  CheckSquare,
  BookOpen,
  Trophy,
  BarChart3,
  Bot,
} from 'lucide-react';
import { cn } from '@/lib/utils';


interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Weight Tracker', href: '/weight', icon: TrendingDown },
  { name: 'Nutrition', href: '/nutrition', icon: Utensils },
  { name: 'Exercise', href: '/exercise', icon: Dumbbell },
  { name: 'Habits', href: '/habits', icon: CheckSquare },
  { name: 'Recipes', href: '/recipes', icon: BookOpen },
  { name: 'AI Coach', href: '/ai-coach', icon: Bot },
  { name: 'Achievements', href: '/achievements', icon: Trophy },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-green-600">Weight Loss Companion</h1>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 shadow-sm">
          <div className="flex-1 flex flex-col min-h-0">
            {/* Logo */}
            <div className="px-6 py-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-green-600">
                Weight Loss Companion
              </h1>
              <p className="text-sm text-gray-600 mt-1">Your journey to health</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = location === item.href;
                return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Stay consistent, stay healthy! 💪
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:pl-64 pb-20 lg:pb-0">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <nav className="flex justify-around">
          {navigation.slice(0, 5).map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center py-2 px-3 text-xs font-medium transition-colors',
                  isActive ? 'text-green-600' : 'text-gray-600'
                )}
              >
                <item.icon className="h-6 w-6 mb-1" />
                <span className="truncate">{item.name.split(' ')[0]}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}


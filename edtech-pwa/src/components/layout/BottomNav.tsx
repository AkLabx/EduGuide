import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, User } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: BookOpen, label: 'Syllabus', path: '/syllabus' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 px-6 py-4 pb-safe flex justify-between items-center max-w-md mx-auto shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] rounded-t-3xl">
      {navItems.map((item) => {
        const isActive = location.pathname.startsWith(item.path);
        const Icon = item.icon;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1.5 transition-all ${
              isActive ? 'text-primary-600 scale-110' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className={`p-2 rounded-xl ${isActive ? 'bg-primary-50' : ''}`}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-medium ${isActive ? 'text-primary-600' : ''}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

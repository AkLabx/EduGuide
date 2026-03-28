import { NavLink } from 'react-router-dom';
import { Home, BookOpen, HelpCircle, User } from 'lucide-react';
import { cn } from '@/utils/cn';

const navItems = [
  { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
  { id: 'subjects', label: 'Subjects', icon: BookOpen, path: '/subjects' },
  { id: 'tests', label: 'Tests', icon: HelpCircle, path: '/tests' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

export function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white pb-safe pt-2 dark:border-slate-800 dark:bg-slate-950">
      <nav className="mx-auto flex max-w-md items-center justify-around px-4 pb-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center space-y-1 p-2 transition-colors",
                  isActive 
                    ? "text-indigo-600 dark:text-indigo-400" 
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
                )
              }
            >
              <Icon size={24} strokeWidth={2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

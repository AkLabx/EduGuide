import { NavLink } from 'react-router-dom';
import { Home, BookOpen, HelpCircle, User } from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion } from 'motion/react';

const navItems = [
  { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
  { id: 'subjects', label: 'Subjects', icon: BookOpen, path: '/subjects' },
  { id: 'tests', label: 'Tests', icon: HelpCircle, path: '/tests' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

export function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/50 bg-white/95 pb-safe pt-2 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-950/95 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <nav className="mx-auto flex max-w-md items-center justify-around px-2 pb-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "relative flex flex-col items-center justify-center space-y-1 w-16 p-2 transition-colors duration-300",
                  isActive 
                    ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 font-medium"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative flex items-center justify-center p-1">
                    {isActive && (
                      <motion.div
                        layoutId="bottom-nav-indicator"
                        className="absolute inset-0 rounded-full bg-indigo-100 dark:bg-indigo-900/40"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />
                  </div>
                  <span className="text-[10px]">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

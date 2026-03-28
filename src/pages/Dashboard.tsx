import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  FileText, 
  PlayCircle, 
  HelpCircle,
  Settings,
  LogOut,
  Bell,
  ChevronRight,
  Download
} from 'lucide-react';
import { Logo } from "@/components/ui/Logo";
import { useAppStore } from '@/store/useAppStore';
import { PageLoader } from '@/components/ui/PageLoader';
import { useNotifications } from '@/contexts/NotificationContext';
import toast from 'react-hot-toast';

const subjects = [
  { id: 'maths', name: 'Mathematics', color: 'bg-blue-500' },
  { id: 'science', name: 'Science', color: 'bg-emerald-500' },
  { id: 'english', name: 'English', color: 'bg-amber-500' },
  { id: 'social', name: 'Social Studies', color: 'bg-rose-500' },
  { id: 'hindi', name: 'Hindi', color: 'bg-purple-500' },
];

const features = [
  { id: 'notes', name: 'Chapter Notes', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100', path: '/subjects' },
  { id: 'videos', name: 'Video Lectures', icon: PlayCircle, color: 'text-emerald-600', bg: 'bg-emerald-100', path: '/subjects' },
  { id: 'tests', name: 'Mock Tests', icon: HelpCircle, color: 'text-rose-600', bg: 'bg-rose-100', path: '/tests' },
  { id: 'downloads', name: 'Downloads', icon: Download, color: 'text-indigo-600', bg: 'bg-indigo-100', path: '/downloads' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { selectedBoard, selectedClass, reset } = useAppStore();
  const { unreadCount } = useNotifications();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedBoard || !selectedClass) {
      navigate('/home');
      return;
    }
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [selectedBoard, selectedClass, navigate]);

  const handleLogout = () => {
    reset();
    toast('Logged out successfully', { icon: '👋' });
    navigate('/home');
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-indigo-600 px-4 pb-6 pt-12 text-white shadow-md rounded-b-3xl dark:bg-indigo-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
              <Logo className="h-8 w-8" />
            </div>
            <div>
              <p className="text-indigo-200 text-sm font-medium dark:text-indigo-300">Welcome back, Student</p>
              <h1 className="text-xl font-bold">Class {selectedClass} • {selectedBoard}</h1>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => navigate('/notifications')}
              className="relative rounded-full bg-white/20 p-2 backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-rose-500 ring-2 ring-indigo-600 dark:ring-indigo-900"></span>
              )}
            </button>
            <button 
              onClick={handleLogout}
              className="rounded-full bg-white/20 p-2 backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 pt-6">
        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Quick Access</h2>
          <div className="grid grid-cols-4 gap-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  key={feature.id}
                  className="flex flex-col items-center justify-center space-y-2 rounded-2xl bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)] active:shadow-sm dark:bg-slate-900"
                  onClick={() => navigate(feature.path)}
                >
                  <div className={`rounded-full p-3 ${feature.bg} ${feature.color}`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-center text-[11px] font-medium text-slate-600 leading-tight dark:text-slate-400">
                    {feature.name}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Subjects */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Subjects</h2>
            <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400">View All</button>
          </div>
          
          <div className="grid gap-4">
            {subjects.map((subject, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={subject.id}
                className="flex cursor-pointer items-center overflow-hidden rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all active:scale-[0.98] dark:bg-slate-900"
                onClick={() => navigate('/subjects')}
              >
                <div className={`w-3 self-stretch ${subject.color}`} />
                <div className="flex flex-1 items-center justify-between p-5">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{subject.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">12 Chapters • 45 Videos</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

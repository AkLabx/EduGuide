import { useAppStore } from '@/store/useAppStore';
import { useNotifications } from '@/contexts/NotificationContext';
import { Moon, Sun, Monitor, LogOut, ChevronRight, Bell, BookOpen, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Profile() {
  const { theme, setTheme, selectedBoard, selectedClass, reset } = useAppStore();
  const { preferences, updatePreferences } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    reset();
    toast('Logged out successfully', { icon: '👋' });
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-md">
        <h1 className="mb-8 text-3xl font-bold text-slate-900 dark:text-white">Profile</h1>
        
        <div className="mb-8 flex items-center space-x-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            S
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Student User</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Class {selectedClass} • {selectedBoard}</p>
          </div>
        </div>

        <section className="mb-8">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Appearance</h3>
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-900">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                <Sun size={20} />
                <span className="font-medium">Theme</span>
              </div>
              <div className="flex space-x-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                {(['light', 'system', 'dark'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                      theme === t 
                        ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-400' 
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                    }`}
                  >
                    {t === 'system' ? <Monitor size={16} /> : t === 'light' ? <Sun size={16} /> : <Moon size={16} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Notifications</h3>
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
              <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                <Bell size={20} />
                <span className="font-medium">Test Reminders</span>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input 
                  type="checkbox" 
                  className="peer sr-only" 
                  checked={preferences.testReminders}
                  onChange={(e) => updatePreferences({ testReminders: e.target.checked })}
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:bg-slate-700 dark:peer-focus:ring-indigo-800"></div>
              </label>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
              <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                <BookOpen size={20} />
                <span className="font-medium">New Study Materials</span>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input 
                  type="checkbox" 
                  className="peer sr-only" 
                  checked={preferences.newMaterials}
                  onChange={(e) => updatePreferences({ newMaterials: e.target.checked })}
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:bg-slate-700 dark:peer-focus:ring-indigo-800"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                <AlertCircle size={20} />
                <span className="font-medium">Announcements</span>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input 
                  type="checkbox" 
                  className="peer sr-only" 
                  checked={preferences.announcements}
                  onChange={(e) => updatePreferences({ announcements: e.target.checked })}
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:bg-slate-700 dark:peer-focus:ring-indigo-800"></div>
              </label>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Account</h3>
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-900">
            <button 
              onClick={() => navigate('/home')}
              className="flex w-full items-center justify-between border-b border-slate-100 p-4 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
            >
              <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                <span className="font-medium">Change Class/Board</span>
              </div>
              <ChevronRight size={20} className="text-slate-400" />
            </button>
            <button 
              onClick={handleLogout}
              className="flex w-full items-center space-x-3 p-4 text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-500 dark:hover:bg-rose-500/10"
            >
              <LogOut size={20} />
              <span className="font-medium">Log Out</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

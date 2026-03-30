import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/lib/supabase';
import { useNotifications } from '@/contexts/NotificationContext';
import { Moon, Sun, Monitor, LogOut, ChevronRight, Bell, BookOpen, AlertCircle, Settings, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Logo } from '@/components/ui/Logo';
import AvatarUploadModal from '@/components/AvatarUploadModal';

export default function Profile() {
  const { theme, setTheme, selectedBoard, selectedClass, reset } = useAppStore();
  const { user } = useAuthStore();
  const { preferences, updatePreferences } = useNotifications();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user?.id)
        .single();

      if (!error && data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleLogout = () => {
    reset();
    toast('Logged out successfully', { icon: '👋' });
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-md">
        <h1 className="mb-8 text-3xl font-bold text-slate-900 dark:text-white">Profile</h1>
        
        <div className="mb-8 flex items-center space-x-4 rounded-2xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:bg-slate-900 relative">
          <div
            className="group relative flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-indigo-50 shadow-inner dark:bg-slate-800"
            onClick={() => setIsAvatarModalOpen(true)}
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <Logo className="h-10 w-10" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera size={20} className="text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              {profile?.full_name || 'Student User'}
            </h2>
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Class {selectedClass} • {selectedBoard}</p>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="rounded-full bg-slate-50 p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:text-indigo-400"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
        </div>

        <section className="mb-8">
          <h3 className="mb-4 pl-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Appearance</h3>
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:bg-slate-900">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                <div className="rounded-lg bg-slate-100 p-2 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <Sun size={20} />
                </div>
                <span className="font-medium">Theme</span>
              </div>
              <div className="flex space-x-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                {(['light', 'system', 'dark'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium capitalize transition-all duration-200 ${
                      theme === t 
                        ? 'bg-white text-indigo-600 shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:bg-slate-700 dark:text-indigo-400'
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
          <h3 className="mb-4 pl-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Notifications</h3>
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800/60">
              <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                <div className="rounded-lg bg-indigo-50 p-2 text-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <Bell size={20} />
                </div>
                <span className="font-medium">Test Reminders</span>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input 
                  type="checkbox" 
                  className="peer sr-only" 
                  checked={preferences.testReminders}
                  onChange={(e) => updatePreferences({ testReminders: e.target.checked })}
                />
                <div className="peer h-7 w-12 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:bg-white after:transition-all after:content-[''] after:shadow-sm peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:bg-slate-700 dark:peer-focus:ring-indigo-800"></div>
              </label>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800/60">
              <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <BookOpen size={20} />
                </div>
                <span className="font-medium">New Study Materials</span>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input 
                  type="checkbox" 
                  className="peer sr-only" 
                  checked={preferences.newMaterials}
                  onChange={(e) => updatePreferences({ newMaterials: e.target.checked })}
                />
                <div className="peer h-7 w-12 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:bg-white after:transition-all after:content-[''] after:shadow-sm peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:bg-slate-700 dark:peer-focus:ring-indigo-800"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                <div className="rounded-lg bg-amber-50 p-2 text-amber-500 dark:bg-amber-900/30 dark:text-amber-400">
                  <AlertCircle size={20} />
                </div>
                <span className="font-medium">Announcements</span>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input 
                  type="checkbox" 
                  className="peer sr-only" 
                  checked={preferences.announcements}
                  onChange={(e) => updatePreferences({ announcements: e.target.checked })}
                />
                <div className="peer h-7 w-12 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:bg-white after:transition-all after:content-[''] after:shadow-sm peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:bg-slate-700 dark:peer-focus:ring-indigo-800"></div>
              </label>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="mb-4 pl-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Account</h3>
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:bg-slate-900">
            <button 
              onClick={() => navigate('/home')}
              className="flex w-full items-center justify-between border-b border-slate-100 p-4 transition-colors hover:bg-slate-50 active:bg-slate-100 dark:border-slate-800/60 dark:hover:bg-slate-800/50 dark:active:bg-slate-800"
            >
              <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                <span className="font-medium">Change Class/Board</span>
              </div>
              <ChevronRight size={20} className="text-slate-400" />
            </button>
            <button 
              onClick={handleLogout}
              className="flex w-full items-center space-x-3 p-4 text-rose-600 transition-colors hover:bg-rose-50 active:bg-rose-100 dark:text-rose-500 dark:hover:bg-rose-500/10 dark:active:bg-rose-500/20"
            >
              <LogOut size={20} />
              <span className="font-medium">Log Out</span>
            </button>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="mb-4 pl-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Administration</h3>
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:bg-slate-900">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex w-full items-center justify-between p-4 transition-colors hover:bg-slate-50 active:bg-slate-100 dark:hover:bg-slate-800/50 dark:active:bg-slate-800"
            >
              <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                <span className="font-medium">Admin Panel</span>
              </div>
              <ChevronRight size={20} className="text-slate-400" />
            </button>
          </div>
        </section>
      </div>

      <AvatarUploadModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onUploadSuccess={(url) => setProfile((prev: any) => ({ ...prev, avatar_url: url }))}
      />
    </div>
  );
}

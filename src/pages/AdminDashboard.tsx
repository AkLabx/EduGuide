import { useNavigate } from 'react-router-dom';
import { BookOpen, Bell, ArrowLeft, PlusCircle } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <header className="sticky top-0 z-10 bg-indigo-600 px-4 py-4 text-white shadow-md dark:bg-indigo-900">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/profile')}
            className="rounded-full p-2 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <p className="text-xs text-indigo-200 dark:text-indigo-300">Central Control Panel</p>
          </div>
        </div>
      </header>

      <main className="px-4 pt-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Study Materials Card */}
          <div
            className="flex cursor-pointer flex-col items-center justify-center space-y-3 rounded-2xl bg-white p-6 shadow-sm transition-transform hover:scale-[1.02] active:scale-95 dark:bg-slate-900"
            onClick={() => navigate('/admin/study-materials')}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
              <PlusCircle size={32} />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Study Materials</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Upload notes, PDFs, and video links</p>
            </div>
          </div>

          {/* Homework Card */}
          <div
            className="flex cursor-pointer flex-col items-center justify-center space-y-3 rounded-2xl bg-white p-6 shadow-sm transition-transform hover:scale-[1.02] active:scale-95 dark:bg-slate-900"
            onClick={() => navigate('/admin/homework')}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
              <BookOpen size={32} />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Manage Homework</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Upload and view daily assignments</p>
            </div>
          </div>

          {/* Announcements Card */}
          <div
            className="flex cursor-pointer flex-col items-center justify-center space-y-3 rounded-2xl bg-white p-6 shadow-sm transition-transform hover:scale-[1.02] active:scale-95 dark:bg-slate-900"
            onClick={() => navigate('/admin/announcements')}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400">
              <Bell size={32} />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Manage Announcements</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Broadcast important updates</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

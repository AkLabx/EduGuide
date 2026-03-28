import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  CheckSquare,
  Clock,
  ChevronRight,
  BookOpen,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const hwCategories = [
  {
    id: 'daily',
    title: 'Daily HW',
    description: 'View today\'s assignments and tasks',
    icon: Calendar,
    color: 'text-indigo-600',
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
    border: 'border-indigo-200 dark:border-indigo-800'
  },
  {
    id: 'weekly',
    title: 'Weekly Plan',
    description: 'Check your study schedule for the week',
    icon: Clock,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    border: 'border-emerald-200 dark:border-emerald-800'
  },
  {
    id: 'past-papers',
    title: 'Past Papers',
    description: 'Practice with previous year question papers',
    icon: FileText,
    color: 'text-amber-600',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    border: 'border-amber-200 dark:border-amber-800'
  }
];

export default function Homework() {
  const navigate = useNavigate();

  const handleCategoryClick = (id: string) => {
    // For now, show a coming soon toast
    // In the future, this will navigate to specific routes like `/homework/daily`
    toast(`Coming soon: ${id.replace('-', ' ')} feature!`, {
      icon: '🚧',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
      <header className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm dark:bg-slate-900">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Homework & Planning
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Stay on top of your personalized tuition tasks
        </p>
      </header>

      <main className="px-4 pt-6">
        <div className="mb-6 rounded-2xl bg-indigo-600 p-5 text-white shadow-lg dark:bg-indigo-900">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold">Pending Tasks</h2>
              <p className="mt-1 text-indigo-100 text-sm">You have 3 assignments due this week.</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <CheckSquare size={20} className="text-white" />
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs font-medium">
              <span>Weekly Progress</span>
              <span>45%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-indigo-950/40">
              <div className="h-full w-[45%] rounded-full bg-white"></div>
            </div>
          </div>
        </div>

        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Categories</h2>

        <div className="grid gap-4">
          {hwCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`flex cursor-pointer items-center overflow-hidden rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-transparent hover:${category.border} transition-all active:scale-[0.98] dark:bg-slate-900`}
              >
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${category.bg} ${category.color}`}>
                  <Icon size={28} />
                </div>

                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{category.title}</h3>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{category.description}</p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                  <ChevronRight size={20} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

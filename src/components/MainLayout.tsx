import { Outlet } from 'react-router-dom';
import { BottomNav } from './ui/BottomNav';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
      <Outlet />
      <BottomNav />
    </div>
  );
}

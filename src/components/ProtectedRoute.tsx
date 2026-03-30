import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuthStore();
  const { selectedBoard, selectedClass } = useAppStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  // Not authenticated? Go to auth page.
  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Authenticated but hasn't picked a board/class yet? Force them to home.
  if (!selectedBoard || !selectedClass) {
    if (location.pathname !== '/home') {
      return <Navigate to="/home" replace />;
    }
  }

  return <>{children}</>;
}

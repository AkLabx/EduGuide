import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import Tests from './pages/Tests';
import Profile from './pages/Profile';
import { MainLayout } from './components/MainLayout';
import { InstallPrompt } from './components/ui/InstallPrompt';
import { Toaster } from 'react-hot-toast';
import { useAppStore } from './store/useAppStore';
import { NotificationProvider } from './contexts/NotificationContext';
import { DownloadsProvider } from './contexts/DownloadsContext';
import Notifications from './pages/Notifications';
import Downloads from './pages/Downloads';

export default function App() {
  const { theme } = useAppStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <NotificationProvider>
      <DownloadsProvider>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/home" element={<Home />} />
          
          {/* Main App Routes with Bottom Navigation */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/downloads" element={<Downloads />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <InstallPrompt />
        
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--toast-bg, #333)',
              color: 'var(--toast-color, #fff)',
              borderRadius: '16px',
              padding: '16px',
            },
            className: 'dark:bg-slate-800 dark:text-white',
          }}
        />
      </DownloadsProvider>
    </NotificationProvider>
  );
}

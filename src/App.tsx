import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAppStore } from './store/useAppStore';

// Pages
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import Tests from './pages/Tests';
import Profile from './pages/Profile';
import Homework from './pages/Homework';
import DailyHomework from './pages/DailyHomework';
import AdminHomework from './pages/AdminHomework';
import AdminLogin from './pages/AdminLogin';
import { AdminRoute } from './components/AdminRoute';

// Components & Contexts
import { MainLayout } from './components/MainLayout';
import { InstallPrompt } from './components/ui/InstallPrompt';
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
            <Route path="/homework" element={<Homework />} />
            <Route path="/homework/daily" element={<DailyHomework />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/homework" element={<AdminRoute><AdminHomework /></AdminRoute>} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/downloads" element={<Downloads />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <InstallPrompt />
        
        {/* Native Android Snackbar Style Toaster */}
        <Toaster 
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#323232', // Material Snackbar dark grey
              color: '#ffffff',
              borderRadius: '4px', // Slightly rounded corners like classic Material, or 8px for modern
              padding: '14px 16px',
              fontSize: '14px',
              fontWeight: 500,
              boxShadow: '0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12)', // Elevation 6
              marginBottom: '80px', // Above bottom nav
              minWidth: '288px', // Common mobile width
              maxWidth: '568px',
              justifyContent: 'flex-start',
            },
            className: 'dark:bg-slate-800 dark:text-white', // Tailwind overrides if needed, though inline style often wins in hot-toast
            success: {
              iconTheme: {
                primary: '#4ade80', // Emerald 400
                secondary: '#323232',
              },
            },
            error: {
              iconTheme: {
                primary: '#f87171', // Red 400
                secondary: '#323232',
              },
            },
          }}
        />
      </DownloadsProvider>
    </NotificationProvider>
  );
}

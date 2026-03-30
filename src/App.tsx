import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAppStore } from './store/useAppStore';
import { useAuthStore } from './store/useAuthStore';
import { supabase } from './lib/supabase';
import Auth from './pages/Auth';

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
import AdminStudyMaterials from './pages/AdminStudyMaterials';

import AdminDashboard from './pages/AdminDashboard';
import AdminAnnouncements from './pages/AdminAnnouncements';
import AdminLogin from './pages/AdminLogin';
import { AdminRoute } from './components/AdminRoute';
import { ProtectedRoute } from './components/ProtectedRoute';

// Components & Contexts
import { MainLayout } from './components/MainLayout';
import { InstallPrompt } from './components/ui/InstallPrompt';
import { NotificationProvider } from './contexts/NotificationContext';
import { DownloadsProvider } from './contexts/DownloadsContext';
import { PageLoader } from './components/ui/PageLoader';
import Notifications from './pages/Notifications';
import Downloads from './pages/Downloads';
import Settings from './pages/Settings';

export default function App() {
  const { theme } = useAppStore();
  const { setSession } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      // 1. Calling getSession() forces the Supabase client to inspect the current URL.
      // 2. If it finds auth tokens in the hash (e.g., #access_token=...), it extracts them,
      //    establishes the user session, and automatically clears the tokens from the URL history.
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      // 3. Once getSession() is complete (and the URL is clean), mark the app as ready.
      setIsReady(true);
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // If this code runs inside the auth popup (opened by Google OAuth),
      // close the popup immediately after successful sign-in.
      if (event === 'SIGNED_IN' && window.opener) {
        window.close();
        return;
      }
      setSession(session);
    });

    // Listen for storage events across tabs/windows (PWA / Popup support)
    const handleStorageChange = (event: StorageEvent) => {
      // Supabase stores auth tokens in localStorage with keys containing 'auth-token'
      if (event.key?.includes('auth-token') && event.newValue) {
        // A new auth token appeared, meaning a popup authentication was successful.
        // Reload the main window to bootstrap the app with the new authenticated state.
        console.log('Auth token changed in storage, reloading PWA...');
        window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setSession]);

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

  // Render a loading spinner or initial splash screen while checking the session
  if (!isReady) {
    return <PageLoader />;
  }

  // Only render the HashRouter AFTER the auth client has processed any potential redirect tokens.
  return (
    <NotificationProvider>
      <DownloadsProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/home" element={<Home />} />

            {/* Main App Routes with Bottom Navigation */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/subjects" element={<Subjects />} />
              <Route path="/homework" element={<Homework />} />
              <Route path="/homework/daily" element={<DailyHomework />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/homework" element={<AdminRoute><AdminHomework /></AdminRoute>} />
              <Route path="/admin/study-materials" element={<AdminRoute><AdminStudyMaterials /></AdminRoute>} />

              <Route path="/admin/announcements" element={<AdminRoute><AdminAnnouncements /></AdminRoute>} />
              <Route path="/tests" element={<Tests />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/downloads" element={<Downloads />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
        
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

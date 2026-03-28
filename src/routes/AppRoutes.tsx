import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { AppLayout } from '../components/layout/AppLayout';
import { PageLoader } from '../components/ui/PageLoader';

// Lazy loaded components
const Splash = lazy(() => import('../pages/Splash').then(m => ({ default: m.Splash })));
const Onboarding = lazy(() => import('../pages/Onboarding').then(m => ({ default: m.Onboarding })));
const Dashboard = lazy(() => import('../pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Syllabus = lazy(() => import('../pages/Syllabus').then(m => ({ default: m.Syllabus })));

const ProfileComingSoon = () => (
  <AppLayout>
    <div className="p-8 text-center text-gray-500 font-medium">Profile coming soon...</div>
  </AppLayout>
);

export function AppRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/syllabus/:subjectId" element={<AppLayout><Syllabus /></AppLayout>} />
          {/* Fallback routes */}
          <Route path="/syllabus" element={<Navigate to="/dashboard" replace />} />
          <Route path="/profile" element={<ProfileComingSoon />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

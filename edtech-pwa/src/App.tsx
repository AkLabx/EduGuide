import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import { AppLayout } from './components/layout/AppLayout';
import { PageLoader } from './components/ui/PageLoader';
import { Splash } from './pages/Splash';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Syllabus } from './pages/Syllabus';

function AnimatedRoutes() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageLoader />;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Splash />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/syllabus/:subjectId" element={<AppLayout><Syllabus /></AppLayout>} />
        {/* Fallback routes */}
        <Route path="/syllabus" element={<Navigate to="/dashboard" replace />} />
        <Route path="/profile" element={<AppLayout><div className="p-8 text-center text-gray-500 font-medium">Profile coming soon...</div></AppLayout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <>
      <Router>
        <AnimatedRoutes />
      </Router>
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'custom-toast',
          style: {
            borderRadius: '16px',
            background: '#1f2937',
            color: '#fff',
            fontWeight: 600,
            padding: '12px 24px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
    </>
  );
}

export default App;

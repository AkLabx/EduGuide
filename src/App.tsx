import { useEffect, useState } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { PageLoader } from './components/ui/PageLoader';
import { AppRoutes } from './routes/AppRoutes';

function AppContent() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageLoader />;

  return <AppRoutes />;
}

function App() {
  return (
    <>
      <Router>
        <AppContent />
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

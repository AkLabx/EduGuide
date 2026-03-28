import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserStore } from '../store/userStore';

export function Splash() {
  const navigate = useNavigate();
  const { profile } = useUserStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (profile?.hasCompletedOnboarding) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate, profile]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-primary-600 to-indigo-800">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center mb-6 overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-tr from-accent-400 to-primary-500 rounded-2xl"
          />
        </div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl font-extrabold text-white tracking-tight"
        >
          EdTech Guide
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-primary-100 mt-3 font-medium text-lg"
        >
          Learn. Grow. Succeed.
        </motion.p>
      </motion.div>
    </div>
  );
}

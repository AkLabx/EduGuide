import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Logo } from '@/components/ui/Logo';
import { useAppStore } from '@/store/useAppStore';

export default function Splash() {
  const navigate = useNavigate();
  const { hasSeenOnboarding, selectedBoard, selectedClass } = useAppStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasSeenOnboarding) {
        navigate('/onboarding');
      } else if (!selectedBoard || !selectedClass) {
        navigate('/home');
      } else {
        navigate('/dashboard');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate, hasSeenOnboarding, selectedBoard, selectedClass]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-indigo-600 text-white dark:bg-slate-950">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="flex flex-col items-center"
      >
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-white text-indigo-600 shadow-2xl dark:bg-slate-900">
          <Logo className="h-14 w-14" />
        </div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold tracking-tight"
        >
          EduGuide
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-3 text-indigo-200 dark:text-indigo-400"
        >
          Your Ultimate Study Companion
        </motion.p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-12"
      >
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="h-2 w-2 rounded-full bg-white/50"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
